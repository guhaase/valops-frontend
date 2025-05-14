// src/services/articleService.js
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../config';

/**
 * Serviço para gerenciar operações com artigos
 */
const articleService = {
  /**
   * Envia um arquivo de artigo para o backend
   * @param {File} file - Arquivo do artigo (PDF)
   * @param {Object} metadata - Metadados do artigo (tags, etc)
   * @param {Function} onProgress - Callback para progresso do upload
   * @returns {Promise} Resultado da operação
   */
  uploadArticle: async (file, metadata = {}, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Adicionar metadados ao formData
      if (metadata.tags) {
        formData.append('tags', JSON.stringify(metadata.tags));
      }
      
      if (metadata.title) {
        formData.append('title', metadata.title);
      }
      
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress ? 
          progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          } : undefined
      };
      
      // Obter matrícula do usuário
      const userData = JSON.parse(localStorage.getItem('valops_user') || '{}');
      const matricula = userData?.mtrc || 'Usuário';
      
      if (matricula) {
        config.headers['X-Employee-MTRC'] = matricula;
      }
      
      // Use the complete URL from environment configuration
      const response = await axios.post(`${config.api.baseUrl}/articles`, formData, config);
      
      // Mostrar notificação de sucesso
      const date = new Date();
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      toast.success(
        <div>
          <strong>Artigo enviado com sucesso!</strong>
          <div>
            <span className="font-semibold text-green-700">Matrícula:</span> {matricula}
          </div>
          <div>
            <span className="font-semibold text-green-700">Data/Hora:</span> {formattedDate}
          </div>
        </div>,
        {
          icon: "📄",
          className: "success-toast",
          style: { background: "#ecfdf5", borderLeft: "4px solid #10b981", color: "#065f46" }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do artigo:', error);
      toast.error('Falha ao enviar o artigo. Por favor, tente novamente.');
      throw error;
    }
  },
  
  /**
   * Obtém lista de artigos
   * @param {Object} filters - Filtros para a consulta
   * @returns {Promise} Lista de artigos
   */
  getArticles: async (filters = {}) => {
    try {
      const response = await axios.get('/api/articles', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast.error('Falha ao carregar artigos. Verifique sua conexão.');
      throw error;
    }
  },
  
  /**
   * Obtém um artigo pelo ID
   * @param {string} id - ID do artigo
   * @returns {Promise} Artigo solicitado
   */
  getArticleById: async (id) => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar artigo ${id}:`, error);
      toast.error('Falha ao carregar o artigo.');
      throw error;
    }
  },
  
  /**
   * Atualiza um artigo existente
   * @param {string} id - ID do artigo
   * @param {Object} data - Dados atualizados
   * @returns {Promise} Resultado da operação
   */
  updateArticle: async (id, data) => {
    try {
      const response = await axios.put(`/api/articles/${id}`, data);
      
      toast.success('Artigo atualizado com sucesso!');
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar artigo ${id}:`, error);
      toast.error('Falha ao atualizar o artigo.');
      throw error;
    }
  },
  
  /**
   * Exclui um artigo
   * @param {string} id - ID do artigo
   * @returns {Promise} Resultado da operação
   */
  deleteArticle: async (id) => {
    try {
      const response = await axios.delete(`/api/articles/${id}`);
      
      toast.success('Artigo excluído com sucesso!');
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir artigo ${id}:`, error);
      toast.error('Falha ao excluir o artigo.');
      throw error;
    }
  },
  
  /**
   * Simula um upload bem-sucedido (para teste)
   */
  simulateUpload: () => {
    // Obter matrícula do usuário
    const userData = JSON.parse(localStorage.getItem('valops_user') || '{}');
    const matricula = userData?.mtrc || 'F3876812';
      
    // Mostrar notificação verde de sucesso
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    toast.success(
      <div>
        <strong>Artigo enviado com sucesso!</strong>
        <div>
          <span className="font-semibold text-green-700">Matrícula:</span> {matricula}
        </div>
        <div>
          <span className="font-semibold text-green-700">Data/Hora:</span> {formattedDate}
        </div>
      </div>,
      {
        icon: "📄",
        className: "success-toast",
        style: { background: "#ecfdf5", borderLeft: "4px solid #10b981", color: "#065f46" }
      }
    );
    
    return Promise.resolve({
      id: 'test-id',
      title: 'Test Article',
      success: true
    });
  }
};

export default articleService;