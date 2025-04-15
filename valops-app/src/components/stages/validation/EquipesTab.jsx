// src/components/stages/validation/EquipesTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, ChevronRight, Users, Building, Mail, 
  Search, Filter, UserPlus, RefreshCw, Eye, EyeOff,
  User, Briefcase, UserCheck
} from 'lucide-react';
import equipeService from '../../../services/equipeService';

const EquipesTab = () => {
  const [equipesAgrupadas, setEquipesAgrupadas] = useState({});
  const [filteredEquipes, setFilteredEquipes] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('org-chart'); // 'org-chart', 'tree' ou 'cards'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    gerencias: [],
    areas: []
  });

  // Buscar dados das equipes
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoading(true);
        const data = await equipeService.getAgrupadas();
        setEquipesAgrupadas(data);
        setFilteredEquipes(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar equipes:', err);
        setError('Não foi possível carregar os dados das equipes. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchEquipes();
  }, []);

  // Extrair lista de gerências e áreas disponíveis para filtros
  const { todasGerencias, todasAreas, todosResponsaveis } = useMemo(() => {
    const gerencias = new Set();
    const areas = new Set();
    const responsaveis = new Set();
    
    Object.keys(equipesAgrupadas).forEach(gerencia => {
      gerencias.add(gerencia);
      
      Object.keys(equipesAgrupadas[gerencia] || {}).forEach(area => {
        areas.add(area);
        
        (equipesAgrupadas[gerencia][area] || []).forEach(equipe => {
          if (equipe.responsavel) {
            responsaveis.add(equipe.responsavel);
          }
        });
      });
    });
    
    return {
      todasGerencias: Array.from(gerencias).sort(),
      todasAreas: Array.from(areas).sort(),
      todosResponsaveis: Array.from(responsaveis).sort()
    };
  }, [equipesAgrupadas]);

  // Filtrar equipes com base na pesquisa e filtros selecionados
  useEffect(() => {
    if (Object.keys(equipesAgrupadas).length === 0) return;
    
    // Aplicar filtros e busca
    const result = {};
    
    Object.keys(equipesAgrupadas).forEach(gerencia => {
      // Filtrar por gerência, se houver filtros de gerência selecionados
      if (selectedFilters.gerencias.length > 0 && !selectedFilters.gerencias.includes(gerencia)) {
        return;
      }
      
      result[gerencia] = {};
      
      Object.keys(equipesAgrupadas[gerencia]).forEach(area => {
        // Filtrar por área, se houver filtros de área selecionados
        if (selectedFilters.areas.length > 0 && !selectedFilters.areas.includes(area)) {
          return;
        }
        
        const equipesFiltered = equipesAgrupadas[gerencia][area].filter(equipe => {
          // Aplicar termo de busca se existir
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
              equipe.nome.toLowerCase().includes(searchLower) ||
              (equipe.responsavel && equipe.responsavel.toLowerCase().includes(searchLower)) ||
              (equipe.caracteristica && equipe.caracteristica.toLowerCase().includes(searchLower)) ||
              (equipe.email_gerente && equipe.email_gerente.toLowerCase().includes(searchLower))
            );
          }
          return true;
        });
        
        if (equipesFiltered.length > 0) {
          result[gerencia][area] = equipesFiltered;
        }
      });
      
      // Remover gerências sem áreas
      if (Object.keys(result[gerencia]).length === 0) {
        delete result[gerencia];
      }
    });
    
    setFilteredEquipes(result);
    
    // Expandir automaticamente se houver pesquisa ou poucos resultados
    if (searchTerm || 
        (Object.keys(result).length <= 2 && 
         Object.values(result).every(areas => Object.keys(areas).length <= 3))) {
      const newExpandedState = {};
      
      Object.keys(result).forEach(gerencia => {
        newExpandedState[`gerencia-${gerencia}`] = true;
        
        Object.keys(result[gerencia]).forEach(area => {
          newExpandedState[`area-${gerencia}-${area}`] = true;
        });
      });
      
      setExpandedItems(newExpandedState);
    }
  }, [searchTerm, selectedFilters, equipesAgrupadas]);

  // Alternar expansão de itens (gerências, áreas)
  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Expandir ou recolher todos os itens
  const toggleAllItems = (expand) => {
    const newState = {};
    
    Object.keys(filteredEquipes).forEach(gerencia => {
      newState[`gerencia-${gerencia}`] = expand;
      
      Object.keys(filteredEquipes[gerencia]).forEach(area => {
        newState[`area-${gerencia}-${area}`] = expand;
      });
    });
    
    setExpandedItems(newState);
  };
  
  // Alternar seleção de filtro
  const toggleFilter = (type, value) => {
    setSelectedFilters(prev => {
      const current = [...prev[type]];
      
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: current.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [type]: [...current, value]
        };
      }
    });
  };
  
  // Limpar todos os filtros
  const clearFilters = () => {
    setSelectedFilters({
      gerencias: [],
      areas: []
    });
    setSearchTerm('');
  };
  
  // Renderizar componentes condicionalmente com base no estado de carregamento e erro
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-12 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Carregando dados das equipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700 max-w-2xl mx-auto my-8">
        <h3 className="font-semibold mb-3 text-lg">Erro ao carregar equipes</h3>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-medium flex items-center"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </button>
      </div>
    );
  }

  const totalEquipes = Object.keys(filteredEquipes).reduce((total, gerencia) => {
    return total + Object.keys(filteredEquipes[gerencia]).reduce((subtotal, area) => {
      return subtotal + filteredEquipes[gerencia][area].length;
    }, 0);
  }, 0);

  if (Object.keys(filteredEquipes).length === 0) {
    return (
      <div className="p-4">
        {/* Barra de pesquisa e filtros */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar equipes, responsáveis..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Limpar filtros
            </button>
          </div>
        </div>
      
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-blue-700 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2 text-blue-800">Nenhuma equipe encontrada</h3>
          <p>Não há equipes correspondentes aos critérios de pesquisa ou filtros selecionados.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm font-medium"
            onClick={clearFilters}
          >
            Limpar todos os filtros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Organização das Equipes DICOI</h3>
        <p className="text-gray-600">
          Visualize as 5 equipes da DICOI e seus respectivos responsáveis por área, facilitando a identificação clara da estrutura organizacional.
        </p>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar equipes, responsáveis..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('org-chart')}
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                viewMode === 'org-chart' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Visualização em Organograma"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Organograma
            </button>
            
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                viewMode === 'tree' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Visualização em Árvore"
            >
              <Filter className="h-4 w-4 mr-1" />
              Árvore
            </button>
            
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                viewMode === 'cards' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Visualização em Cards"
          >
            <Users className="h-4 w-4 mr-1" />
            Cards
          </button>
          
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Limpar filtros
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Building className="h-4 w-4 mr-1" />
            Gerências:
          </p>
          <div className="flex flex-wrap gap-2">
            {todasGerencias.map(gerencia => (
              <button
                key={gerencia}
                onClick={() => toggleFilter('gerencias', gerencia)}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFilters.gerencias.includes(gerencia)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {gerencia}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Áreas:
          </p>
          <div className="flex flex-wrap gap-2">
            {todasAreas.map(area => (
              <button
                key={area}
                onClick={() => toggleFilter('areas', area)}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFilters.areas.includes(area)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    
    {/* Resumo dos resultados */}
    <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
      <p className="text-blue-800 font-medium">
        Mostrando {totalEquipes} equipe{totalEquipes !== 1 ? 's' : ''} em{' '}
        {Object.keys(filteredEquipes).length} gerência{Object.keys(filteredEquipes).length !== 1 ? 's' : ''}
      </p>
      
      {(searchTerm || selectedFilters.gerencias.length > 0 || selectedFilters.areas.length > 0) && (
        <span className="text-sm text-blue-600">
          Filtros aplicados
        </span>
      )}
    </div>
    
    {/* Visualização em Organograma */}
    {viewMode === 'org-chart' && (
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-center font-bold text-xl text-blue-800 mb-8">Estrutura Organizacional DICOI</h3>
          
          {/* Nível de Gerência */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md w-64 text-center">
              <div className="font-bold">Diretoria DICOI</div>
              <div className="text-sm mt-1">Coordenação Geral</div>
            </div>
          </div>
          
          {/* Linhas conectando níveis */}
          <div className="relative h-16 flex justify-center">
            <div className="absolute border-l-2 border-blue-400 h-full"></div>
          </div>
          
          {/* Nível de Áreas */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-4 mb-8">
            {todasAreas.map((area, index) => (
              <div key={area} className="flex flex-col items-center">
                <div className="bg-blue-100 border-2 border-blue-500 text-blue-700 p-3 rounded-lg shadow w-full text-center min-h-16 flex items-center justify-center">
                  <div>
                    <div className="font-semibold">{area}</div>
                  </div>
                </div>
                
                {/* Linha vertical conectando com equipes */}
                <div className="h-8 w-0.5 bg-blue-300 my-1"></div>
              </div>
            ))}
          </div>
          
          {/* Nível de Equipes e Responsáveis */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-4">
            {todasAreas.map((area) => {
              // Encontrar todas as equipes para esta área
              const equipesArea = [];
              Object.keys(filteredEquipes).forEach(gerencia => {
                if (filteredEquipes[gerencia][area]) {
                  equipesArea.push(...filteredEquipes[gerencia][area]);
                }
              });
              
              return (
                <div key={`equipes-${area}`} className="flex flex-col items-center gap-4">
                  {equipesArea.length > 0 ? (
                    equipesArea.map((equipe) => (
                      <div 
                        key={equipe.id}
                        className="bg-white border border-blue-200 rounded-lg shadow p-3 w-full hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="font-medium text-blue-800 mb-1 text-center">{equipe.nome}</div>
                        
                        {equipe.responsavel && (
                          <div className="flex items-center justify-center text-sm bg-blue-50 p-1 rounded mt-2">
                            <UserCheck className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="text-gray-700">{equipe.responsavel}</span>
                          </div>
                        )}
                        
                        {equipe.prefixo !== null && equipe.prefixo !== undefined && (
                          <div className="mt-2 text-center">
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Prefixo: {equipe.prefixo.toString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 w-full text-center text-gray-500 text-sm">
                      Sem equipes cadastradas
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legenda */}
          <div className="mt-10 border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Legenda:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span>Diretoria</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
                <span>Áreas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-blue-200 rounded mr-2"></div>
                <span>Equipes</span>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                <span>Responsável</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabela de Responsáveis */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-lg text-blue-800 mb-4">Responsáveis por Área</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todasAreas.map((area) => {
                  // Encontrar todas as equipes para esta área
                  const equipesArea = [];
                  Object.keys(filteredEquipes).forEach(gerencia => {
                    if (filteredEquipes[gerencia][area]) {
                      equipesArea.push(...filteredEquipes[gerencia][area]);
                    }
                  });
                  
                  return equipesArea.map((equipe, idx) => (
                    <tr key={`row-${area}-${equipe.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {idx === 0 && (
                        <td 
                          rowSpan={equipesArea.length} 
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800 bg-blue-50 border-r border-gray-200"
                        >
                          {area}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipe.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {equipe.responsavel ? (
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="font-medium">{equipe.responsavel}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Não definido</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {equipe.email_gerente ? (
                          <a 
                            href={`mailto:${equipe.email_gerente}`} 
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            {equipe.email_gerente}
                          </a>
                        ) : (
                          <span className="text-gray-400">Não definido</span>
                        )}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
    
    {/* Visualização em Árvore */}
    {viewMode === 'tree' && (
      <div className="space-y-4">
        {Object.keys(filteredEquipes).sort().map((gerencia) => (
          <div key={gerencia} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Cabeçalho da Gerência */}
            <div 
              className="bg-blue-50 p-3 flex justify-between items-center cursor-pointer hover:bg-blue-100"
              onClick={() => toggleExpanded(`gerencia-${gerencia}`)}
            >
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-700 mr-2" />
                <h4 className="font-semibold text-blue-800">{gerencia}</h4>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-blue-600 mr-2">
                  {Object.keys(filteredEquipes[gerencia]).reduce(
                    (total, area) => total + filteredEquipes[gerencia][area].length, 0
                  )} equipe{Object.keys(filteredEquipes[gerencia]).reduce(
                    (total, area) => total + filteredEquipes[gerencia][area].length, 0
                  ) !== 1 ? 's' : ''}
                </span>
                {expandedItems[`gerencia-${gerencia}`] ? (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>

            {/* Áreas dentro da Gerência */}
            {expandedItems[`gerencia-${gerencia}`] && (
              <div className="bg-white divide-y divide-gray-100">
                {Object.keys(filteredEquipes[gerencia]).sort().map((area) => (
                  <div key={`${gerencia}-${area}`} className="pl-4">
                    {/* Cabeçalho da Área */}
                    <div 
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpanded(`area-${gerencia}-${area}`)}
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-blue-600 mr-2" />
                        <h5 className="font-medium text-gray-700">{area}</h5>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {filteredEquipes[gerencia][area].length} equipe{filteredEquipes[gerencia][area].length !== 1 ? 's' : ''}
                        </span>
                        {expandedItems[`area-${gerencia}-${area}`] ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Equipes dentro da Área */}
                    {expandedItems[`area-${gerencia}-${area}`] && (
                      <div className="pl-6 pr-4 pb-3 space-y-2">
                        {filteredEquipes[gerencia][area].map((equipe) => (
                          <div 
                            key={equipe.id} 
                            className="bg-gray-50 p-4 rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="mb-3">
                              <h6 className="font-semibold text-blue-700 text-base">{equipe.nome}</h6>
                              {equipe.caracteristica && (
                                <p className="text-sm text-gray-600 mt-1">{equipe.caracteristica}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              {equipe.responsavel && (
                                <div className="flex items-center text-sm bg-blue-50 p-2 rounded border border-blue-100">
                                  <UserCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700 font-medium">{equipe.responsavel}</span>
                                </div>
                              )}
                              
                              {equipe.email_gerente && (
                                <div className="flex items-center text-sm break-all">
                                  <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                                  <a 
                                    href={`mailto:${equipe.email_gerente}`} 
                                    className="text-blue-600 hover:underline"
                                  >
                                    {equipe.email_gerente}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            {equipe.prefixo !== null && equipe.prefixo !== undefined && (
                              <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Prefixo:</span>
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {equipe.prefixo.toString()}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    
    {/* Visualização em Cards */}
    {viewMode === 'cards' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {todasAreas.map((area) => {
          // Encontrar todas as equipes para esta área
          const equipesArea = [];
          Object.keys(filteredEquipes).forEach(gerencia => {
            if (filteredEquipes[gerencia][area]) {
              equipesArea.push(...filteredEquipes[gerencia][area]);
            }
          });
          
          if (equipesArea.length === 0) return null;
          
          return (
            <div key={`card-${area}`} className="flex flex-col h-full">
              <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-t-lg border-b border-blue-200 font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {area}
              </div>
              
              <div className="flex-grow bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-sm p-4">
                {equipesArea.length > 0 ? (
                  <div className="space-y-4">
                    {equipesArea.map((equipe) => (
                      <div 
                        key={`card-equipe-${equipe.id}`}
                        className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow duration-200"
                      >
                        <h5 className="font-medium text-blue-700 mb-2 pb-2 border-b border-blue-50">
                          {equipe.nome}
                        </h5>
                        
                        {equipe.caracteristica && (
                          <p className="text-sm text-gray-600 italic mb-3">{equipe.caracteristica}</p>
                        )}
                        
                        {equipe.responsavel && (
                          <div className="flex items-start mb-2">
                            <UserCheck className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Responsável:</p>
                              <p className="text-sm font-medium">{equipe.responsavel}</p>
                            </div>
                          </div>
                        )}
                        
                        {equipe.email_gerente && (
                          <div className="flex items-start mb-2">
                            <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Email:</p>
                              <a 
                                href={`mailto:${equipe.email_gerente}`}
                                className="text-sm text-blue-600 hover:underline break-all"
                              >
                                {equipe.email_gerente}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {equipe.prefixo !== null && equipe.prefixo !== undefined && (
                          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Prefixo:</span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                              {equipe.prefixo.toString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Nenhuma equipe encontrada
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
};

export default EquipesTab;