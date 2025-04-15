/**
 * TrainingService - Serviço para gerenciar o catálogo de treinamentos
 * Este serviço fornece métodos para acessar, filtrar e gerenciar materiais de treinamento
 */

import api from './api';

// Definir a URL base da API (usando o mesmo host que os outros endpoints da API)
import config from '../config';
const API_BASE_URL = `${config.api.baseUrl}/api/training`;

// Sempre usando dados reais do banco MySQL

/**
 * Classe para gerenciar o catálogo de treinamentos
 */
class TrainingService {
  /**
   * Obtém todos os materiais de treinamento com opções de filtragem
   * @param {Object} params - Parâmetros de filtragem
   * @param {string} params.category - ID da categoria para filtrar
   * @param {string} params.search - Termo de busca
   * @param {string} params.level - Nível do material (Iniciante, Intermediário, Avançado)
   * @param {string} params.dateRange - Filtro de data (last_week, last_month, last_year)
   * @param {string} params.minRating - Classificação mínima
   * @param {number} params.page - Número da página para paginação
   * @param {number} params.pageSize - Tamanho da página para paginação
   * @returns {Promise<Object>} - Promessa com os resultados da busca e metadados
   */
  async getTrainingMaterials(params = {}) {
    try {
      console.log('Buscando materiais com parâmetros:', params);
      
      // Sempre usar dados reais do banco MySQL
      console.log('Obtendo dados reais do banco de dados');
      const realMaterials = await this._getRealMaterials();
      const filteredMaterials = this._filterMaterials(realMaterials, params);
      
      return {
        items: filteredMaterials,
        pagination: {
          page: params.page || 1,
          pageSize: params.page_size || 10,
          totalItems: realMaterials.length,
          totalPages: Math.ceil(realMaterials.length / (params.page_size || 10))
        }
      };
    } catch (error) {
      console.error('Erro ao obter materiais de treinamento:', error);
      throw new Error('Não foi possível obter materiais de treinamento');
    }
  }
  
  // Método para buscar materiais de treinamento no banco de dados MySQL
  async _getRealMaterials() {
    try {
      // Consulta real ao banco de dados
      console.log('Buscando dados reais da tabela de treinamentos');
      
      // A URL da API deve ser construída com base no ambiente atual
      const trainingMaterialsUrl = `${API_BASE_URL}/real-materials`;
      
      const response = await api.get(trainingMaterialsUrl);
      console.log('Dados obtidos do banco:', response.data);
      
      // Se obteve dados com sucesso, retorna-os
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Se não conseguiu obter dados ou o retorno não é do formato esperado
      console.error('Retorno da API não contém um array de materiais');
      throw new Error('Dados recebidos da API não estão no formato esperado');
      
    } catch (error) {
      console.error('Erro ao consultar banco de dados real:', error);
      // Propaga o erro para ser tratado pelo chamador ao invés de usar dados fictícios
      throw new Error(`Falha ao obter dados reais: ${error.message || 'Erro desconhecido'}`);
    }
  }
  
