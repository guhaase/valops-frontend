// src/services/api.js
import axios from 'axios';
import config, { log } from '../config';

// Create an axios instance
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens and matricula
api.interceptors.request.use(
  (requestConfig) => {
    try {
      // Verificar token JWT se existir
      if (config && config.storage && config.storage.tokenKey) {
        const token = localStorage.getItem(config.storage.tokenKey);
        if (token) {
          requestConfig.headers['Authorization'] = `Bearer ${token}`;
          log.debug('Token adicionado aos headers da requisição');
        }
      }
      
      // Adicionar matrícula aos headers, se disponível
      if (config && config.storage && config.storage.matriculaKey) {
        const mtrc = localStorage.getItem(config.storage.matriculaKey);
        if (mtrc) {
          requestConfig.headers['X-Employee-MTRC'] = mtrc;
          console.log(`Adicionando matrícula ${mtrc} aos headers da requisição`);
        } else {
          // Fallback: usar uma matrícula padrão para desenvolvimento
          requestConfig.headers['X-Employee-MTRC'] = 'F3876812'; // Matrícula de exemplo para desenvolvimento
          console.log('Usando matrícula padrão F3876812 para desenvolvimento');
        }
      } else {
        // Fallback caso config não esteja disponível
        const mtrc = localStorage.getItem('valops_mtrc');
        if (mtrc) {
          requestConfig.headers['X-Employee-MTRC'] = mtrc;
          console.log(`Adicionando matrícula ${mtrc} aos headers da requisição (fallback)`);
        } else {
          // Último fallback - matrícula para desenvolvimento
          requestConfig.headers['X-Employee-MTRC'] = 'F3876812';
          console.log('Usando matrícula padrão F3876812 para desenvolvimento (fallback)');
        }
      }
    } catch (error) {
      console.error('Erro ao configurar headers:', error);
      // Garantir que sempre haja uma matrícula mesmo em caso de erro
      requestConfig.headers['X-Employee-MTRC'] = 'F3876812';
    }
    
    return requestConfig;
  },
  (error) => {
    log.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      // Handle 401/403 errors by redirecting to login
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        log.warn(`Erro de autenticação: ${error.response.status}`);
        
        // Limpar dados de autenticação se config estiver disponível
        if (config && config.storage) {
          if (config.storage.tokenKey) {
            localStorage.removeItem(config.storage.tokenKey);
          }
          if (config.storage.userDataKey) {
            localStorage.removeItem(config.storage.userDataKey);
          }
          if (config.storage.matriculaKey) {
            localStorage.removeItem(config.storage.matriculaKey);
          }
        }
        
        // Se não estiver na página de login, redirecionar
        if (window.location.pathname !== '/login') {
          log.info('Redirecionando para a página de login');
          window.location.href = '/login';
        }
      }
      
      if (config && config.app && config.app.debug && error.response) {
        log.debug('Detalhes do erro na resposta:');
        log.debug('Status:', error.response.status);
        log.debug('Dados:', error.response.data);
      }
    } catch (interceptorError) {
      console.error('Erro no interceptor de resposta:', interceptorError);
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares
const apiService = {
  // Método GET genérico
  get: async (endpoint, params = {}) => {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      log.error(`GET ${endpoint} falhou:`, error);
      throw error;
    }
  },
  
  // Método POST genérico
  post: async (endpoint, data = {}) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      log.error(`POST ${endpoint} falhou:`, error);
      throw error;
    }
  },
  
  // Método PUT genérico
  put: async (endpoint, data = {}) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      log.error(`PUT ${endpoint} falhou:`, error);
      throw error;
    }
  },
  
  // Método DELETE genérico
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      log.error(`DELETE ${endpoint} falhou:`, error);
      throw error;
    }
  },
};

export { api, apiService };
export default api;