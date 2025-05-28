import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Search, Plus, User, Users, Edit, Save, Trash2, XCircle, Check, UserPlus, History } from 'lucide-react';
import equipeService from '../../../services/equipeService';

// Config para dados de fallback em caso de erro na API
// Será usado somente para desenvolvimento e/ou quando a API falhar
const FALLBACK_MODE = false; // Defina como false para desativar os dados de fallback em produção

// Dados de fallback (apenas para desenvolvimento)
const fallbackTeamsData = [];

const EquipesTab = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  
  // Estado para o modal de adicionar funcionários
  const [showAddModal, setShowAddModal] = useState(false);
  const [funcionariosOriginais, setFuncionariosOriginais] = useState([]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);
  const [loadingOriginais, setLoadingOriginais] = useState(false);

  // Expandir todas as equipes por padrão
  useEffect(() => {
    const expanded = {};
    teams.forEach(team => {
      expanded[team.id] = true;
    });
    setExpandedTeams(expanded);
  }, []);

  // Carrega funcionários de uma equipe específica
  const fetchFuncionariosEquipe = async (siglaEquipe) => {
    try {
      console.log(`Buscando funcionários da equipe ${siglaEquipe}...`);
      const funcionarios = await equipeService.getFuncionariosEquipe(siglaEquipe);
      console.log(`Funcionários da equipe ${siglaEquipe}:`, funcionarios);
      
      // Se funcionários retornados, vamos analisar detalhadamente a estrutura
      if (funcionarios && funcionarios.length > 0) {
        // Examinar estrutura detalhada para diagnóstico
        console.log("DIAGNÓSTICO DE ESTRUTURA DE DADOS DE FUNCIONÁRIOS:");
        
        for (const f of funcionarios.slice(0, 3)) { // Analisar os 3 primeiros funcionários
          console.log("=== Dados completos do funcionário ===");
          console.log(JSON.stringify(f, null, 2));
          console.log("Campos específicos:");
          console.log("mtrc:", f.mtrc);
          console.log("nome:", f.nome);
          console.log("cargo:", f.cargo);
          console.log("tx_cmss_fun:", f.tx_cmss_fun);
          console.log("fonte:", f.fonte);
          
          // Verificar se existem outras propriedades que possam conter o cargo
          const possiveisCamposCargo = Object.keys(f).filter(
            k => typeof f[k] === 'string' && 
              (k.includes('carg') || k.includes('fun') || k.includes('comiss'))
          );
          
          if (possiveisCamposCargo.length > 0) {
            console.log("Possíveis campos de cargo encontrados:", possiveisCamposCargo);
            possiveisCamposCargo.forEach(campo => {
              console.log(`${campo}:`, f[campo]);
            });
          }
          
          console.log("===================================");
        }
      }
      
      // Retornar os dados originais, sem modificações, para diagnóstico
      return funcionarios || [];
    } catch (err) {
      console.error(`Erro ao buscar funcionários da equipe ${siglaEquipe}:`, err);
      return [];
    }
  };

  // Busca equipes a partir da API
  const fetchEquipesFromAPI = async () => {
    try {
      setLoading(true);
      console.log("Buscando equipes da API...");
      
      // Tentar o endpoint que retorna equipes com funcionários (já deduplicado pelo serviço)
      try {
        console.log("Tentando usar o endpoint de funcionários por equipes...");
        const equipesComFuncionarios = await equipeService.getFuncionariosPorEquipes();
        
        if (equipesComFuncionarios && equipesComFuncionarios.length > 0) {
          console.log(`Obtidas ${equipesComFuncionarios.length} equipes com funcionários do endpoint`);
          
          // Processar equipes para garantir formato correto
          const processedTeams = equipesComFuncionarios.map(equipe => {
            // Garantir que temos um ID válido
            const id = (equipe.id || equipe.uor_dvs || Math.floor(Math.random() * 1000000)).toString();
            const sigla = equipe.sigla || equipe.sgl_dvs || "";
            
            // Criar objeto de equipe com dados formatados
            return {
              id: id,
              sigla: sigla,
              nome: equipe.nome || equipe.dsc_sgl_dvs || "",
              gerente: {
                matricula: equipe.gerente?.matricula || equipe.mtrc_gerente || "",
                nome: equipe.gerente?.nome || equipe.chv_rsp_dvs || "Gerente não informado",
                cargo: equipe.gerente?.cargo || equipe.cargo_gerente || "GER SOLUCOES UE"
              },
              funcionarios: Array.isArray(equipe.funcionarios) ? equipe.funcionarios.map(f => ({
                matricula: f.matricula || f.mtrc,
                nome: f.nome || "Nome não informado",
                cargo: f.cargo || f.tx_cmss_fun || "Cargo não informado"
              })) : []
            };
          });
          
          console.log(`Processadas ${processedTeams.length} equipes com funcionários`);
          setTeams(processedTeams);
          return;
        }
      } catch (error) {
        console.warn("Erro ao usar o endpoint de funcionários por equipes:", error);
        console.log("Fallback para o método antigo...");
      }
      
      // Método antigo: chamar o endpoint de equipes simples e depois buscar funcionários
      const equipesSimples = await equipeService.getEquipesSimples();
      
      if (equipesSimples && equipesSimples.length > 0) {
        console.log(`Obtidas ${equipesSimples.length} equipes da API (método antigo)`);
        
        // Array para armazenar as equipes processadas
        const processedTeams = [];
        
        for (const equipe of equipesSimples) {
          // Gerar um ID a partir do UOR ou gerar um aleatório
          const id = (equipe.uor_dvs || Math.floor(Math.random() * 1000000)).toString();
          const sigla = equipe.sgl_dvs || "";
          
          try {
            // Buscar informações do gerente (vamos considerar que o chv_rsp_dvs tem o nome do gerente)
            const gerenteNome = equipe.chv_rsp_dvs || "Gerente não informado";
            
            // Criar objeto de equipe inicial
            const teamObj = {
              id: id,
              sigla: sigla,
              nome: equipe.dsc_sgl_dvs || "",
              gerente: {
                matricula: equipe.mtrc_gerente || "", 
                nome: gerenteNome,
                cargo: equipe.cargo_gerente || "GER SOLUCOES UE"
              },
              funcionarios: []
            };
            
            // Buscar funcionários da equipe
            try {
              console.log(`Buscando funcionários da equipe ${sigla}...`);
              const funcionarios = await equipeService.getFuncionariosEquipe(sigla);
              
              if (funcionarios && funcionarios.length > 0) {
                console.log(`Encontrados ${funcionarios.length} funcionários para a equipe ${sigla}`);
                
                // Converter para o formato esperado pela interface e remover gerente da lista
                const funcionariosFormatados = funcionarios
                  .filter(f => f.mtrc !== teamObj.gerente.matricula)  // Remover gerente da lista
                  .map(f => ({
                    matricula: f.mtrc,
                    nome: f.nome || "Nome não informado",
                    cargo: f.cargo || f.tx_cmss_fun || "Cargo não informado"
                  }));
                
                teamObj.funcionarios = funcionariosFormatados;
              }
            } catch (error) {
              console.error(`Erro ao buscar funcionários da equipe ${sigla}:`, error);
            }
            
            processedTeams.push(teamObj);
          } catch (error) {
            console.error(`Erro ao processar a equipe ${sigla}:`, error);
          }
        }
        
        if (processedTeams.length > 0) {
          console.log(`Processadas ${processedTeams.length} equipes da API (método antigo)`);
          setTeams(processedTeams);
          return;
        }
      }
      
      // Se chegou aqui, houve um problema ou não há dados
      console.warn("Não foram encontradas equipes válidas na API");
      
      // Usar dados de fallback apenas se estiver no modo de fallback
      if (FALLBACK_MODE && fallbackTeamsData.length > 0) {
        console.log("Usando dados de fallback para desenvolvimento");
        setTeams(fallbackTeamsData);
      } else {
        // Em produção ou se não houver dados de fallback, mostrar array vazio
        setTeams([]);
      }
    } catch (err) {
      console.error("Erro ao buscar equipes da API:", err);
      
      // Usar dados de fallback apenas se estiver no modo de fallback
      if (FALLBACK_MODE && fallbackTeamsData.length > 0) {
        console.log("Usando dados de fallback para desenvolvimento devido a erro");
        setTeams(fallbackTeamsData);
      } else {
        // Em produção ou se não houver dados de fallback, mostrar array vazio
        setTeams([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Tenta buscar equipes ao carregar
  useEffect(() => {
    fetchEquipesFromAPI();
  }, []);

  const toggleTeam = (teamId) => {
    setExpandedTeams({
      ...expandedTeams,
      [teamId]: !expandedTeams[teamId]
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterTeams = () => {
    if (!searchTerm.trim()) return teams;
    
    return teams.map(team => {
      // Filtra funcionários que correspondem ao termo de pesquisa
      const filteredEmployees = team.funcionarios.filter(emp => 
        emp.matricula.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.cargo && emp.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Se o gerente ou equipe corresponder ao termo, retorna a equipe completa
      if (
        team.sigla.toLowerCase().includes(searchTerm.toLowerCase()) || 
        team.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.gerente.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.gerente.nome.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return team;
      }
      
      // Se algum funcionário corresponder ao termo, retorna a equipe com os funcionários filtrados
      if (filteredEmployees.length > 0) {
        return {
          ...team,
          funcionarios: filteredEmployees
        };
      }
      
      // Se nada corresponder, retorna null
      return null;
    }).filter(Boolean);
  };

  const startEditTeam = (team) => {
    setEditingTeamId(team.id);
    setEditingTeam({...team, funcionarios: [...team.funcionarios]});
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeam(null);
  };

  const saveTeam = async () => {
    try {
      setSyncLoading(true);
      
      // Se temos um funcionário removido, enviar requisição para remover
      if (editingTeam && editingTeam.removedEmployees && editingTeam.removedEmployees.length > 0) {
        const sigla = editingTeam.sigla;
        
        // Remover cada funcionário da lista de removidos
        for (const funcionario of editingTeam.removedEmployees) {
          try {
            // Verifica se o objeto está no formato correto
            const funcionarioFormato = {
              mtrc: funcionario.mtrc || funcionario.matricula,
              motivo: funcionario.motivo || "Removido via interface",
              observacoes: funcionario.observacoes || `Funcionário removido da equipe ${sigla}`
            };
            
            await equipeService.removerFuncionario(sigla, funcionarioFormato);
            console.log(`Funcionário ${funcionarioFormato.mtrc} removido da equipe ${sigla} com sucesso`);
          } catch (error) {
            console.error(`Erro ao remover funcionário da equipe ${sigla}:`, error);
            
            // Se houver erro, mostra ao usuário
            setSyncResult({
              success: false,
              message: `Erro ao remover funcionário: ${error.response?.data?.detail || error.message}`
            });
          }
        }
      }
      
      // Se temos um funcionário adicionado, enviar requisição para adicionar
      if (editingTeam && editingTeam.addedEmployees && editingTeam.addedEmployees.length > 0) {
        const sigla = editingTeam.sigla;
        
        // Adicionar cada funcionário da lista de adicionados
        for (const funcionario of editingTeam.addedEmployees) {
          try {
            // Verifica se o objeto está no formato correto
            const funcionarioFormato = {
              mtrc: funcionario.mtrc || funcionario.matricula,
              nome: funcionario.nome,
              motivo: funcionario.motivo || "Adicionado via interface",
              observacoes: funcionario.observacoes || `Funcionário adicionado à equipe ${sigla}`
            };
            
            await equipeService.adicionarFuncionario(sigla, funcionarioFormato);
            console.log(`Funcionário ${funcionarioFormato.mtrc} adicionado à equipe ${sigla} com sucesso`);
          } catch (error) {
            console.error(`Erro ao adicionar funcionário à equipe ${sigla}:`, error);
            
            // Se houver erro, mostra ao usuário
            setSyncResult({
              success: false,
              message: `Erro ao adicionar funcionário: ${error.response?.data?.detail || error.message}`
            });
          }
        }
      }
      
      // Recarregar a lista de funcionários para obter a versão atualizada da API
      try {
        const funcionarios = await equipeService.getFuncionariosEquipe(editingTeam.sigla);
        console.log(`Funcionários atualizados da equipe ${editingTeam.sigla}:`, funcionarios);
        
        // Atualizar a equipe com os funcionários atualizados
        editingTeam.funcionarios = funcionarios;
      } catch (error) {
        console.error(`Erro ao atualizar lista de funcionários da equipe ${editingTeam.sigla}:`, error);
      }
      
      // Atualizar a lista de equipes com a versão editada
      setTeams(teams.map(team => 
        team.id === editingTeam.id ? {
          ...editingTeam,
          removedEmployees: undefined,
          addedEmployees: undefined
        } : team
      ));
      
      // Limpar o estado de edição
      setEditingTeamId(null);
      setEditingTeam(null);
      
      // Mostrar mensagem de sucesso
      setSyncResult({
        success: true,
        message: "Equipe atualizada com sucesso!"
      });
      
      // Limpa a mensagem após alguns segundos
      setTimeout(() => {
        setSyncResult(null);
      }, 3000);
      
    } catch (err) {
      console.error("Erro ao salvar equipe:", err);
      setSyncResult({
        success: false,
        message: `Erro ao salvar equipe: ${err.message || "Erro desconhecido"}`
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const removeEmployee = (employeeId) => {
    // Encontrar o funcionário a ser removido
    const funcionarioRemovido = editingTeam.funcionarios.find(f => f.matricula === employeeId || f.mtrc === employeeId);
    
    if (funcionarioRemovido) {
      // Criar objeto no formato esperado pelo backend (FuncionarioEquipeRemove)
      const funcionarioParaRemover = {
        mtrc: funcionarioRemovido.mtrc || funcionarioRemovido.matricula,
        motivo: "Removido via interface de gerenciamento de equipes",
        observacoes: `Funcionário ${funcionarioRemovido.nome} removido da equipe ${editingTeam.sigla}`
      };
      
      // Adicionar à lista de funcionários removidos para salvar Posteriormente
      const removedEmployees = editingTeam.removedEmployees || [];
      
      console.log(`Preparando para remover funcionário: ${JSON.stringify(funcionarioParaRemover)}`);
      
      // Adicionar à lista de removidos ou manter o estado anterior
      const novoStateEditingTeam = {
        ...editingTeam,
        funcionarios: editingTeam.funcionarios.filter(emp => 
          (emp.matricula !== employeeId && emp.mtrc !== employeeId)
        ),
        removedEmployees: [...removedEmployees, funcionarioParaRemover],
        // Adicionar funcionário à lista de funcionários removidos que podem ser reincluídos
        funcionariosRemovidosRecentes: [...(editingTeam.funcionariosRemovidosRecentes || []), funcionarioRemovido]
      };
      
      setEditingTeam(novoStateEditingTeam);
      
      // Adicionalmente, podemos atualizar a lista de originais se o modal estiver aberto
      if (showAddModal) {
        loadOriginalEmployees();
      }
    } else {
      console.error(`Não foi possível encontrar o funcionário com ID ${employeeId}`);
    }
  };
  
  const loadOriginalEmployees = async () => {
    if (!editingTeam) return;
    
    try {
      setLoadingOriginais(true);
      
      // Lista de matrículas de funcionários que já estão na equipe
      const matriculasAtuais = editingTeam.funcionarios.map(f => 
        f.matricula || f.mtrc
      );
      
      console.log("Funcionários atuais:", matriculasAtuais);
      
      // Vamos buscar funcionários tanto dos dados iniciais quanto dos recentemente removidos
      let funcionariosDisponiveis = [];
      
      // 1. Tentar buscar funcionários originais via API
      try {
        const funcionariosOriginais = await equipeService.getFuncionariosOriginaisNaoVinculados(editingTeam.sigla);
        
        if (funcionariosOriginais && funcionariosOriginais.length > 0) {
          console.log(`Encontrados ${funcionariosOriginais.length} funcionários originais para reinclusão`);
          
          const funcionariosFormatados = funcionariosOriginais.map(f => ({
            mtrc: f.mtrc,
            nome: f.nome || "Nome não informado",
            cargo: f.cargo || f.tx_cmss_fun || "Cargo não informado",
            fonte: "ORIGINAL (API)",
            ativo: false
          }));
          
          funcionariosDisponiveis = [...funcionariosDisponiveis, ...funcionariosFormatados];
        } else {
          console.log("Nenhum funcionário original encontrado via API");
        }
      } catch (error) {
        console.error("Erro ao buscar funcionários originais:", error);
      }
      
      // 2. Adicionar funcionários recentemente removidos na sessão atual
      if (editingTeam.funcionariosRemovidosRecentes && editingTeam.funcionariosRemovidosRecentes.length > 0) {
        console.log("Funcionários removidos recentemente:", editingTeam.funcionariosRemovidosRecentes);
        
        const funcionariosRemovidos = editingTeam.funcionariosRemovidosRecentes
          .filter(f => {
            const matricula = f.matricula || f.mtrc;
            // Garantir que não está duplicado e não está na lista atual
            return matricula && 
              !matriculasAtuais.includes(matricula) && 
              !funcionariosDisponiveis.some(fd => (fd.mtrc === matricula || fd.matricula === matricula));
          })
          .map(f => ({
            mtrc: f.matricula || f.mtrc,
            nome: f.nome,
            cargo: f.cargo,
            fonte: "REMOVIDO RECENTEMENTE",
            ativo: false
          }));
        
        funcionariosDisponiveis = [...funcionariosDisponiveis, ...funcionariosRemovidos];
      }
      
      console.log("Total de funcionários disponíveis para reinclusão:", funcionariosDisponiveis.length);
      setFuncionariosOriginais(funcionariosDisponiveis);
      
      if (funcionariosDisponiveis.length === 0) {
        console.log("Não há funcionários disponíveis para reinclusão");
      }
      
      // Aqui seria a chamada real à API:
      // const originais = await equipeService.getFuncionariosOriginaisNaoVinculados(editingTeam.sigla);
      // se originais.length > 0, processar e usar esses dados
      
    } catch (error) {
      console.error("Erro ao carregar funcionários originais:", error);
      setFuncionariosOriginais([]);
    } finally {
      setLoadingOriginais(false);
    }
  };
  
  const addEmployee = async () => {
    setFuncionariosSelecionados([]);
    await loadOriginalEmployees();
    setShowAddModal(true);
  };
  
  const handleSelectEmployee = (funcionario) => {
    // Verificar se o funcionário já está selecionado
    const isSelected = funcionariosSelecionados.some(f => f.mtrc === funcionario.mtrc);
    
    if (isSelected) {
      // Remove da lista se já estiver selecionado
      setFuncionariosSelecionados(
        funcionariosSelecionados.filter(f => f.mtrc !== funcionario.mtrc)
      );
    } else {
      // Adiciona à lista de selecionados
      setFuncionariosSelecionados([...funcionariosSelecionados, funcionario]);
    }
  };
  
  const confirmAddEmployees = () => {
    if (funcionariosSelecionados.length === 0 || !editingTeam) {
      setShowAddModal(false);
      return;
    }
    
    // Converter funcionários selecionados para o formato da interface
    const novosFuncionarios = funcionariosSelecionados.map(f => ({
      matricula: f.mtrc,
      nome: f.nome,
      cargo: f.cargo || f.tx_cmss_fun || "Cargo não informado"
    }));
    
    // Converter para o formato esperado pelo backend
    const funcionariosParaAdicionar = funcionariosSelecionados.map(f => ({
      mtrc: f.mtrc,
      nome: f.nome,
      motivo: "Reinclusão via interface de gerenciamento de equipes",
      observacoes: `Funcionário ${f.nome} reincluído na equipe ${editingTeam.sigla}`
    }));
    
    // Adicionar à lista de funcionários e à lista de adicionados
    const addedEmployees = editingTeam.addedEmployees || [];
    
    setEditingTeam({
      ...editingTeam,
      funcionarios: [...editingTeam.funcionarios, ...novosFuncionarios],
      addedEmployees: [...addedEmployees, ...funcionariosParaAdicionar]
    });
    
    // Fechar o modal
    setShowAddModal(false);
  };

  const syncTeamsWithAPI = async () => {
    try {
      setSyncLoading(true);
      setSyncResult(null);
      
      // Tentar sincronizar equipes via API, se disponível
      try {
        // Se tiver implementação para sincronização, use-a
        const syncResult = await equipeService.sincronizarEquipesDicoi();
        console.log("Resultado da sincronização:", syncResult);
        
        // Se a sincronização for bem-sucedida, atualize os dados
        await fetchEquipesFromAPI();
        
        setSyncResult({
          success: true,
          message: `Equipes sincronizadas com sucesso. ${syncResult.updated || 0} equipes atualizadas.`
        });
      } catch (syncError) {
        console.warn("Endpoint de sincronização indisponível, atualizando apenas a visualização:", syncError);
        
        // Se não puder sincronizar, apenas recarregar os dados
        await fetchEquipesFromAPI();
        
        setSyncResult({
          success: true,
          message: "Dados de equipes atualizados com sucesso."
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar equipes:", error);
      setSyncResult({
        success: false,
        message: "Erro ao sincronizar equipes. Por favor, tente novamente."
      });
    } finally {
      setSyncLoading(false);
      
      // Limpa a mensagem após 5 segundos
      setTimeout(() => {
        setSyncResult(null);
      }, 5000);
    }
  };

  const filteredTeams = filterTeams();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-12 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Carregando dados das equipes...</p>
      </div>
    );
  }

  // Renderizar o modal de adicionar funcionários
  const renderAddEmployeeModal = () => {
    if (!showAddModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">Adicionar funcionários à equipe {editingTeam?.sigla}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-auto">
            {loadingOriginais ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-2">Carregando funcionários originais...</p>
              </div>
            ) : funcionariosOriginais.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Não foram encontrados funcionários originais não vinculados a esta equipe.</p>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-600">
                  Selecione os funcionários que deseja adicionar novamente à equipe:
                </p>
                
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {funcionariosOriginais.length > 0 ? (
                    funcionariosOriginais.map(funcionario => {
                      const isSelected = funcionariosSelecionados.some(f => f.mtrc === funcionario.mtrc);
                      const isRemoved = funcionario.fonte === "REMOVIDO RECENTEMENTE";
                      
                      return (
                        <div 
                          key={funcionario.mtrc}
                          className={`border p-3 rounded-lg cursor-pointer 
                            ${isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                            ${isRemoved ? 'border-orange-200' : 'border-gray-200'}
                          `}
                          onClick={() => handleSelectEmployee(funcionario)}
                        >
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => {}} // Controlado pelo clique no div
                              className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0"
                            />
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{funcionario.mtrc} - {funcionario.nome}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ml-2 
                                  ${isRemoved ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {isRemoved ? 'Removido recentemente' : 'Original'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{funcionario.cargo || "Cargo não informado"}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-gray-50 p-8 text-center rounded-lg border">
                      <p className="text-gray-500 font-medium">Nenhum funcionário encontrado para reinclusão.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Tente remover algum funcionário da equipe e ele aparecerá aqui para reinclusão.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-gray-700 border rounded-md"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
              onClick={confirmAddEmployees}
              disabled={funcionariosSelecionados.length === 0}
            >
              Adicionar ({funcionariosSelecionados.length})
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto p-2 md:p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Equipes de Validação de Modelos</h1>
        <p className="text-gray-600">Visualize e gerencie as equipes responsáveis pela validação de modelos.</p>
      </div>
      
      {renderAddEmployeeModal()}

      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Buscar por nome, matrícula..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 text-sm rounded-lg font-medium ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('cards')}
          >
            Cards
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-lg font-medium ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('table')}
          >
            Tabela
          </button>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 text-sm rounded-lg font-medium bg-purple-600 text-white flex items-center"
              onClick={async () => {
                try {
                  setSyncResult(null);
                  setSyncLoading(true);
                  const logs = await equipeService.getHistoricoAlteracoes();
                  console.log('Histórico de alterações:', logs);
                  
                  if (logs && logs.length > 0) {
                    // Mostrar mensagem com informações dos últimos logs
                    const ultimosLogs = logs.slice(0, 5).map(log => 
                      `${new Date(log.data_alteracao).toLocaleDateString()}: ${log.tipo_alteracao} - ${log.descricao || 'Sem descrição'}`
                    );
                    
                    setSyncResult({
                      success: true,
                      message: `Últimas alterações:\n${ultimosLogs.join('\n')}`
                    });
                  } else {
                    setSyncResult({
                      success: true,
                      message: "Nenhum registro de alteração encontrado."
                    });
                  }
                } catch (error) {
                  console.error('Erro ao buscar histórico de alterações:', error);
                  setSyncResult({
                    success: false,
                    message: `Erro ao buscar histórico: ${error.message || 'Erro desconhecido'}`
                  });
                } finally {
                  setSyncLoading(false);
                  setTimeout(() => {
                    setSyncResult(null);
                  }, 10000);
                }
              }}
            >
              <History className="w-4 h-4 mr-1" />
              Histórico
            </button>
          </div>
        </div>
      </div>

      {syncResult && (
        <div className={`mb-4 p-4 rounded-lg ${syncResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {syncResult.message}
        </div>
      )}

      {filteredTeams.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg text-yellow-800 my-6">
          <h3 className="font-medium mb-2">Nenhuma equipe encontrada</h3>
          <p>Não foram encontradas equipes com os critérios de busca utilizados.</p>
          {searchTerm && (
            <button
              className="mt-2 px-4 py-2 bg-yellow-200 text-yellow-800 rounded-md text-sm font-medium"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredTeams.map(team => (
              <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                  onClick={() => toggleTeam(team.id)}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{team.sigla}</h2>
                    <p className="text-sm text-gray-600">{team.nome}</p>
                  </div>
                  <div className="flex items-center">
                    {editingTeamId !== team.id && (
                      <button 
                        className="text-blue-600 hover:text-blue-800 mr-2 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditTeam(team);
                        }}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {expandedTeams[team.id] ? 
                      <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedTeams[team.id] && (
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Gerente</h3>
                      <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                        <User className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">{team.gerente.matricula} - {team.gerente.nome}</p>
                          <p className="text-sm text-gray-600">{team.gerente.cargo}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-700">Funcionários ({team.funcionarios.length})</h3>
                        {editingTeamId === team.id && (
                          <div className="flex space-x-2">
                            <button 
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center"
                              onClick={addEmployee}
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Adicionar
                            </button>
                            <button 
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center"
                              onClick={saveTeam}
                              disabled={syncLoading}
                            >
                              {syncLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                                  Salvando...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-1" />
                                  Salvar
                                </>
                              )}
                            </button>
                            <button 
                              className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm flex items-center"
                              onClick={cancelEdit}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {team.funcionarios.length === 0 ? (
                        <div className="bg-gray-50 p-4 rounded text-gray-500 text-center">
                          Não há funcionários cadastrados para esta equipe.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(editingTeamId === team.id ? editingTeam.funcionarios : team.funcionarios).map(funcionario => (
                            <div key={funcionario.matricula} className="border rounded-lg p-3 flex justify-between items-start">
                              <div>
                                <p className="font-medium">{funcionario.matricula} - {funcionario.nome}</p>
                                {/* Exibir o cargo sem fallback para diagnosticar o problema */}
                                <p className="text-sm text-gray-600">
                                  {/* Mostrar apenas o cargo encontrado */}
                                  {funcionario.cargo || "Sem cargo informado"}
                                </p>
                              </div>
                              {editingTeamId === team.id && (
                                <button 
                                  className="text-red-500 hover:text-red-700 p-1"
                                  onClick={() => removeEmployee(funcionario.matricula)}
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gerente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionários
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{team.sigla}</div>
                          <div className="text-sm text-gray-500">{team.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {team.gerente.matricula} - {team.gerente.nome}
                          </div>
                          <div className="text-sm text-gray-500">{team.gerente.cargo || "GER SOLUCOES UE"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {team.funcionarios.length} funcionários
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingTeamId !== team.id ? (
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          onClick={() => startEditTeam(team)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            className="text-green-600 hover:text-green-800"
                            onClick={saveTeam}
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800"
                            onClick={cancelEdit}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default EquipesTab;