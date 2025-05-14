// Variáveis de ambiente para o frontend

// Determina o ambiente atual (development, staging, production)
const environment = process.env.NODE_ENV || 'development';

// Define URL padrão para fallback
const defaultApiURL = 'http://localhost:8000';

// API URL base - obter da variável de ambiente ou usar o padrão
const apiBaseURL = process.env.REACT_APP_API_BASE_URL || defaultApiURL;

// Configurações de timeout para requisições (em ms)
const apiTimeouts = {
  default: parseInt(process.env.REACT_APP_DEFAULT_TIMEOUT) || 30000,  // 30 segundos para requisições comuns
  upload: parseInt(process.env.REACT_APP_UPLOAD_TIMEOUT) || 300000,  // 5 minutos para uploads
  download: parseInt(process.env.REACT_APP_DOWNLOAD_TIMEOUT) || 120000 // 2 minutos para downloads
};

// Configurações de aplicação
const APP_TITLE = process.env.REACT_APP_APP_TITLE || 'ValOps';
const APP_ENV = process.env.REACT_APP_APP_ENV || environment;
const DEBUG = process.env.REACT_APP_DEBUG === 'true';
const APP_VERSION = process.env.REACT_APP_APP_VERSION || '1.0.0';

// Exporta as configurações
export default {
  apiBaseURL,
  apiTimeouts,
  environment,
  APP_TITLE,
  APP_ENV,
  DEBUG,
  APP_VERSION
};