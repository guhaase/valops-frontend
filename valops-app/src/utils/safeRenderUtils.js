// src/utils/safeRenderUtils.js

/**
 * Converte qualquer valor para um formato seguro para renderização no React
 * Evita erros de "Objects are not valid as a React child"
 * @param {any} value - O valor a ser convertido
 * @returns {string|number|null} - Um valor seguro para renderização
 */
export const safeRender = (value) => {
    // Se for null ou undefined, retornar string vazia (ou outro valor padrão)
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Se for string ou número, retornar o valor diretamente
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    
    // Se for um array, converter para string
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    
    // Se for um objeto, converter para string (mas truncar para não ficar muito grande)
    if (typeof value === 'object') {
      try {
        const str = JSON.stringify(value);
        return str.length > 50 ? `${str.substring(0, 50)}...` : str;
      } catch (e) {
        return '[Objeto complexo]';
      }
    }
    
    // Para qualquer outro tipo, converter para string
    return String(value);
  };
  
  /**
   * Versão curta de safeRender que trunca strings longas
   * @param {any} value - O valor a ser convertido
   * @param {number} maxLength - Tamanho máximo da string resultante
   * @returns {string|number|null} - Um valor seguro para renderização
   */
  export const safeRenderShort = (value, maxLength = 50) => {
    const rendered = safeRender(value);
    
    if (typeof rendered === 'string' && rendered.length > maxLength) {
      return `${rendered.substring(0, maxLength)}...`;
    }
    
    return rendered;
  };