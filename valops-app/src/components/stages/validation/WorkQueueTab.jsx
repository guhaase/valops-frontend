import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Clock, 
  RotateCcw, 
  ArrowRightLeft, 
  ListTodo,
  CheckCircle2,
  Files,
  FileCheck,
  AlertTriangle,
  Loader,
  Search,
  Filter,
  Edit2,
  Save,
  X,
  Clock8,
  History
} from 'lucide-react';
import workqueueService from '../../../services/workqueueService';

const WorkQueueTab = () => {
  const [activeTab, setActiveTab] = useState('previa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [newEquipeValue, setNewEquipeValue] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [equipeLog, setEquipeLog] = useState({ logs: [], total: 0 });
  const [loadingLog, setLoadingLog] = useState(false);
  
  // Referência para monitorar os cliques fora do input de edição
  const editInputRef = useRef(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    gaia: '',
    versao: '',
    modelo: '',
    prefixo: '',
    equipe: '',
    status: '',
    atualizado: ''
  });
  
  // Estado para os dados de prévia
  const [previaData, setPreviaData] = useState({
    items: [],
    total: 0,
    concluidos: 0,
    em_andamento: 0,
    aguardando: 0
  });
  
  // Estado para os dados de revalidação (usará os dados simulados por enquanto)
  const [revalidacaoData, setRevalidacaoData] = useState({
    items: [],
    total: 0,
    urgentes: 0,
    programadas: 0,
    concluidas: 0
  });
  
  // Estado para os dados de posterior (usará os dados simulados por enquanto)
  const [posteriorData, setPosteriorData] = useState({
    items: [],
    total: 0,
    saudaveis: 0,
    atencao: 0,
    criticos: 0
  });
  
  // Carregar dados da validação prévia
  const loadPreviaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workqueueService.getValidationQueuePrevia();
      setPreviaData(data);
    } catch (err) {
      console.error('Erro ao carregar dados de validação prévia:', err);
      setError('Não foi possível carregar os dados de validação prévia. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados de revalidação
  const loadRevalidacaoData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workqueueService.getRevalidationQueue();
      setRevalidacaoData(data);
    } catch (err) {
      console.error('Erro ao carregar dados de revalidação:', err);
      setError('Não foi possível carregar os dados de revalidação. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados de validação posterior
  const loadPosteriorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workqueueService.getPostValidationQueue();
      setPosteriorData(data);
    } catch (err) {
      console.error('Erro ao carregar dados de validação posterior:', err);
      setError('Não foi possível carregar os dados de validação posterior. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados quando o componente montar ou quando mudar de aba
  useEffect(() => {
    if (activeTab === 'previa') {
      loadPreviaData();
    } else if (activeTab === 'revalidacao') {
      loadRevalidacaoData();
    } else if (activeTab === 'posterior') {
      loadPosteriorData();
    }
  }, [activeTab]);
  
  // Função para lidar com mudanças nos filtros
  const handleFilterChange = (e, filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: e.target.value
    }));
  };
  
  // Aplicar filtros nos dados
  const filteredItems = useMemo(() => {
    if (!previaData.items) return [];
    
    return previaData.items.filter(item => {
      return (
        // Filtro de GAIA
        (filters.gaia === '' || 
          item.gaia.toLowerCase().includes(filters.gaia.toLowerCase())) &&
        
        // Filtro de Versão
        (filters.versao === '' || 
          item.versao.toLowerCase().includes(filters.versao.toLowerCase())) &&
        
        // Filtro de Modelo
        (filters.modelo === '' || 
          item.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) &&
        
        // Filtro de Prefixo
        (filters.prefixo === '' || 
          item.prefixo.toLowerCase().includes(filters.prefixo.toLowerCase())) &&
        
        // Filtro de Equipe
        (filters.equipe === '' || 
          item.equipe.toLowerCase().includes(filters.equipe.toLowerCase())) &&
        
        // Filtro de Status
        (filters.status === '' || 
          (item.status === 'concluido' && filters.status === 'concluido') ||
          (item.status === 'em_andamento' && filters.status === 'em_andamento') ||
          (item.status === 'aguardando' && filters.status === 'aguardando')) &&
        
        // Filtro de Data
        (filters.atualizado === '' || 
          new Date(item.atualizado).toLocaleDateString('pt-BR').includes(filters.atualizado))
      );
    });
  }, [previaData.items, filters]);
  
  // Funções para gerenciar a edição de equipe
  const handleEditEquipe = (item) => {
    setEditingEquipe({
      gaia: item.gaia,
      versao: item.versao,
      prefixo: item.prefixo,
      equipeAtual: item.equipe
    });
    setNewEquipeValue(item.equipe);
  };
  
  const handleCancelEdit = () => {
    setEditingEquipe(null);
    setNewEquipeValue('');
    setUpdateMessage({ text: '', type: '' });
  };
  
  const handleSaveEquipe = async () => {
    if (!editingEquipe || !newEquipeValue.trim()) return;
    
    // Preparar payload
    const payload = {
      gaia: editingEquipe.gaia,
      versao: editingEquipe.versao,
      prefixo: editingEquipe.prefixo,
      equipe: newEquipeValue.trim()
    };
    
    setSaving(true);
    setUpdateMessage({ text: '', type: '' });
    
    try {
      const result = await workqueueService.updateEquipe(payload);
      
      if (result.success) {
        // Atualizar localmente
        const updatedItems = previaData.items.map(item => {
          if (item.gaia === editingEquipe.gaia && item.versao === editingEquipe.versao) {
            return { ...item, equipe: newEquipeValue.trim() };
          }
          return item;
        });
        
        setPreviaData({
          ...previaData,
          items: updatedItems
        });
        
        setUpdateMessage({
          text: 'Equipe atualizada com sucesso!',
          type: 'success'
        });
      } else {
        setUpdateMessage({
          text: result.message || 'Erro ao atualizar equipe.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Erro ao salvar equipe:', err);
      setUpdateMessage({
        text: err.message || 'Erro ao atualizar equipe. Tente novamente mais tarde.',
        type: 'error'
      });
    } finally {
      setSaving(false);
      // Limpar mensagem após alguns segundos
      setTimeout(() => {
        if (updateMessage.type === 'success') {
          setEditingEquipe(null);
          setNewEquipeValue('');
        }
        setUpdateMessage({ text: '', type: '' });
      }, 5000);
    }
  };
  
  // Função para carregar o histórico de alterações
  const loadEquipeLog = async (gaia, versao) => {
    setLoadingLog(true);
    try {
      const params = { skip: 0, limit: 50 };
      if (gaia) params.gaia = gaia;
      if (versao) params.versao = versao;
      
      const result = await workqueueService.getEquipeLog(params);
      console.log('Log data received:', result);
      
      // Certifique-se de que o resultado tenha o formato esperado
      if (result && typeof result === 'object') {
        // Se o resultado não tiver logs, inicialize com array vazio
        const sanitizedResult = {
          logs: Array.isArray(result.logs) ? result.logs : [],
          total: typeof result.total === 'number' ? result.total : 0
        };
        setEquipeLog(sanitizedResult);
      } else {
        // Caso o resultado seja inválido, inicialize com valores padrão
        setEquipeLog({ logs: [], total: 0 });
        console.error('Formato de resposta inválido:', result);
      }
      
      setShowLogModal(true);
    } catch (err) {
      console.error('Erro ao carregar histórico de alterações:', err);
      setUpdateMessage({
        text: 'Erro ao carregar histórico de alterações. Tente novamente mais tarde.',
        type: 'error'
      });
      // Certifique-se de que o estado seja inicializado mesmo em caso de erro
      setEquipeLog({ logs: [], total: 0 });
    } finally {
      setLoadingLog(false);
    }
  };
  
  // Fechar modal quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (editInputRef.current && !editInputRef.current.contains(event.target)) {
        handleCancelEdit();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="w-full max-w-none">
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Fila de Trabalho</h3>
        <p className="mb-3">
          Gerencie todas as atividades de validação organizadas por estágio do ciclo de vida. 
          Acompanhe o progresso de cada validação e priorize as tarefas conforme necessidade.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('previa')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'previa'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              Prévia
            </div>
          </button>
          <button
            onClick={() => setActiveTab('revalidacao')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'revalidacao'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <RotateCcw size={16} className="mr-2" />
              Revalidação
            </div>
          </button>
          <button
            onClick={() => setActiveTab('posterior')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'posterior'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <ArrowRightLeft size={16} className="mr-2" />
              Posterior
            </div>
          </button>
        </nav>
      </div>
      
      {/* Conteúdo do Tab Prévia */}
      {activeTab === 'previa' && (
        <div>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Validações Prévias</h4>
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
                onClick={() => loadPreviaData()}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 md:w-28">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>GAIA</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.gaia}
                              onChange={(e) => handleFilterChange(e, 'gaia')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="Filtrar..."
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 md:w-20">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Versão</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.versao}
                              onChange={(e) => handleFilterChange(e, 'versao')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="Filtrar..."
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Modelo</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.modelo}
                              onChange={(e) => handleFilterChange(e, 'modelo')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="Filtrar..."
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 md:w-20">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Prefixo</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.prefixo}
                              onChange={(e) => handleFilterChange(e, 'prefixo')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="Filtrar..."
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 md:w-48">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Equipe</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.equipe}
                              onChange={(e) => handleFilterChange(e, 'equipe')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="Filtrar..."
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 md:w-32">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Status</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <select 
                              value={filters.status}
                              onChange={(e) => handleFilterChange(e, 'status')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Todos</option>
                              <option value="concluido">Concluído</option>
                              <option value="em_andamento">Em Andamento</option>
                              <option value="aguardando">Aguardando</option>
                            </select>
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 md:w-32">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span>Atualizado</span>
                              <Filter className="ml-1" size={12} />
                            </div>
                            <input 
                              type="text" 
                              value={filters.atualizado}
                              onChange={(e) => handleFilterChange(e, 'atualizado')}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 md:w-24">
                          <div className="flex flex-col space-y-1">
                            <span>Ações</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems && filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                          <tr key={`${item.gaia}-${item.versao}-${index}`}>
                            <td className="px-3 py-3 text-sm text-gray-500">
                              {item.gaia}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-500">
                              {item.versao}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">
                              {item.modelo}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-500">
                              {item.prefixo}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-500">
                              {editingEquipe && 
                               editingEquipe.gaia === item.gaia && 
                               editingEquipe.versao === item.versao ? (
                                <div className="flex items-center space-x-1" ref={editInputRef}>
                                  <input
                                    type="text"
                                    value={newEquipeValue}
                                    onChange={(e) => setNewEquipeValue(e.target.value)}
                                    className="border rounded py-0.5 px-1 w-full text-sm"
                                    autoFocus
                                  />
                                  <button
                                    onClick={handleSaveEquipe}
                                    disabled={saving}
                                    className="p-0.5 text-green-600 hover:text-green-800 disabled:opacity-50"
                                  >
                                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="p-0.5 text-red-600 hover:text-red-800 disabled:opacity-50"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="truncate">{item.equipe}</span>
                                  <div className="flex ml-2">
                                    <button
                                      onClick={() => handleEditEquipe(item)}
                                      className="p-0.5 text-blue-600 hover:text-blue-800"
                                      title="Editar equipe"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => loadEquipeLog(item.gaia, item.versao)}
                                      className="p-0.5 text-gray-500 hover:text-gray-800 ml-1"
                                      title="Ver histórico de alterações"
                                    >
                                      <History size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                              {updateMessage.text && 
                               editingEquipe && 
                               editingEquipe.gaia === item.gaia && 
                               editingEquipe.versao === item.versao && (
                                <div className={`text-xs mt-1 ${updateMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                  {updateMessage.text}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${item.status === 'concluido' ? 'bg-green-100 text-green-800' : 
                                  item.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {item.status === 'concluido' ? 'Concluído' : 
                                 item.status === 'em_andamento' ? 'Em Andamento' : 
                                 'Aguardando'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-500">
                              {new Date(item.atualizado).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-3 py-3 text-sm">
                              <button className="text-blue-600 hover:text-blue-800">
                                {item.status === 'concluido' ? 'Visualizar' : 
                                 item.status === 'em_andamento' ? 'Continuar' : 
                                 'Iniciar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-3 py-3 text-center text-gray-500">
                            {previaData.items && previaData.items.length > 0 
                              ? 'Nenhum item corresponde aos filtros aplicados.' 
                              : 'Nenhum item encontrado na fila de validação prévia.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle2 className="text-green-500 mr-2" size={20} />
                    <h5 className="font-medium text-gray-800">Concluídos</h5>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{previaData.concluidos || 0}</span>
                    <span className="text-sm text-gray-500">
                      {previaData.items && previaData.items.length > 0 ? 
                        `Total: ${previaData.total}` : 
                        'Nenhum item concluído'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center mb-3">
                    <Files className="text-yellow-500 mr-2" size={20} />
                    <h5 className="font-medium text-gray-800">Em Andamento</h5>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-500">{previaData.em_andamento || 0}</span>
                    <span className="text-sm text-gray-500">
                      {previaData.items && previaData.items.length > 0 ? 
                        `${(previaData.em_andamento / previaData.total * 100).toFixed(0)}% do total` : 
                        'Nenhum item em andamento'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center mb-3">
                    <FileCheck className="text-blue-500 mr-2" size={20} />
                    <h5 className="font-medium text-gray-800">Aguardando</h5>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-500">{previaData.aguardando || 0}</span>
                    <span className="text-sm text-gray-500">
                      {previaData.items && previaData.items.length > 0 ? 
                        `${(previaData.aguardando / previaData.total * 100).toFixed(0)}% do total` : 
                        'Nenhum item aguardando'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center mb-3">
                    <Filter className="text-purple-500 mr-2" size={20} />
                    <h5 className="font-medium text-gray-800">Filtrados</h5>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-500">{filteredItems.length}</span>
                    <span className="text-sm text-gray-500">
                      {Object.values(filters).some(f => f !== '') ? 
                        `${(filteredItems.length / previaData.total * 100).toFixed(0)}% do total` : 
                        'Nenhum filtro aplicado'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Modal de Histórico de Alterações */}
              {showLogModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Histórico de Alterações de Equipe</h3>
                      <button 
                        onClick={() => setShowLogModal(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                      {loadingLog ? (
                        <div className="flex justify-center items-center py-10">
                          <Loader className="animate-spin text-blue-600 mr-2" size={24} />
                          <span className="text-blue-600 font-medium">Carregando histórico...</span>
                        </div>
                      ) : equipeLog.logs.length > 0 ? (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GAIA</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Versão</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipe Anterior</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipe Nova</th>
                            </tr>
                          </thead>
                          <tbody>
                            {equipeLog.logs.map(log => (
                              <tr key={log.id} className="border-b">
                                <td className="px-4 py-2 text-sm">
                                  {new Date(log.data_alteracao).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-4 py-2 text-sm font-medium">{log.matricula_autor}</td>
                                <td className="px-4 py-2 text-sm">{log.gaia}</td>
                                <td className="px-4 py-2 text-sm">{log.versao}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">
                                  {log.equipe_anterior || '—'}
                                </td>
                                <td className="px-4 py-2 text-sm font-medium">{log.equipe_nova}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhum registro de alteração encontrado.
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Total de registros: {equipeLog.total}
                        </div>
                        <button
                          onClick={() => setShowLogModal(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Conteúdo do Tab Revalidação */}
      {activeTab === 'revalidacao' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">Revalidações Programadas</h4>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg">
                Nova Revalidação
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Programada
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      REV-2025-004
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Modelo Precificação Dinâmica
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Regressão
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Trimestral
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      15/04/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Programado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      REV-2025-003
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Classificador de Documentos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      NLP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Alerta de Drift
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      05/04/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Urgente
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Iniciar Agora</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      REV-2025-002
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Previsão de Demanda
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Série Temporal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Semestral
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      30/06/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Agendado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Reprogramar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Urgentes</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-red-500">2</span>
                <span className="text-sm text-gray-500">Por Drift: 1 | Por Erro: 1</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <Clock className="text-blue-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Programadas (30 dias)</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-500">5</span>
                <span className="text-sm text-gray-500">Próxima: 05/04/2025</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <CheckCircle2 className="text-green-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Concluídas (Q1 2025)</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-500">12</span>
                <span className="text-sm text-gray-500">Aprovadas: 10 | Reprovadas: 2</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteúdo do Tab Posterior */}
      {activeTab === 'posterior' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">Validações em Produção</h4>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg">
                Novo Monitoramento
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ambiente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Em Produção Desde
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saúde
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Validação
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      MON-2025-001
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Detecção de Fraudes v1.5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Produção
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      15/01/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Saudável
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      20/03/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Dashboard</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      MON-2025-003
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Recomendação de Produtos v2.1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Produção
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      05/02/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Atenção
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      25/03/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Verificar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      MON-2025-005
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Segmentação de Clientes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Produção
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      10/03/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Crítico
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      01/04/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-red-600 hover:text-red-800 font-medium">Revalidar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <CheckCircle2 className="text-green-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Saudáveis</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-500">15</span>
                <span className="text-sm text-gray-500">Estáveis: 12 | Melhorando: 3</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="text-yellow-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Atenção</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-500">4</span>
                <span className="text-sm text-gray-500">Drift Potencial: 3 | Performance: 1</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <h5 className="font-medium text-gray-800">Críticos</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-red-500">2</span>
                <span className="text-sm text-gray-500">Drift Confirmado: 1 | Erro: 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkQueueTab;