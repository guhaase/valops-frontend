// src/services/authService.js - Versão corrigida
import axios from 'axios';
import config, { log } from '../config';
import { api } from './api';

// Constantes de segurança para caso config não esteja disponível
const STORAGE_KEYS = {
  matriculaKey: 'valops_mtrc',
  userDataKey: 'valops_user',
  tokenKey: 'valops_token'
};

// Função auxiliar segura para acessar chaves de armazenamento
const getStorageKey = (keyName) => {
  // Tenta obter do config, se disponível
  if (config && config.storage && config.storage[keyName]) {
    return config.storage[keyName];
  }
  // Fallback para constantes locais
  return STORAGE_KEYS[keyName] || keyName;
};

// Login com código de matrícula
const login = async (mtrc) => {
  try {
    log.debug('Enviando requisição de login com:', { mtrc });
    
    // Constrói URL da API com fallbacks seguros
    // Usar URL direta para garantir que o endpoint correto seja acessado
    const loginUrl = 'http://10.2.98.165:8000/api/login';
    
    log.debug('URL de login:', loginUrl);
    
    const response = await axios.post(loginUrl, { mtrc });
    
    log.debug('Resposta de login:', response.data);
    
    // Garantir que temos a informação de role
    let userData = {
      mtrc: response.data.mtrc,
      nome: response.data.nome,
      uor: response.data.uor,
      role: response.data.role || null // Armazenar papel do usuário (ADM ou null)
    };
    
    // Se a role não veio na resposta, fazer uma consulta adicional imediatamente
    if (!userData.role && response.data.mtrc) {
      try {
        log.debug('Role não encontrada na resposta, consultando endpoint específico...');
        const roleUrl = config?.api?.baseUrl 
          ? `${config.api.baseUrl}/api/login/user-role?matricula=${response.data.mtrc}`
          : `http://10.2.98.165:8000/api/login/user-role?matricula=${response.data.mtrc}`;
          
        // Adicionar headers necessários para autenticação
        const headers = {
          'X-Employee-MTRC': response.data.mtrc
        };
        
        const roleResponse = await axios.get(roleUrl, { headers });
        log.debug('Resposta de role:', roleResponse.data);
        
        if (roleResponse.data && roleResponse.data.role) {
          userData.role = roleResponse.data.role;
        }
      } catch (roleError) {
        log.error('Erro ao obter role do usuário:', roleError);
      }
    }
    
    // Publicar um evento para notificar toda a aplicação
    const authEvent = new CustomEvent('auth-state-changed', { 
      detail: { isLoggedIn: true, userData } 
    });
    window.dispatchEvent(authEvent);
    
    // Armazenar matrícula e dados do usuário usando as chaves da configuração
    localStorage.setItem(getStorageKey('matriculaKey'), response.data.mtrc);
    localStorage.setItem(getStorageKey('userDataKey'), JSON.stringify(userData));
    
    // Definir header de autenticação para requisições futuras
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    }
    
    if (axios && axios.defaults && axios.defaults.headers) {
      axios.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    }
    
    // Também definir no axios global (para maior consistência)
    if (window.axios && window.axios.defaults && window.axios.defaults.headers) {
      window.axios.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
    }
    
    return {...response.data, role: userData.role};
  } catch (error) {
    log.error('Erro de login:', error);
    if (error.response) {
      log.error('Resposta de erro:', error.response.data);
      log.error('Status:', error.response.status);
    }
    throw error.response?.data || { detail: 'Erro ao fazer login' };
  }
};

// Logout do usuário
const logout = () => {
  // Armazenar temporariamente os dados do usuário para criar o evento
  const userData = getCurrentUser();
  
  // Remover dados do localStorage
  localStorage.removeItem(getStorageKey('matriculaKey'));
  localStorage.removeItem(getStorageKey('userDataKey'));
  
  // Remover dos diversos headers
  if (api && api.defaults && api.defaults.headers) {
    delete api.defaults.headers.common['X-Employee-MTRC'];
  }
  
  if (axios && axios.defaults && axios.defaults.headers) {
    delete axios.defaults.headers.common['X-Employee-MTRC'];
  }
  
  if (window.axios && window.axios.defaults && window.axios.defaults.headers) {
    delete window.axios.defaults.headers.common['X-Employee-MTRC'];
  }
  
  log.debug('Logout realizado, matrícula e headers removidos');
  
  // Publicar evento para notificar toda a aplicação sobre o logout
  const authEvent = new CustomEvent('auth-state-changed', { 
    detail: { isLoggedIn: false, userData: null, previousUser: userData }
  });
  window.dispatchEvent(authEvent);
};

// Verificar se o usuário está autenticado
const isAuthenticated = () => {
  const mtrc = localStorage.getItem(getStorageKey('matriculaKey'));
  return !!mtrc;
};

// Obter dados do usuário atual
const getCurrentUser = () => {
  const userStr = localStorage.getItem(getStorageKey('userDataKey'));
  if (!userStr) return null;
  try {
    // Obter dados do usuário do localStorage
    const userData = JSON.parse(userStr);
    
    // Log para debug
    log.debug('Dados do usuário obtidos do localStorage:', userData);
    
        // Não definimos mais automaticamente o papel ADM para todos os usuários
    // Precisamos preservar o papel do usuário conforme definido pelo backend
    
    return userData;
  } catch (error) {
    log.error('Erro ao processar dados do usuário:', error);
    // Em caso de erro de parsing, limpar dados e retornar null
    localStorage.removeItem(getStorageKey('userDataKey'));
    return null;
  }
};

// Obter matrícula
const getMatricula = () => {
  return localStorage.getItem(getStorageKey('matriculaKey'));
};

// Inicializar autenticação - chamar quando o app inicia
const initAuth = () => {
  const mtrc = getMatricula();
  if (mtrc) {
    log.debug('Inicializando autenticação com matrícula:', mtrc);
    
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    if (axios && axios.defaults && axios.defaults.headers) {
      axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    if (window.axios && window.axios.defaults && window.axios.defaults.headers) {
      window.axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    return true;
  }
  return false;
};

// Função para atualizar os headers de autenticação
const refreshAuthHeaders = () => {
  const mtrc = getMatricula();
  if (mtrc) {
    log.debug('Atualizando headers de autenticação com matrícula:', mtrc);
    
    // Definir em todas as instâncias conhecidas do axios
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    if (axios && axios.defaults && axios.defaults.headers) {
      axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    if (window.axios && window.axios.defaults && window.axios.defaults.headers) {
      window.axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
    }
    
    return true;
  } else {
    log.warn('Não foi possível atualizar headers - matrícula não encontrada');
    return false;
  }
};

// Validar a matrícula (tentando fazer uma chamada simples à API)
const validateMatricula = async () => {
  try {
    // A validação mais simples é buscar as categorias
    const categoriesEndpoint = config?.api?.endpoints?.categories || '/model-types/categories';
    const response = await api.get(categoriesEndpoint);
    log.debug('Matrícula validada com sucesso');
    return true;
  } catch (error) {
    log.error('Erro ao validar matrícula:', error);
    return false;
  }
};

// Verificar se o usuário possui determinado papel/role
const hasRole = (requiredRole) => {
  const userData = getCurrentUser();
  if (!userData || !userData.role) return false;
  
  // Para diagnóstico
  console.log('[authService.hasRole] Verificando papel:', userData.role, 'contra requerido:', requiredRole);
  
  // Para papel ADM, apenas o papel ADM tem acesso
  if (requiredRole === 'ADM') {
    const hasAccess = userData.role === 'ADM' || userData.role === 'SUPER';
    console.log('[authService.hasRole] Verificação de acesso ADM:', hasAccess);
    return hasAccess;
  }
  
  // SUPER pode acessar tudo
  if (userData.role === 'SUPER') {
    console.log('[authService.hasRole] Tem acesso SUPER');
    return true;
  }
  
  // GER pode acessar algumas áreas específicas
  if (userData.role === 'GER' && ['GER', 'user'].includes(requiredRole)) {
    console.log('[authService.hasRole] Tem acesso GER');
    return true;
  }
  
  // Verificação específica de papel
  const hasAccess = userData.role === requiredRole;
  console.log('[authService.hasRole] Verificação específica:', hasAccess);
  return hasAccess;
};

// Verificar se o usuário é administrador
const isAdmin = () => {
  const userData = getCurrentUser();
  const isUserAdmin = userData && (userData.role === 'ADM' || userData.role === 'SUPER');
  
  // Para diagnóstico
  console.log('[authService.isAdmin] Verificando dados:', {
    nome: userData?.nome,
    matricula: userData?.mtrc,
    papel: userData?.role,
    éAdmin: isUserAdmin
  });
  
  return isUserAdmin;
};

// Exportar todos os métodos
const authService = {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getMatricula,
  initAuth,
  refreshAuthHeaders,
  validateMatricula,
  hasRole,
  isAdmin
};

export default authService;