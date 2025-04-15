// services/workqueueService.js
import api from './api';
import authService from './authService';

/**
 * Serviço para gerenciar a fila de trabalho de validação.
 */
const workqueueService = {
  /**
   * Obtém a lista de itens na fila de validação prévia.
   * 
   * @param {Object} params - Parâmetros de paginação
   * @param {number} params.skip - Número de registros para pular
   * @param {number} params.limit - Número máximo de registros para retornar
   * @returns {Promise<Object>} - Resposta da API com os itens da fila
   */
  async getValidationQueuePrevia(params = { skip: 0, limit: 100 }) {
    try {
      const response = await api.get('/validation-queue/previa', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter fila de validação prévia:', error);
      throw error;
    }
  },
  
  /**
   * Atualiza a equipe associada a um modelo.
   * 
   * @param {Object} data - Dados da equipe a atualizar
   * @param {string} data.gaia - GAIA do modelo
   * @param {string} data.versao - Versão do modelo
   * @param {string} data.prefixo - Prefixo da equipe
   * @param {string} data.equipe - Nome da nova equipe
   * @returns {Promise<Object>} - Resposta da API com o resultado da atualização
   */
  async updateEquipe(data) {
    try {
      // Adicionar a matrícula do usuário atual
      const userData = authService.getCurrentUser();
      const matricula = userData?.mtrc || 'anonymous';
      
      const payload = {
        ...data,
        matricula
      };
      
      const response = await api.post('/equipe/update', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      throw error;
    }
  },
  
  /**
   * Obtém o histórico de alterações de equipe.
   * 
   * @param {Object} params - Parâmetros de consulta
   * @param {number} params.skip - Número de registros para pular
   * @param {number} params.limit - Número máximo de registros para retornar
   * @param {string} [params.gaia] - Filtro opcional por GAIA
   * @param {string} [params.versao] - Filtro opcional por versão
   * @returns {Promise<Object>} - Resposta da API com o histórico de alterações
   */
  async getEquipeLog(params = { skip: 0, limit: 100 }) {
    try {
      console.log('Requesting logs with params:', params);
      const response = await api.get('/equipe/log', { params });
      
      // Validar e processar a resposta para garantir o formato correto
      const data = response.data || {};
      
      // Garantir que logs seja um array
      if (!Array.isArray(data.logs)) {
        console.warn('Logs não é um array na resposta da API:', data);
        data.logs = [];
      }
      
      // Normalizar os dados de log
      data.logs = data.logs.map(log => ({
        id: log.id,
        gaia: log.gaia || '',
        versao: log.versao || '',
        prefixo: log.prefixo || '',
        equipe_anterior: log.equipe_anterior || null,
        equipe_nova: log.equipe_nova || '',
        data_alteracao: log.data_alteracao ? new Date(log.data_alteracao) : new Date(),
        matricula_autor: log.matricula_autor || ''
      }));
      
      // Garantir que total seja um número
      data.total = typeof data.total === 'number' ? data.total : data.logs.length;
      
      console.log('Processed log data:', data);
      return data;
    } catch (error) {
      console.error('Erro ao obter histórico de alterações de equipe:', error);
      // Retornar objeto vazio em caso de erro para não quebrar a UI
      return { logs: [], total: 0 };
    }
  },
  
  /**
   * Obtém a lista de itens na fila de revalidação.
   * 
   * @param {Object} params - Parâmetros de paginação
   * @param {number} params.skip - Número de registros para pular
   * @param {number} params.limit - Número máximo de registros para retornar
   * @returns {Promise<Object>} - Resposta da API com os itens da fila
   */
  async getRevalidationQueue(params = { skip: 0, limit: 100 }) {
    try {
      // Esta API ainda não está implementada no backend
      // const response = await api.get('/validation-queue/revalidacao', { params });
      // return response.data;
      
      // Por enquanto, retorna dados simulados
      return {
        items: [
          {
            id: 'REV-2025-004',
            modelo: 'Modelo Precificação Dinâmica',
            tipo: 'Regressão',
            motivo: 'Trimestral',
            dataAgendada: '2025-04-15',
            status: 'programado'
          },
          {
            id: 'REV-2025-003',
            modelo: 'Classificador de Documentos',
            tipo: 'NLP',
            motivo: 'Alerta de Drift',
            dataAgendada: '2025-04-05',
            status: 'urgente'
          }
        ],
        total: 2,
        urgentes: 1,
        programadas: 1,
        concluidas: 0
      };
    } catch (error) {
      console.error('Erro ao obter fila de revalidação:', error);
      throw error;
    }
  },
  
  /**
   * Obtém a lista de itens na fila de validação posterior (monitoramento).
   * 
   * @param {Object} params - Parâmetros de paginação
   * @param {number} params.skip - Número de registros para pular
   * @param {number} params.limit - Número máximo de registros para retornar
   * @returns {Promise<Object>} - Resposta da API com os itens da fila
   */
  async getPostValidationQueue(params = { skip: 0, limit: 100 }) {
    try {
      // Esta API ainda não está implementada no backend
      // const response = await api.get('/validation-queue/posterior', { params });
      // return response.data;
      
      // Por enquanto, retorna dados simulados
      return {
        items: [
          {
            id: 'MON-2025-001',
            modelo: 'Detecção de Fraudes v1.5',
            ambiente: 'Produção',
            emProducaoDesde: '2025-01-15',
            saude: 'saudavel',
            ultimaValidacao: '2025-03-20'
          },
          {
            id: 'MON-2025-003',
            modelo: 'Recomendação de Produtos v2.1',
            ambiente: 'Produção',
            emProducaoDesde: '2025-02-05',
            saude: 'atencao',
            ultimaValidacao: '2025-03-25'
          }
        ],
        total: 2,
        saudaveis: 1,
        atencao: 1,
        criticos: 0
      };
    } catch (error) {
      console.error('Erro ao obter fila de validação posterior:', error);
      throw error;
    }
  }
};

export default workqueueService;