// src/config/index.js
import env from './env';

const config = {
  // API e endpoints
  api: {
    baseUrl: env.API_BASE_URL,
    timeout: 30000, // 30 segundos
    endpoints: {
      articles: '/articles',
      notebooks: '/notebooks',
      upload: '/upload',
      tags: '/tags',
      login: '/api/login',  // Corrigido para acessar o endpoint correto
      categories: '/model-types/categories',
      subcategories: '/model-types/subcategories',
      admins: '/admins'
    }
  },
    
  // Configurações da aplicação
  app: {
    name: env.APP_TITLE,
    environment: env.APP_ENV,
    debug: env.DEBUG,
    version: env.APP_VERSION
  },
    
  // Configurações de armazenamento local
  storage: {
    matriculaKey: 'valops_mtrc',
    userDataKey: 'valops_user',
    tokenKey: 'valops_token'
  }
};

// Restante do arquivo permanece inalterado...

/**
 * Função para construir URLs completas da API
 * @param {string} endpoint - O endpoint da API (sem barra inicial)
 * @returns {string} URL completa
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = config.api.baseUrl;
    
  // Garantir que não haja barras duplicadas
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
  // Construir e retornar URL completa
  return `${baseUrl}${formattedEndpoint}`;
};

/**
 * Verifica se a aplicação está em ambiente de desenvolvimento
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return config.app.environment === 'development';
};

/**
 * Verifica se o modo de debug está ativo
 * @returns {boolean}
 */
export const isDebugMode = () => {
  return config.app.debug;
};

/**
 * Logs condicionais que só aparecem em modo de desenvolvimento/debug
 */
export const log = {
  debug: (...args) => {
    if (isDebugMode()) {
      console.debug('[ValOps Debug]', ...args);
    }
  },
  info: (...args) => {
    if (isDebugMode()) {
      console.info('[ValOps Info]', ...args);
    }
  },
  warn: (...args) => {
    console.warn('[ValOps Warning]', ...args);
  },
  error: (...args) => {
    console.error('[ValOps Error]', ...args);
  }
};

export default config;