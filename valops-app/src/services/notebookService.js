// src/services/notebookService.js
import { toast } from 'react-toastify';
import axios from 'axios';

/**
 * Serviço para gerenciar operações com notebooks
 */
const notebookService = {
  /**
   * Envia um arquivo de notebook para o backend
   * @param {File} file - Arquivo do notebook
   * @param {Object} metadata - Metadados do notebook (tags, etc)
   * @param {Function} onProgress - Callback para progresso do upload
   * @returns {Promise} Resultado da operação
   */
  uploadNotebook: async (file, metadata = {}, onProgress = null) => {
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
      
      const response = await axios.post('/api/notebooks', formData, config);
      
      // Usar o mesmo formato de notificação do simulador de teste
      notebookService.simulateUpload();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do notebook:', error);
      toast.error('Falha ao enviar o notebook. Por favor, tente novamente.');
      throw error;
    }
  },
  
  /**
   * Obtém lista de notebooks
   * @param {Object} filters - Filtros para a consulta
   * @returns {Promise} Lista de notebooks
   */
  getNotebooks: async (filters = {}) => {
    try {
      const response = await axios.get('/api/notebooks', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notebooks:', error);
      toast.error('Falha ao carregar notebooks.');
      throw error;
    }
  },
  
  /**
   * Obtém um notebook pelo ID
   * @param {string} id - ID do notebook
   * @returns {Promise} Notebook solicitado
   */
  getNotebookById: async (id) => {
    try {
      const response = await axios.get(`/api/notebooks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar notebook ${id}:`, error);
      toast.error('Falha ao carregar o notebook.');
      throw error;
    }
  },
  
  /**
   * Atualiza um notebook existente
   * @param {string} id - ID do notebook
   * @param {Object} data - Dados atualizados
   * @returns {Promise} Resultado da operação
   */
  updateNotebook: async (id, data) => {
    try {
      const response = await axios.put(`/api/notebooks/${id}`, data);
      
      toast.success('Notebook atualizado com sucesso!');
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar notebook ${id}:`, error);
      toast.error('Falha ao atualizar o notebook.');
      throw error;
    }
  },
  
  /**
   * Exclui um notebook
   * @param {string} id - ID do notebook
   * @returns {Promise} Resultado da operação
   */
  deleteNotebook: async (id) => {
    try {
      const response = await axios.delete(`/api/notebooks/${id}`);
      
      toast.success('Notebook excluído com sucesso!');
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir notebook ${id}:`, error);
      toast.error('Falha ao excluir o notebook.');
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
        <strong>Notebook enviado com sucesso!</strong>
        <div>
          <span className="font-semibold text-green-700">Matrícula:</span> {matricula}
        </div>
        <div>
          <span className="font-semibold text-green-700">Data/Hora:</span> {formattedDate}
        </div>
      </div>,
      {
        icon: "📓",
        className: "success-toast",
        style: { background: "#ecfdf5", borderLeft: "4px solid #10b981", color: "#065f46" }
      }
    );
    
    return Promise.resolve({
      id: 'test-id',
      name: 'Test Notebook',
      success: true
    });
  }
};

export default notebookService;