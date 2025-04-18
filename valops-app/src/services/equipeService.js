// src/services/equipeService.js
import api from './api';

const equipeService = {
  /**
   * Obtém todas as equipes
   * @returns {Promise<Array>} Lista de equipes
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/equipes');
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
      const response = await api.get('/api/equipes/agrupadas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipes agrupadas:', error);
      throw error;
    }
  },
  
  /**
   * Obtém equipes simples (DICOI) usando o novo endpoint simplificado
   * @returns {Promise<Array>} Lista de equipes simples
   */
  getEquipesSimples: async () => {
    try {
      console.log('Buscando equipes simples...');
      const response = await api.get('/api/equipes/equipes_simples');
      console.log('Resposta da API (equipes simples):', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar equipes simples:', error);
      return [];
    }
  },
  
  /**
   * Obtém uma equipe específica pela sigla (sgl_dvs)
   * @param {string} sigla Sigla da divisão (ex: GEVAO, GEARC)
   * @returns {Promise<Object>} Dados da equipe
   */
  getEquipePorSigla: async (sigla) => {
    try {
      const response = await api.get(`/api/equipes/equipes_simples/sigla/${sigla}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipe com sigla ${sigla}:`, error);
      return null;
    }
  },
  
  /**
   * Obtém uma equipe específica pelo código UOR (uor_dvs)
   * @param {string} uor Código UOR da divisão
   * @returns {Promise<Object>} Dados da equipe
   */
  getEquipePorUor: async (uor) => {
    try {
      const response = await api.get(`/api/equipes/equipes_simples/uor/${uor}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipe com UOR ${uor}:`, error);
      return null;
    }
  },
  
  /**
   * Obtém todos os funcionários de uma equipe específica
   * @param {string} siglaEquipe Sigla da equipe
   * @param {boolean} includeInactive Se true, inclui funcionários inativos/removidos
   * @returns {Promise<Array>} Lista de funcionários da equipe
   */
  getFuncionariosEquipe: async (siglaEquipe, includeInactive = false) => {
    try {
      console.log(`Solicitando funcionários da equipe ${siglaEquipe} com detalhes de cargo...`);
      // Adicionar parâmetro para solicitar dados completos incluindo cargos
      // e incluir inativos se solicitado
      const params = new URLSearchParams();
      params.append('include_details', 'true');
      if (includeInactive) {
        params.append('include_inactive', 'true');
      }
      
      const response = await api.get(`/equipefuncionario/equipes/${siglaEquipe}/funcionarios?${params.toString()}`);
      
      // Log detalhado para diagnóstico
      if (response.data && response.data.length > 0) {
        console.log(`Exemplo de funcionário recebido:`, response.data[0]);
        console.log(`Total de funcionários recebidos: ${response.data.length}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionários da equipe ${siglaEquipe}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém todos os funcionários originais de uma equipe 
   * (da base.fun e base.dicoi_divisao_2022) que não estão atualmente vinculados
   * @param {string} siglaEquipe Sigla da equipe
   * @returns {Promise<Array>} Lista de funcionários originais não vinculados
   */
  getFuncionariosOriginaisNaoVinculados: async (siglaEquipe) => {
    try {
      console.log(`Solicitando funcionários originais não vinculados da equipe ${siglaEquipe}...`);
      const params = new URLSearchParams();
      params.append('only_original', 'true');
      params.append('only_inactive', 'true');
      
      const response = await api.get(`/equipefuncionario/equipes/${siglaEquipe}/funcionarios?${params.toString()}`);
      
      if (response.data && response.data.length > 0) {
        console.log(`Total de funcionários originais não vinculados: ${response.data.length}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionários originais não vinculados da equipe ${siglaEquipe}:`, error);
      // Em caso de erro da API, simulamos o comportamento com dados iniciais
      return [];
    }
  },
  
  /**
   * Adiciona um funcionário a uma equipe
   * @param {string} siglaEquipe Sigla da equipe
   * @param {object} funcionario Dados do funcionário a ser adicionado
   * @returns {Promise<Object>} Resultado da operação
   */
  adicionarFuncionario: async (siglaEquipe, funcionario) => {
    try {
      console.log(`Enviando solicitação para adicionar funcionário: ${JSON.stringify(funcionario)} à equipe ${siglaEquipe}`);
      const response = await api.post(`/equipefuncionario/equipes/${siglaEquipe}/adicionar`, funcionario);
      console.log(`Resposta da adição do funcionário:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar funcionário à equipe ${siglaEquipe}:`, error);
      console.error(`Detalhes do erro:`, error.response?.data);
      throw error;
    }
  },
  
  /**
   * Remove um funcionário de uma equipe
   * @param {string} siglaEquipe Sigla da equipe
   * @param {object} funcionario Dados do funcionário a ser removido
   * @returns {Promise<Object>} Resultado da operação
   */
  removerFuncionario: async (siglaEquipe, funcionario) => {
    try {
      console.log(`Enviando solicitação para remover funcionário: ${JSON.stringify(funcionario)} da equipe ${siglaEquipe}`);
      const response = await api.post(`/equipefuncionario/equipes/${siglaEquipe}/remover`, funcionario);
      console.log(`Resposta da remoção do funcionário:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover funcionário da equipe ${siglaEquipe}:`, error);
      console.error(`Detalhes do erro:`, error.response?.data);
      throw error;
    }
  },
  
  /**
   * Lista todas as relações personalizadas equipe-funcionário
   * @returns {Promise<Array>} Lista de overrides
   */
  getOverrides: async () => {
    try {
      const response = await api.get('/equipefuncionario/overrides');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar overrides de equipes:', error);
      throw error;
    }
  },
  
  /**
   * Visualiza o histórico de alterações nas equipes
   * @returns {Promise<Array>} Lista de logs de alterações
   */
  getHistoricoAlteracoes: async () => {
    try {
      const response = await api.get('/equipefuncionario/logs');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de alterações:', error);
      throw error;
    }
  },
  
  /**
   * Obtém funcionários por divisão DICOI
   * @param {string} sigla Sigla da divisão (ex: GEVAO, GEARC)
   * @returns {Promise<Array>} Lista de funcionários da divisão
   */
  getFuncionariosDivisao: async (sigla) => {
    try {
      const response = await api.get(`/api/equipes/divisao/${sigla}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionários da divisão ${sigla}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém todos os funcionários das divisões DICOI
   * @returns {Promise<Array>} Lista de funcionários de todas as divisões DICOI
   */
  getTodosFuncionariosDicoi: async () => {
    try {
      console.log('Buscando funcionários DICOI...');
      const response = await api.get('/api/equipes/dicoi');
      console.log('Resposta da API:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar funcionários DICOI:', error);
      // Retorna array vazio em caso de erro
      return [];
    }
  },
  
  /**
   * Diagnostica problemas com tabelas e consultas DICOI
   * @returns {Promise<Object>} Dados de diagnóstico das tabelas
   */
  diagnosticarTabelasDicoi: async () => {
    try {
      const response = await api.get('/api/equipes/dicoi/debug');
      return response.data;
    } catch (error) {
      console.error('Erro ao diagnosticar tabelas DICOI:', error);
      throw error;
    }
  },
  
  /**
   * Realiza diagnóstico completo de equipes e funcionários
   * @returns {Promise<Object>} Dados de diagnóstico completo
   */
  diagnosticoCompleto: async () => {
    try {
      const response = await api.get('/api/equipes/diagnostico');
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar diagnóstico completo:', error);
      throw error;
    }
  },
  
  /**
   * Sincroniza equipes com dados das divisões DICOI
   * @returns {Promise<Object>} Objeto com estatísticas da sincronização
   */
  sincronizarEquipesDicoi: async () => {
    try {
      console.log('Iniciando sincronização de equipes DICOI...');
      const response = await api.post('/api/equipes/sync/dicoi');
      console.log('Resposta da sincronização:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar equipes DICOI:', error);
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
      const response = await api.get(`/api/equipes/gerencia/${gerencia}`);
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
      const response = await api.get(`/api/equipes/area/${area}`);
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
      const response = await api.get(`/api/equipes/search?q=${encodeURIComponent(termo)}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipes com o termo "${termo}":`, error);
      throw error;
    }
  }
};

export default equipeService;