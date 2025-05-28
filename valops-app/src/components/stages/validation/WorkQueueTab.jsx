import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search,
  Filter,
  Loader,
  AlertTriangle
} from 'lucide-react';
import workqueueService from '../../../services/workqueueService';

const WorkQueueTab = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para os dados da fila GAIA
  const [gaiaData, setGaiaData] = useState({
    items: [],
    total: 0
  });
  
  // Filtros
  const [filters, setFilters] = useState({
    NR_MOD_ANA: '',
    NR_VRS_MOD_ANA: '',
    NM_MOD: '',
    FASE_ATU: '',
    NM_UOR: '',
    CD_DEPE_UOR: ''
  });
  
  // Carregar dados da fila GAIA
  const loadGaiaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workqueueService.getGaiaQueue();
      setGaiaData({
        items: Array.isArray(data) ? data : [],
        total: Array.isArray(data) ? data.length : 0
      });
    } catch (err) {
      console.error('Erro ao carregar dados da fila GAIA:', err);
      setError('Não foi possível carregar os dados da fila GAIA. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados quando o componente montar
  useEffect(() => {
    loadGaiaData();
  }, []);
  
  // Função para lidar com mudanças nos filtros
  const handleFilterChange = (e, filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: e.target.value
    }));
  };
  
  // Aplicar filtros nos dados
  const filteredItems = useMemo(() => {
    if (!gaiaData.items || gaiaData.items.length === 0) return [];
    
    return gaiaData.items.filter(item => {
      return (
        (filters.NR_MOD_ANA === '' || 
          item.NR_MOD_ANA?.toString().toLowerCase().includes(filters.NR_MOD_ANA.toLowerCase())) &&
        
        (filters.NR_VRS_MOD_ANA === '' || 
          item.NR_VRS_MOD_ANA?.toString().toLowerCase().includes(filters.NR_VRS_MOD_ANA.toLowerCase())) &&
        
        (filters.NM_MOD === '' || 
          item.NM_MOD?.toLowerCase().includes(filters.NM_MOD.toLowerCase())) &&
        
        (filters.FASE_ATU === '' || 
          item.FASE_ATU?.toLowerCase().includes(filters.FASE_ATU.toLowerCase())) &&
        
        (filters.NM_UOR === '' || 
          item.NM_UOR?.toLowerCase().includes(filters.NM_UOR.toLowerCase())) &&
        
        (filters.CD_DEPE_UOR === '' || 
          item.CD_DEPE_UOR?.toString().toLowerCase().includes(filters.CD_DEPE_UOR.toLowerCase()))
      );
    });
  }, [gaiaData.items, filters]);
  
  return (
    <div className="w-full max-w-none">
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Fila de Trabalho</h3>
        <p className="mb-3">
          Gerencie todas as atividades de validação organizadas por estágio do ciclo de vida. 
          Acompanhe o progresso de cada validação e priorize as tarefas conforme necessidade.
        </p>
      </div>
      
      {/* Tab Ações */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Ações</h4>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin text-blue-600 mr-2" size={24} />
          <span className="text-blue-600 font-medium">Carregando dados...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
          <button 
            className="mt-2 text-sm text-red-700 underline"
            onClick={() => loadGaiaData()}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Colunas principais com filtros */}
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>ID Modelo</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.NR_MOD_ANA}
                          onChange={(e) => handleFilterChange(e, 'NR_MOD_ANA')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>Versão</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.NR_VRS_MOD_ANA}
                          onChange={(e) => handleFilterChange(e, 'NR_VRS_MOD_ANA')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>Nome Modelo</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.NM_MOD}
                          onChange={(e) => handleFilterChange(e, 'NM_MOD')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>Fase Atual</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.FASE_ATU}
                          onChange={(e) => handleFilterChange(e, 'FASE_ATU')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>UOR</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.NM_UOR}
                          onChange={(e) => handleFilterChange(e, 'NM_UOR')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span>Dependência</span>
                          <Filter className="ml-1" size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={filters.CD_DEPE_UOR}
                          onChange={(e) => handleFilterChange(e, 'CD_DEPE_UOR')}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Filtrar..."
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr key={`${item.NR_MOD_ANA}-${item.NR_VRS_MOD_ANA}-${index}`}>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {item.NR_MOD_ANA}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {item.NR_VRS_MOD_ANA}
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.NM_MOD}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {item.FASE_ATU}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {item.NM_UOR}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {item.CD_DEPE_UOR}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-3 text-center text-gray-500">
                        {gaiaData.items && gaiaData.items.length > 0 
                          ? 'Nenhum item corresponde aos filtros aplicados.' 
                          : 'Nenhum item encontrado na fila GAIA.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Adicionar visualização detalhada */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
            <h5 className="font-semibold text-gray-800 mb-3">Detalhes Adicionais</h5>
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Mostrar detalhes avançados do item selecionado ou resumo dos resultados */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total de itens na fila: <span className="font-medium">{gaiaData.total}</span></p>
                  <p className="text-sm text-gray-600">Itens filtrados: <span className="font-medium">{filteredItems.length}</span></p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                  <AlertTriangle className="text-yellow-500 mr-2" size={16} />
                  <p className="text-sm text-gray-600">Utilize os filtros acima para encontrar modelos específicos.</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Utilize os filtros acima para visualizar itens da fila.</p>
            )}
          </div>
          
          {/* Tabela de visualização expandida com todas as colunas */}
          {filteredItems.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="p-4 border-b">
                <h5 className="font-semibold text-gray-800">Visualização Expandida</h5>
                <p className="text-sm text-gray-600">Todos os campos disponíveis para os itens filtrados.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NR_MOD_ANA</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NR_VRS_MOD_ANA</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TS_FASE_ATU</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FASE_ATU</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DT_VALID</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DT_INI_USO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CD_UOR_ESTG</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NM_UOR</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CD_DEPE_UOR</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NM_DEP</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NM_MOD</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIP_ANL</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESCOPO_RSC</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NM_SCO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FAST_TR</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FASE_ATU_SUB</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PLT_OGM</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRTC</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GR</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSCO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QT_DD_MTU_MTA</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIP_MONITORAMENTO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INI_MONITORAMENTO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIAS</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TS_ATUALIZACAO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ANO</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOR_RSP</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">sgl_dvs</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item, index) => (
                      <tr key={`exp-${item.NR_MOD_ANA}-${item.NR_VRS_MOD_ANA}-${index}`}>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NR_MOD_ANA}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NR_VRS_MOD_ANA}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.TS_FASE_ATU}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.FASE_ATU}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.DT_VALID}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.DT_INI_USO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.CD_UOR_ESTG}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NM_UOR}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.CD_DEPE_UOR}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NM_DEP}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NM_MOD}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.TIP_ANL}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.ESCOPO_RSC}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.NM_SCO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.FAST_TR}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.FASE_ATU_SUB}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.PLT_OGM}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.CRTC}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.GR}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.RSCO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.EXPO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.QT_DD_MTU_MTA}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.TIP_MONITORAMENTO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.INI_MONITORAMENTO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.DIAS}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.TS_ATUALIZACAO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.ANO}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.UOR_RSP}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{item.sgl_dvs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkQueueTab;