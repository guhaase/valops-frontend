// src/services/adminService.js
import apiHelper from './apiService';
import axios from 'axios';  // Importar axios para requisições diretas
import config from '../config';

/**
 * Serviço para gerenciamento de administradores no sistema ValOps
 */
const adminService = {
  /**
   * Verifica se o usuário atual é um administrador
   * @returns {Promise<boolean>} True se o usuário for administrador
   */
  isCurrentUserAdmin: async () => {
    try {
      // Primeiro, tentar verificar pelo papel do usuário no localStorage
      const user = apiHelper.auth.getCurrentUser();
      if (user && user.role) {
        const role = user.role;
        console.log('[adminService] Verificando papel do usuário do localStorage:', role);
        
        if (role === 'ADM' || role === 'SUPER' || role === 'SUPERADM' || role === 'super_admin') {
          console.log('[adminService] Acesso permitido baseado no papel do localStorage');
          return true;
        }
      }
      
      // Usar a apiService diretamente ou fazer uma requisição manual
      try {
        // Verificar se temos o método apiService disponível
        if (apiHelper.apiService) {
          console.log('[adminService] Usando apiHelper.apiService...');
          const response = await apiHelper.apiService.get('/admins/am-i-admin');
          return response.data === true;
        } else {
          // Fallback para chamada axios direta
          console.log('[adminService] Usando axios diretamente...');
          const baseUrl = config.api.baseUrl;
          const mtrc = localStorage.getItem(config.storage.matriculaKey);
          
          const headers = {};
          if (mtrc) {
            headers['X-Employee-MTRC'] = mtrc;
          }
          
          const response = await axios.get(`${baseUrl}/admins/am-i-admin`, { headers });
          return response.data === true;
        }
      } catch (apiError) {
        console.error('[adminService] Erro na chamada API:', apiError);
        // Se falhar a verificação da API, verificar pelo papel de ADM no localStorage
        return false;
      }
    } catch (error) {
      console.error('[adminService] Erro ao verificar permissões de administrador:', error);
      return false;
    }
  },
  
  /**
   * Lista todos os administradores
   * @returns {Promise<Array>} Lista de administradores
   */
  getAllAdmins: async () => {
    try {
      const baseUrl = config.api.baseUrl;
      const mtrc = localStorage.getItem(config.storage.matriculaKey);
      
      const headers = {};
      if (mtrc) {
        headers['X-Employee-MTRC'] = mtrc;
      }
      
      const response = await axios.get(`${baseUrl}/admins/`, { headers });
      return response.data;
    } catch (error) {
      console.error('[adminService] Erro ao buscar administradores:', error);
      throw error;
    }
  },
  
  /**
   * Adiciona um novo administrador
   * @param {string} mtrc - Matrícula do funcionário
   * @param {string} role - Função do administrador (opcional)
   * @returns {Promise<Object>} Administrador criado
   */
  addAdmin: async (mtrc, role = 'admin') => {
    try {
      const baseUrl = config.api.baseUrl;
      const userMtrc = localStorage.getItem(config.storage.matriculaKey);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (userMtrc) {
        headers['X-Employee-MTRC'] = userMtrc;
      }
      
      const response = await axios.post(`${baseUrl}/admins/`, { mtrc, role }, { headers });
      return response.data;
    } catch (error) {
      console.error('[adminService] Erro ao adicionar administrador:', error);
      throw error;
    }
  },
  
  /**
   * Remove um administrador
   * @param {string} mtrc - Matrícula do administrador a ser removido
   * @returns {Promise<boolean>} Verdadeiro se removido com sucesso
   */
  removeAdmin: async (mtrc) => {
    try {
      const baseUrl = config.api.baseUrl;
      const userMtrc = localStorage.getItem(config.storage.matriculaKey);
      
      const headers = {};
      if (userMtrc) {
        headers['X-Employee-MTRC'] = userMtrc;
      }
      
      const response = await axios.delete(`${baseUrl}/admins/${mtrc}`, { headers });
      return response.data;
    } catch (error) {
      console.error('[adminService] Erro ao remover administrador:', error);
      throw error;
    }
  },

  /**
   * Adiciona o primeiro administrador ao sistema (uso único)
   * @param {string} mtrc - Matrícula do primeiro administrador
   * @returns {Promise<Object>} Dados do administrador criado
   */
  seedFirstAdmin: async (mtrc) => {
    try {
      const baseUrl = config.api.baseUrl;
      const userMtrc = localStorage.getItem(config.storage.matriculaKey);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (userMtrc) {
        headers['X-Employee-MTRC'] = userMtrc;
      }
      
      const response = await axios.post(`${baseUrl}/admins/seed-first-admin`, { mtrc }, { headers });
      return response.data;
    } catch (error) {
      console.error('[adminService] Erro ao adicionar primeiro administrador:', error);
      throw error;
    }
  }
};

export default adminService;