  // Método privado para filtrar materiais de acordo com parâmetros
  _filterMaterials(materials, params) {
    let filtered = [...materials];
    
    if (params.category) {
      filtered = filtered.filter(m => m.category_id === params.category);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchLower) || 
        m.description.toLowerCase().includes(searchLower) ||
        (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    if (params.level) {
      filtered = filtered.filter(m => m.level === params.level);
    }
    
    if (params.min_rating) {
      filtered = filtered.filter(m => m.rating >= parseFloat(params.min_rating));
    }
    
    if (params.date_range) {
      const now = new Date();
      let startDate;
      
      if (params.date_range === 'LAST_WEEK') {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (params.date_range === 'LAST_MONTH') {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (params.date_range === 'LAST_YEAR') {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }
      
      if (startDate) {
        filtered = filtered.filter(m => new Date(m.publish_date) >= startDate);
      }
    }
    
    // Ordenar por data de publicação (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    
    // Paginação
    const page = params.page || 1;
    const pageSize = params.page_size || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return filtered.slice(start, end);
  }

  /**
   * Obtém as categorias de treinamento disponíveis
   * @returns {Promise<Array>} - Promessa com a lista de categorias
   */
  async getCategories() {
    try {
      // Sempre tentar usar a API real
      
      console.log('Chamando API de categorias');
      const response = await api.get(`${API_BASE_URL}/categories`);
      console.log('Resposta da API de categorias:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter categorias de treinamento:', error);
      
      // Propagar o erro para ser tratado pelo chamador
      throw new Error(`Falha ao obter categorias: ${error.message || 'Erro desconhecido'}`);
    }
  }

  /**
   * Obtém detalhes de um material de treinamento específico
   * @param {number} id - ID do material de treinamento
   * @returns {Promise<Object>} - Promessa com os detalhes do material
   */
  async getMaterial(id) {
    try {
      const response = await api.get(`${API_BASE_URL}/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter material de treinamento #${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém detalhes completos de um material de treinamento para a página de detalhes
   * @param {number} id - ID do material de treinamento
   * @param {boolean} forceRefresh - Se true, adiciona um parâmetro para evitar cache
   * @returns {Promise<Object>} - Promessa com os detalhes completos do material
   */
  async getMaterialDetail(id, forceRefresh = false) {
    try {
      // Adicionar timestamp para evitar cache quando forceRefresh é true
      const url = forceRefresh 
        ? `${API_BASE_URL}/materials/${id}/detail?t=${new Date().getTime()}` 
        : `${API_BASE_URL}/materials/${id}/detail`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter detalhes completos do material #${id}:`, error);
      // Retornar null em vez de lançar erro para permitir fallback para os dados padrão
      return null;
    }
  }

  /**
   * Obtém estatísticas sobre os materiais de treinamento
   * @returns {Promise<Object>} - Promessa com as estatísticas
   */
  async getStatistics() {
    try {
      // Sempre tentar usar a API real
      
      console.log('Chamando API de estatísticas');
      const response = await api.get(`${API_BASE_URL}/statistics`);
      console.log('Resposta da API de estatísticas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de treinamento:', error);
      
      // Propagar o erro para ser tratado pelo chamador
      throw new Error(`Falha ao obter estatísticas: ${error.message || 'Erro desconhecido'}`);
    }
  }

  /**
   * Registra uma visualização ou download de material
   * @param {number} id - ID do material de treinamento
   * @param {string} action - Ação realizada ('view' ou 'download')
   * @returns {Promise<Object>} - Promessa com confirmação da ação
   */
  async trackUsage(id, action) {
    try {
      // Sempre tentar usar a API real
      
      console.log(`Chamando API para registrar ${action} para material #${id}`);
      const response = await api.post(`${API_BASE_URL}/materials/${id}/track`, { action });
      console.log('Resposta da API de trackUsage:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao registrar ${action} para material #${id}:`, error);
      
      // Propagar o erro para ser tratado pelo chamador
      throw new Error(`Falha ao registrar ${action}: ${error.message || 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualiza o progresso do usuário em um material de treinamento
   * @param {number} id - ID do material de treinamento
   * @param {Object} progress - Dados de progresso
   * @param {number} progress.percentage - Porcentagem de conclusão
   * @param {string} progress.position - Posição atual no material
   * @param {boolean} progress.completed - Se o material foi concluído
   * @returns {Promise<Object>} - Promessa com os dados de progresso atualizados
   */
  async updateProgress(id, progress) {
    try {
      const response = await api.post(`${API_BASE_URL}/materials/${id}/progress`, progress);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar progresso para material #${id}:`, error);
      throw error;
    }
  }

  /**
   * Avalia um material de treinamento
   * @param {number} id - ID do material de treinamento
   * @param {Object} rating - Dados da avaliação
   * @param {number} rating.value - Valor da avaliação (0-5)
   * @param {string} rating.comment - Comentário opcional
   * @returns {Promise<Object>} - Promessa com os dados da avaliação
   */
  async rateMaterial(id, rating) {
    try {
      const response = await api.post(`${API_BASE_URL}/materials/${id}/rate`, rating);
      return response.data;
    } catch (error) {
      console.error(`Erro ao avaliar material #${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém todas as avaliações de um material
   * @param {number} id - ID do material de treinamento
   * @param {number} page - Número da página para paginação
   * @param {number} limit - Limite de resultados por página
   * @returns {Promise<Object>} - Promessa com a lista de avaliações
   */
  async getMaterialRatings(id, page = 1, limit = 10) {
    try {
      const response = await api.get(`${API_BASE_URL}/materials/${id}/ratings`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter avaliações do material #${id}:`, error);
      // Retornar objeto vazio em vez de lançar erro
      return { items: [], total: 0 };
    }
  }
  
  /**
   * Obtém a avaliação do usuário atual para um material
   * @param {number} id - ID do material de treinamento
   * @returns {Promise<Object>} - Promessa com a avaliação do usuário
   */
  async getUserRating(id) {
    try {
      const response = await api.get(`${API_BASE_URL}/materials/${id}/ratings/me`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Usuário ainda não avaliou este material
        return null;
      }
      
      // Log o erro, mas não o propague para não interromper o fluxo do usuário
      console.error(`Erro ao obter avaliação do usuário para material #${id}:`, error);
      return null;
    }
  }
  
  /**
   * Remove uma avaliação
   * @param {number} ratingId - ID da avaliação a ser removida
   * @returns {Promise<Object>} - Promessa com confirmação da remoção
   */
  async deleteRating(ratingId) {
    try {
      const response = await api.delete(`${API_BASE_URL}/ratings/${ratingId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover avaliação #${ratingId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém materiais de treinamento em destaque
   * @param {number} limit - Número máximo de materiais a retornar
   * @returns {Promise<Array>} - Promessa com a lista de materiais em destaque
   */
  async getFeaturedMaterials(limit = 4) {
    try {
      const response = await api.get(`${API_BASE_URL}/featured`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter materiais em destaque:', error);
      throw error;
    }
  }

  /**
   * Obtém todas as tags disponíveis
   * @returns {Promise<Array>} - Promessa com a lista de tags
   */
  async getTags() {
    try {
      const response = await api.get(`${API_BASE_URL}/tags`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter tags de treinamento:', error);
      throw error;
    }
  }

  /**
   * Para administradores: Adiciona um novo material de treinamento
   * @param {Object} material - Dados do material a ser adicionado
   * @returns {Promise<Object>} - Promessa com o material criado
   */
  async addMaterial(material) {
    try {
      // Para upload de arquivos, é necessário usar FormData
      const formData = new FormData();
      
      // Adicionar campos de texto
      Object.keys(material).forEach(key => {
        if (key !== 'file' && key !== 'thumbnail' && key !== 'tags') {
          formData.append(key, material[key]);
        }
      });
      
      // Adicionar tags como um array JSON
      if (material.tags && Array.isArray(material.tags)) {
        formData.append('tags', JSON.stringify(material.tags));
      }
      
      // Adicionar arquivos, se presentes
      if (material.file) {
        formData.append('file', material.file);
      }
      
      if (material.thumbnail) {
        formData.append('thumbnail', material.thumbnail);
      }
      
      const response = await api.post(`${API_BASE_URL}/materials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar material de treinamento:', error);
      throw error;
    }
  }

  /**
   * Para administradores: Atualiza um material de treinamento existente
   * @param {number} id - ID do material a ser atualizado
   * @param {Object} material - Dados atualizados do material
   * @returns {Promise<Object>} - Promessa com o material atualizado
   */
  async updateMaterial(id, material) {
    try {
      // Mesmo tratamento para FormData que no método addMaterial
      const formData = new FormData();
      
      Object.keys(material).forEach(key => {
        if (key !== 'file' && key !== 'thumbnail' && key !== 'tags') {
          formData.append(key, material[key]);
        }
      });
      
      if (material.tags && Array.isArray(material.tags)) {
        formData.append('tags', JSON.stringify(material.tags));
      }
      
      if (material.file) {
        formData.append('file', material.file);
      }
      
      if (material.thumbnail) {
        formData.append('thumbnail', material.thumbnail);
      }
      
      const response = await api.put(`${API_BASE_URL}/materials/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar material de treinamento #${id}:`, error);
      throw error;
    }
  }

  /**
   * Para administradores: Remove um material de treinamento
   * @param {number} id - ID do material a ser removido
   * @returns {Promise<Object>} - Promessa com confirmação da remoção
   */
  async deleteMaterial(id) {
    try {
      const response = await api.delete(`${API_BASE_URL}/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover material de treinamento #${id}:`, error);
      throw error;
    }
  }
}

export default new TrainingService();