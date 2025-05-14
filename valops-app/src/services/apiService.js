// src/services/apiService.js
import axios from 'axios';
import config, { log } from '../config';

// Criar a instância do axios com a URL base
const apiService = axios.create({
  baseURL: config.api.baseUrl, // Usando a URL configurada em config/env.js
  timeout: config.api.timeout || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar a matrícula em todas as requisições
apiService.interceptors.request.use(
  (requestConfig) => {
    // Obter matrícula atualizada em vez de usar o cache
    const mtrc = localStorage.getItem(config.storage.matriculaKey);
    log.debug('Interceptor - Matrícula:', mtrc || 'Nenhuma matrícula encontrada');
    
    if (mtrc) {
      requestConfig.headers['X-Employee-MTRC'] = mtrc;
      log.debug('Adicionando matrícula à requisição:', requestConfig.url);
    } else {
      // Remover header de matrícula se não houver matrícula
      delete requestConfig.headers['X-Employee-MTRC'];
      log.warn('Requisição sem matrícula:', requestConfig.url);
    }
    return requestConfig;
  },
  (error) => {
    log.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador para lidar com erros de autenticação
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    log.error('Erro na resposta:', error);
    
    // Interceptar erros 401 (não autenticado) ou 403 (não autorizado)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      log.warn(`Erro de autenticação: ${error.response.status} - ${error.response.data?.detail || 'Sem detalhes'}`);
      
      // Para solucionar o problema, vamos limpar a matrícula e redirecionar
      localStorage.removeItem(config.storage.matriculaKey);
      localStorage.removeItem(config.storage.userDataKey);
      delete apiService.defaults.headers.common['X-Employee-MTRC'];
      
      // Apenas redirecionar se não for uma operação em segundo plano
      // e não estiver já na página de login
      if (window.location.pathname !== '/login') {
        log.info('Redirecionando para a página de login devido a erro de autenticação');
        window.location.href = '/login';
      }
    }
    
    // Logs detalhados para diagnóstico apenas em modo de debug
    if (config.app.debug) {
      if (error.response) {
        log.debug('Detalhes do erro de resposta:');
        log.debug('Status:', error.response.status);
        log.debug('Data:', error.response.data);
        log.debug('Headers:', error.response.headers);
      }
      
      if (error.config) {
        log.debug('Configuração da requisição que falhou:');
        log.debug('URL:', error.config.url);
        log.debug('Método:', error.config.method);
        log.debug('Headers:', error.config.headers);
      }
    }
    
    return Promise.reject(error);
  }
);

// Função unificada para atualizar os headers de autenticação
const refreshAuthHeaders = () => {
  const mtrc = localStorage.getItem(config.storage.matriculaKey);
  if (mtrc) {
    log.debug('Atualizando headers de autenticação com matrícula:', mtrc);
    
    // Definir no serviço atual
    apiService.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    
    // Definir globalmente no axios, caso seja usado em outros lugares
    axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    
    // Verificar se temos o window.axios (usado no LoginHandler)
    if (window.axios) {
      window.axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    return true;
  } else {
    log.warn('Não foi possível atualizar headers - matrícula não encontrada');
    return false;
  }
};

// Serviço de autenticação para ambiente de produção (usando BBSSOToken)
const usuarioService = async () => {
  if (config.app.environment === 'production') {
    try {
      // Obter o token SSO do BB
      const { data: bbssotoken } = await axios.get(
        "https://app.dicoi.intranet.bb.com.br/portal-express/api/usuarios/bbssotoken",
        { withCredentials: true }
      );

      
      log.debug('Obtido BBSSOToken para autenticação');
      
      // Consultar o usuário com base no token obtido
      const response = await apiService.get(`/api/usuarios/usuario/${bbssotoken}`);
      
      console.log("token", response);


      // Verificar se o usuário existe na base funci e qual seu papel em valops_main.admin_users
      const userRole = await apiService.get(`/admins/check-user-role?bbssotoken=${bbssotoken}`);
      
      // Combinar os dados do usuário com seu papel
      const userData = {
        ...response.data,
        role: userRole.data?.role || null
      };
      
      log.debug('Dados do usuário obtidos via BBSSOToken:', userData);
      return userData;
    } catch (error) {
      log.error('Erro ao usar serviço de usuário BB:', error);
      throw error;
    }
  }
  return null;
};

// Função para autenticação automática em produção
const autoLogin = async () => {
  try {
    if (config.app.environment === 'production') {
      log.debug('Iniciando auto-login em ambiente de produção');
      
      // Verificar cookie BBSSOToken
      log.debug('Verificando cookie BBSSOToken...');
      
      try {
        // Obter o token SSO
        const { data: bbssotoken } = await axios.get(
          "https://app.dicoi.intranet.bb.com.br/portal-express/api/usuarios/bbssotoken",
          { withCredentials: true }
        );
        
        log.debug('BBSSOToken obtido:', bbssotoken);
        
        // Obter dados do usuário a partir do token
        const userData = await usuarioService();
        
        if (!userData || !userData.mtrc) {
          log.error('Dados de usuário inválidos do serviço BB');
          throw new Error('Falha na autenticação automática - dados de usuário inválidos');
        }
        
        // Armazenar matrícula e dados do usuário
        localStorage.setItem(config.storage.matriculaKey, userData.mtrc);
        localStorage.setItem(config.storage.userDataKey, JSON.stringify(userData));
        
        // Definir a matrícula para as próximas requisições
        apiService.defaults.headers.common['X-Employee-MTRC'] = userData.mtrc;
        axios.defaults.headers.common['X-Employee-MTRC'] = userData.mtrc;
        
        if (window.axios) {
          window.axios.defaults.headers.common['X-Employee-MTRC'] = userData.mtrc;
        }
        
        log.debug('Auto-login bem-sucedido:', userData.mtrc);
        log.debug('Papel do usuário:', userData.role);
        
        return userData;
      } catch (error) {
        log.error('Erro ao obter BBSSOToken:', error);
        throw new Error('Falha na autenticação automática - erro ao obter BBSSOToken');
      }
    }
    return null;
  } catch (error) {
    log.error('Erro no auto-login:', error);
    throw error;
  }
};

// Função melhorada para login que imprime mais informações
const login = async (mtrc) => {
  try {
    log.debug('Tentando login com matrícula:', mtrc);
    
    // Usar URL configurada para o endpoint de login
    const loginUrl = `${config.api.baseUrl}/login`;
    log.debug('URL de login direto:', loginUrl);
    
    const response = await axios.post(loginUrl, { mtrc });
    log.debug('Resposta de login:', response.data);
    
    // Verificar se a resposta contém matrícula
    if (!response.data.mtrc) {
      log.error('Resposta de login não contém matrícula:', response.data);
      throw new Error('Resposta de login inválida');
    }
    
    // Armazenar matrícula e dados do usuário (incluindo role se disponível)
    localStorage.setItem(config.storage.matriculaKey, response.data.mtrc);
    localStorage.setItem(config.storage.userDataKey, JSON.stringify({
      mtrc: response.data.mtrc,
      nome: response.data.nome,
      uor: response.data.uor,
      role: response.data.role || null
    }));
    
    log.debug('Matrícula armazenada:', response.data.mtrc);
    log.debug('Usuário armazenado:', JSON.stringify({
      mtrc: response.data.mtrc,
      nome: response.data.nome,
      uor: response.data.uor,
      role: response.data.role || null
    }));
    
    // Definir a matrícula para as próximas requisições
    apiService.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    
    // Também definir no axios global (para maior consistência)
    axios.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    
    // Se temos window.axios, definir lá também
    if (window.axios) {
      window.axios.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    }
    
    log.debug('Matrícula definida nos headers padrão');
    
    return response.data;
  } catch (error) {
    log.error('Erro de login:', error);
    if (error.response) {
      log.error('Detalhes do erro:', error.response.data);
      log.error('Status:', error.response.status);
    }
    throw error;
  }
};

// Funções auxiliares para trabalhar com a API
const apiHelper = {
  // Compartilhar o objeto de configuração para acesso fácil
  config,
  
  // Funções específicas para artigos
  articles: {
    getAll: async (params = {}) => {
      try {
        log.debug('Buscando artigos com params:', params);
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(config.api.endpoints.articles, { params });
        return response.data;
      } catch (error) {
        log.error('Erro ao buscar artigos:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(`${config.api.endpoints.articles}/${id}`);
        return response.data;
      } catch (error) {
        log.error(`Erro ao buscar artigo ${id}:`, error);
        throw error;
      }
    },
    
    create: async (formData) => {
      try {
        log.debug('Criando artigo...');
        // Verificar a matrícula antes de enviar
        const mtrc = localStorage.getItem(config.storage.matriculaKey);
        log.debug('Matrícula antes de criar artigo:', mtrc || 'Nenhuma matrícula');
        
        if (!mtrc) {
          throw new Error('Sem matrícula para criar artigo');
        }
        
        // Verificação explícita da matrícula no header da requisição
        const headers = {
          'Content-Type': 'multipart/form-data',
          'X-Employee-MTRC': mtrc
        };
        
        log.debug('Matrícula adicionada explicitamente aos headers:', mtrc);
        
        // Usar o axios padrão diretamente para evitar problemas com a reescrita de path
        const fullUrl = `${config.api.baseUrl}${config.api.endpoints.articles}`;
        log.debug('Enviando requisição para URL completa:', fullUrl);
        
        const response = await axios.post(fullUrl, formData, { headers });
        log.debug('Artigo criado com sucesso:', response.data);
        return response.data;
      } catch (error) {
        log.error('Erro ao criar artigo:', error);
        if (error.response) {
          log.error('Detalhes do erro:', error.response.data);
          log.error('Status:', error.response.status);
        }
        throw error;
      }
    },
    
    update: async (id, data) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.put(`${config.api.endpoints.articles}/${id}`, data);
        return response.data;
      } catch (error) {
        log.error(`Erro ao atualizar artigo ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.delete(`${config.api.endpoints.articles}/${id}`);
        return response.data;
      } catch (error) {
        log.error(`Erro ao excluir artigo ${id}:`, error);
        throw error;
      }
    },
    
    download: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(`${config.api.endpoints.articles}/${id}/download`, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        log.error(`Erro ao baixar artigo ${id}:`, error);
        throw error;
      }
    },
    
    analyzePdf: async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Verificar a matrícula antes de enviar
        const mtrc = localStorage.getItem(config.storage.matriculaKey);
        log.debug('Matrícula antes de analisar PDF:', mtrc || 'Nenhuma matrícula');
        
        // Verificação explícita da matrícula no header da requisição
        const headers = {
          'Content-Type': 'multipart/form-data',
        };
        
        if (mtrc) {
          headers['X-Employee-MTRC'] = mtrc;
          log.debug('Matrícula adicionada explicitamente aos headers para análise de PDF');
        } else {
          throw new Error('Sem matrícula para analisar PDF');
        }
        
        const response = await apiService.post(`${config.api.endpoints.articles}/analyze-pdf`, formData, { headers });
        return response.data;
      } catch (error) {
        log.error('Erro ao analisar PDF:', error);
        throw error;
      }
    },
  },
  
  // Funções específicas para notebooks
  notebooks: {
    getAll: async (params = {}) => {
      try {
        log.debug('Buscando notebooks com params:', params);
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(config.api.endpoints.notebooks, { params });
        return response.data;
      } catch (error) {
        log.error('Erro ao buscar notebooks:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(`${config.api.endpoints.notebooks}/${id}`);
        return response.data;
      } catch (error) {
        log.error(`Erro ao buscar notebook ${id}:`, error);
        throw error;
      }
    },
    
    create: async (data) => {
      try {
        log.debug('Criando notebook com dados:', data);
        
        // Verificar a matrícula antes de enviar
        const mtrc = localStorage.getItem(config.storage.matriculaKey);
        log.debug('Matrícula antes de criar notebook:', mtrc || 'Nenhuma matrícula');
        
        if (!mtrc) {
          throw new Error('Sem matrícula para criar notebook');
        }
        
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        
        // Verificação explícita da matrícula no header da requisição
        const headers = {
          'Content-Type': 'application/json',
          'X-Employee-MTRC': mtrc
        };
        
        log.debug('Matrícula adicionada explicitamente aos headers para criação de notebook');
        
        const response = await apiService.post(config.api.endpoints.notebooks, data, { headers });
        log.debug('Notebook criado com sucesso:', response.data);
        return response.data;
      } catch (error) {
        log.error('Erro ao criar notebook:', error);
        if (error.response) {
          log.error('Detalhes do erro:', error.response.data);
          log.error('Status:', error.response.status);
        }
        throw error;
      }
    },
    
    update: async (id, data) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.put(`${config.api.endpoints.notebooks}/${id}`, data);
        return response.data;
      } catch (error) {
        log.error(`Erro ao atualizar notebook ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.delete(`${config.api.endpoints.notebooks}/${id}`);
        return response.data;
      } catch (error) {
        log.error(`Erro ao excluir notebook ${id}:`, error);
        throw error;
      }
    },
    
    download: async (id) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(`${config.api.endpoints.notebooks}/${id}/download`, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        log.error(`Erro ao baixar notebook ${id}:`, error);
        throw error;
      }
    },
  },
  
  // Funções para categorias e subcategorias
  categories: {
    getAll: async () => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(config.api.endpoints.categories);
        return response.data;
      } catch (error) {
        log.error('Erro ao buscar categorias:', error);
        throw error;
      }
    },
  },
  
  subcategories: {
    getAll: async (categoryId = null) => {
      try {
        let url = config.api.endpoints.subcategories;
        if (categoryId) {
          url += `?parent_category_id=${categoryId}`;
        }
        
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(url);
        return response.data;
      } catch (error) {
        log.error('Erro ao buscar subcategorias:', error);
        throw error;
      }
    },
  },
  
  // Funções para tags
  tags: {
    getAll: async () => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.get(config.api.endpoints.tags);
        return response.data;
      } catch (error) {
        log.error('Erro ao buscar tags:', error);
        throw error;
      }
    },
    
    create: async (data) => {
      try {
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        const response = await apiService.post(config.api.endpoints.tags, data);
        return response.data;
      } catch (error) {
        log.error('Erro ao criar tag:', error);
        throw error;
      }
    },
  },
  

  // Funções de autenticação
  auth: {
    login,
    autoLogin,
    
    logout: () => {
      localStorage.removeItem(config.storage.matriculaKey);
      localStorage.removeItem(config.storage.userDataKey);
      delete apiService.defaults.headers.common['X-Employee-MTRC'];
      delete axios.defaults.headers.common['X-Employee-MTRC'];
      if (window.axios) {
        delete window.axios.defaults.headers.common['X-Employee-MTRC'];
      }
      log.debug('Logout realizado, matrículas e headers removidos');
    },
    
    isAuthenticated: () => {
      const mtrc = localStorage.getItem(config.storage.matriculaKey);
      return !!mtrc;
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem(config.storage.userDataKey);
      return user ? JSON.parse(user) : null;
    },
    
    getMatricula: () => {
      return localStorage.getItem(config.storage.matriculaKey);
    },
    
    refreshAuthHeaders,
    
    // Validar a matrícula (tentando fazer uma chamada simples à API)
    validateMatricula: async () => {
      try {
        // A validação mais simples é buscar as categorias
        const response = await apiService.get(config.api.endpoints.categories);
        log.debug('Matrícula validada com sucesso');
        return true;
      } catch (error) {
        log.error('Erro ao validar matrícula:', error);
        return false;
      }
    }
  },
  
  // Função para upload genérico de arquivos
  upload: {
    file: async (file) => {
      try {
        log.debug('Fazendo upload de arquivo:', file.name);
        
        const formData = new FormData();
        formData.append('file', file);
        
        // Verificar a matrícula antes de enviar
        const mtrc = localStorage.getItem(config.storage.matriculaKey);
        log.debug('Matrícula antes de upload:', mtrc || 'Nenhuma matrícula');
        
        if (!mtrc) {
          throw new Error('Sem matrícula para fazer upload');
        }
        
        // Garantir autenticação antes de fazer a chamada
        refreshAuthHeaders();
        
        // Verificação explícita da matrícula no header da requisição
        const headers = {
          'Content-Type': 'multipart/form-data',
          'X-Employee-MTRC': mtrc
        };
        
        log.debug('Matrícula adicionada explicitamente aos headers para upload');
        
        const response = await apiService.post(config.api.endpoints.upload, formData, { headers });
        log.debug('Upload concluído com sucesso:', response.data);
        return response.data;
      } catch (error) {
        log.error('Erro ao fazer upload de arquivo:', error);
        if (error.response) {
          log.error('Detalhes do erro:', error.response.data);
          log.error('Status:', error.response.status);
        }
        throw error;
      }
    },
  },
  
  // Função para verificação geral de saúde da API
  healthCheck: async () => {
    try {
      // Verificar se a API está disponível
      const response = await apiService.get('/');
      return {
        status: 'online',
        message: response.data.message || 'API está online'
      };
    } catch (error) {
      return {
        status: 'offline',
        message: 'API está offline ou inacessível'
      };
    }
  },
  
  // Referência ao serviço original para casos especiais
  apiService
};

// Inicializar o cabeçalho de autenticação se houver uma matrícula armazenada
const storedMtrc = localStorage.getItem(config.storage.matriculaKey);
if (storedMtrc) {
  log.debug('Matrícula encontrada no localStorage. Inicializando headers.');
  refreshAuthHeaders();
}

export { apiService };
export default apiHelper;