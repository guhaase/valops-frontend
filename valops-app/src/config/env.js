// src/config/env.js - Um arquivo separado para lidar com variáveis de ambiente
let envVars = {};

// Tenta diferentes métodos para acessar variáveis de ambiente
if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Método Vite
    envVars = import.meta.env;
    console.log('Usando variáveis de ambiente do Vite:', import.meta.env);
    
    // Log para debug
    console.log('ENV_VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
    console.log('ENV_VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('ENV_VITE_DEBUG:', import.meta.env.VITE_DEBUG);
} else if (typeof process !== 'undefined' && process.env) {
    // Método Webpack/Node
    envVars = process.env;
    console.log('Usando variáveis de ambiente do Webpack/Node');
} else {
    // Fallback para objeto vazio
    console.warn('Não foi possível acessar variáveis de ambiente, usando valores padrão');
}

// Função para obter variáveis de ambiente com fallbacks
export function getEnv(key, defaultValue) {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // Para Vite, acessar diretamente
        return import.meta.env[key] || defaultValue;
    }
    return envVars[key] || defaultValue;
}

// Exporta um objeto com todas as variáveis de ambiente usadas pela aplicação
const env = {
    API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:8000'),
    APP_TITLE: getEnv('VITE_APP_TITLE', 'ValOps'),
    APP_ENV: getEnv('VITE_APP_ENV', 'development'),
    DEBUG: getEnv('VITE_DEBUG', 'false') === 'true',
    APP_VERSION: getEnv('VITE_APP_VERSION', '1.0.0')
};

// Log para debug de configurações finais
console.log('Configurações de ambiente carregadas:', {
    API_BASE_URL: env.API_BASE_URL,
    APP_TITLE: env.APP_TITLE,
    APP_ENV: env.APP_ENV,
    DEBUG: env.DEBUG,
    APP_VERSION: env.APP_VERSION
});

export default env;