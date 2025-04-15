// ImplementationStage.js
import React, { useState } from 'react';
import { ArrowLeft, Info, Server, Activity, LineChart, AlertTriangle, RefreshCw } from 'lucide-react';

const ImplementationStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Implementação</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 6
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Info size={16} className="mr-2" />
              Visão Geral
            </div>
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'deployment'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Server size={16} className="mr-2" />
              Deployment
            </div>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'monitoring'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Activity size={16} className="mr-2" />
              Monitoramento
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Implementação</h3>
              <p className="mb-4">
                A etapa de Implementação representa a transição do modelo validado para o ambiente 
                de produção. Nesta fase, o ID aprovado é implementado, integrado aos sistemas e 
                disponibilizado para uso.
              </p>
              <p>
                Esta é a etapa final do processo de validação no ValOps, onde o modelo começa a
                gerar valor para o negócio e passa a ser monitorado continuamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Pré-requisitos</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Modelo validado com AVL</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Status atualizado no GAIA</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Artefatos e código-fonte finalizados</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Documentação completa</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Atividades</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">1</span>
                    </div>
                    <span className="ml-2">Preparação do ambiente de produção</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">2</span>
                    </div>
                    <span className="ml-2">Deployment do modelo</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">3</span>
                    </div>
                    <span className="ml-2">Configuração de monitoramento</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">4</span>
                    </div>
                    <span className="ml-2">Início de operação em produção</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Resultados</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Modelo em produção</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Sistema de monitoramento ativo</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Documentação operacional</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Ciclo de validação concluído</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Implementação</h4>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
                  <p className="text-sm font-medium">Recebimento do Modelo</p>
                  <p className="text-xs text-gray-500 mt-1">Após validação com AVL</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
                  <p className="text-sm font-medium">Preparação do Ambiente</p>
                  <p className="text-xs text-gray-500 mt-1">Infraestrutura e dependências</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
                  <p className="text-sm font-medium">Deployment</p>
                  <p className="text-xs text-gray-500 mt-1">Implantação do modelo</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
                  <p className="text-sm font-medium">Ativação</p>
                  <p className="text-xs text-gray-500 mt-1">Início de operação</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Deployment em Produção</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                O deployment é o processo de implantação do modelo validado em ambiente de produção.
                Este processo envolve a preparação do ambiente, configuração de infraestrutura,
                integração com outros sistemas e testes finais antes da liberação para uso.
              </p>
            </div>
            
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Server size={20} className="text-blue-600 mr-2" />
                    Métodos de Deployment
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">API REST:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Exposição do modelo como serviço via API</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Integração facilitada com diversos sistemas</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Documentação padrão com Swagger/OpenAPI</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Batch Processing:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Processamento de grandes volumes de dados</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Agendamento de execuções periódicas</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Integração com pipelines de dados</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Embedded Model:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Integração direta em aplicações</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Distribuição como biblioteca/pacote</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-green-500 mr-2">•</span>
                          <span>Operação sem dependência de rede</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Activity size={20} className="text-blue-600 mr-2" />
                    Processo de Deployment
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">1. Preparação:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Configuração de ambiente e infraestrutura</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Instalação de dependências e bibliotecas</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Configuração de acessos e permissões</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">2. Implantação:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Deploy do código e artefatos</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Configuração de endpoints/interfaces</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Integração com sistemas de monitoramento</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">3. Validação em Produção:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Testes de sanidade no ambiente produtivo</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Verificação de integrações</span>
                        </li>
                        <li className="text-sm flex">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Validação de performance e escalabilidade</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">Infraestrutura</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Server size={20} className="text-blue-700 mr-2" />
                      <h5 className="text-sm font-semibold text-gray-700">On-Premises</h5>
                    </div>
                    <ul className="space-y-1">
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Servidores internos dedicados</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Alta segurança para dados sensíveis</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Integração direta com sistemas legados</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Server size={20} className="text-purple-700 mr-2" />
                      <h5 className="text-sm font-semibold text-gray-700">Cloud</h5>
                    </div>
                    <ul className="space-y-1">
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Serviços AWS, Azure ou GCP</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Escalabilidade sob demanda</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Serviços gerenciados de ML (SageMaker, etc.)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Server size={20} className="text-green-700 mr-2" />
                      <h5 className="text-sm font-semibold text-gray-700">Híbrida</h5>
                    </div>
                    <ul className="space-y-1">
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Combinação das abordagens anteriores</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Processamento em cloud, dados sensíveis on-prem</span>
                      </li>
                      <li className="text-xs flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Flexibilidade de acordo com requisitos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Considerações Importantes</h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="space-y-1">
                        <li className="flex">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span>Garantir compatibilidade entre ambientes de desenvolvimento e produção</span>
                        </li>
                        <li className="flex">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span>Implementar estratégias de rollback em caso de problemas</span>
                        </li>
                        <li className="flex">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span>Documentar todo o processo de deployment para facilitar manutenção futura</span>
                        </li>
                        <li className="flex">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span>Configurar alertas e monitoramento desde o início da operação</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Monitoramento Contínuo</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                O monitoramento contínuo é essencial para garantir que o modelo continue operando
                corretamente em produção. Esta atividade permite identificar problemas de performance,
                drifts nos dados e outras questões que podem afetar a qualidade das predições.
              </p>
              <p>
                A configuração de monitoramento é parte integrante da etapa de Implementação e
                representa o início do ciclo de vida do modelo em produção.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Activity size={20} className="text-blue-600 mr-2" />
                  Métricas Monitoradas
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Operacionais:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Tempo de resposta</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Taxa de utilização</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Disponibilidade</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Erros e exceções</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Modelo:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Métricas de desempenho em produção</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Data drift (mudanças nos dados de entrada)</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Concept drift (mudanças na relação entre inputs e outputs)</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Integridade das predições</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Negócio:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Impacto nas métricas de negócio</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Valor gerado pelo modelo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Alinhamento com resultados esperados</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <LineChart size={20} className="text-blue-600 mr-2" />
                  Ferramentas e Processos
                </h4>
                
                <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Sistemas de Monitoramento:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Dashboards de métricas em tempo real</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Sistemas de alertas automatizados</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Logging estruturado</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>APM (Application Performance Monitoring)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Processos:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Revisão periódica de métricas</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Análise de tendências</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Retro-feedback para equipe de desenvolvimento</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Planejamento de retreinamento</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded">
                    <p className="text-sm font-medium text-yellow-700">Níveis de Alerta:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex items-center">
                        <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                        <span>Normal: Operação dentro dos parâmetros</span>
                      </li>
                      <li className="text-sm flex items-center">
                        <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                        <span>Atenção: Métricas próximas aos limites</span>
                      </li>
                      <li className="text-sm flex items-center">
                        <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                        <span>Crítico: Intervenção imediata necessária</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Ciclo de Vida do Modelo</h4>
              
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/5 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">1</span>
                    </div>
                    <p className="text-sm font-medium">Implementação</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deployment inicial do modelo
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/5 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">2</span>
                    </div>
                    <p className="text-sm font-medium">Monitoramento</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Acompanhamento contínuo
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/5 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">3</span>
                    </div>
                    <p className="text-sm font-medium">Avaliação</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Análise periódica de performance
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/5 border-r border-gray-200 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">4</span>
                    </div>
                    <p className="text-sm font-medium">Retreinamento</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Atualização com novos dados
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/5 p-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-800 font-bold">5</span>
                    </div>
                    <p className="text-sm font-medium">Aposentadoria</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Substituição do modelo
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Feedback Loop</h4>
              <p className="text-sm text-gray-600 mb-3">
                O monitoramento contínuo permite estabelecer um ciclo de feedback que alimenta
                o processo de melhoria contínua:
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Activity size={28} className="text-blue-700" />
                  </div>
                  <p className="text-sm font-medium">Monitoramento</p>
                </div>
                <div className="text-blue-500">→</div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <LineChart size={28} className="text-green-700" />
                  </div>
                  <p className="text-sm font-medium">Insights</p>
                </div>
                <div className="text-blue-500">→</div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Server size={28} className="text-purple-700" />
                  </div>
                  <p className="text-sm font-medium">Melhorias</p>
                </div>
                <div className="text-blue-500">→</div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <RefreshCw size={28} className="text-yellow-700" />
                  </div>
                  <p className="text-sm font-medium">Redeployment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImplementationStage;