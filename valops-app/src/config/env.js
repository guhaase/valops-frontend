// Variáveis de ambiente para o frontend

// Determina o ambiente atual (development, staging, production)
const environment = process.env.NODE_ENV || 'development';

// Define URLs base para os diferentes ambientes
const baseURLs = {
  development: 'http://localhost:8000',
  staging: 'http://staging-api.valops.local',
  production: 'http://localhost:8000'  // Apontando diretamente para o backend
};

// API URL base para o ambiente atual
const apiBaseURL = process.env.REACT_APP_API_BASE_URL || baseURLs[environment] || baseURLs.development;

// Configurações de timeout para requisições (em ms)
const apiTimeouts = {
  default: 30000,  // 30 segundos para requisições comuns
  upload: 300000,  // 5 minutos para uploads
  download: 120000 // 2 minutos para downloads
};

// Exporta as configurações
export default {
  apiBaseURL,
  apiTimeouts,
  environment
};