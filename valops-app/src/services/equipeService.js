// src/services/equipeService.js
import api from './api';

const equipeService = {
  /**
   * Obtém todas as equipes
   * @returns {Promise<Array>} Lista de equipes
   */
  getAll: async () => {
    try {
      const response = await api.get('/equipes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
      throw error;
    }
  },
  
  /**
   * Obtém equipes agrupadas por gerência e área
   * @returns {Promise<Object>} Objeto com equipes agrupadas
   */
  getAgrupadas: async () => {
    try {
      const response = await api.get('/equipes/agrupadas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipes agrupadas:', error);
      throw error;
    }
  },
  
  /**
   * Obtém equipes por gerência
   * @param {string} gerencia Nome da gerência
   * @returns {Promise<Array>} Lista de equipes da gerência
   */
  getByGerencia: async (gerencia) => {
    try {
      const response = await api.get(`/equipes/gerencia/${gerencia}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipes da gerência ${gerencia}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém equipes por área
   * @param {string} area Nome da área
   * @returns {Promise<Array>} Lista de equipes da área
   */
  getByArea: async (area) => {
    try {
      const response = await api.get(`/equipes/area/${area}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipes da área ${area}:`, error);
      throw error;
    }
  },
  
  /**
   * Busca equipes por termo de pesquisa
   * @param {string} termo Termo de busca
   * @returns {Promise<Array>} Lista de equipes compatíveis com a busca
   */
  search: async (termo) => {
    try {
      const response = await api.get(`/equipes/search?q=${encodeURIComponent(termo)}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipes com o termo "${termo}":`, error);
      throw error;
    }
  }
};

export default equipeService;