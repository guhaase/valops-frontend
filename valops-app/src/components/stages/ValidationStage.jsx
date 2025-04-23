// ValidationStage.js
import React, { useState } from 'react';
import { ArrowLeft, Info, CheckCircle2, FileText, Users, AlertTriangle, CheckCircle, Building, Workflow, ListTodo } from 'lucide-react';
import OverviewTab from './validation/OverviewTab';
import EquipesTab from './validation/EquipesTab';
import PipelineTab from './validation/PipelineTab';
import WorkQueueTab from './validation/WorkQueueTab';

const ValidationStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-none">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Validação</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 5
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
            onClick={() => setActiveTab('equipes')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'equipes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Building size={16} className="mr-2" />
              Equipes
            </div>
          </button>
          <button
            onClick={() => setActiveTab('workqueue')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'workqueue'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <ListTodo size={16} className="mr-2" />
              Fila de Trabalho
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Workflow size={16} className="mr-2" />
              Pipeline
            </div>
          </button>
          <button
            onClick={() => setActiveTab('autonomous')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'autonomous'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <CheckCircle2 size={16} className="mr-2" />
              Validação Autônoma
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              Validação Manual
            </div>
          </button>
          <button
            onClick={() => setActiveTab('avl')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'avl'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              Relatório AVL
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && <OverviewTab />}
        
        {activeTab === 'equipes' && <EquipesTab />}
        
        {activeTab === 'workqueue' && <WorkQueueTab />}
        
        {activeTab === 'pipeline' && <PipelineTab />}
        
        {activeTab === 'autonomous' && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Validação</h3>
              <p className="mb-4">
                A etapa de Validação representa o processo decisório quanto à aprovação ou não do modelo.
                Esta decisão é baseada nos resultados da etapa de Testes e pode ocorrer de forma autônoma 
                (automática) ou manual, dependendo do score obtido e dos critérios definidos pela DICOI.
              </p>
              <p>
                Quando aprovado, o modelo recebe um relatório de validação (AVL) que confirma sua 
                conformidade com os requisitos técnicos e negociais, permitindo seu avanço para a 
                implementação em produção.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Tipos de Validação</h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-green-800">Validação Autônoma</h5>
                        <p className="text-sm text-green-700 mt-1">
                          Aprovação automática baseada em critérios pré-definidos (score > 7.0)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-blue-800">Validação Manual</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Avaliação realizada pela equipe DICOI, baseada em testes automáticos e manuais
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Resultados Possíveis</h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-green-800">Aprovação</h5>
                        <p className="text-sm text-green-700 mt-1">
                          O modelo atende aos requisitos e pode seguir para implementação
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-yellow-800">Aprovação com Ressalvas</h5>
                        <p className="text-sm text-yellow-700 mt-1">
                          O modelo pode ser implementado, mas há recomendações de melhorias
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-red-800">Reprovação</h5>
                        <p className="text-sm text-red-700 mt-1">
                          O modelo não atende aos requisitos e precisa de ajustes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Validação</h4>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
                  <p className="text-sm font-medium">Recebimento dos Resultados</p>
                  <p className="text-xs text-gray-500 mt-1">Testes automatizados e manuais</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
                  <p className="text-sm font-medium">Avaliação de Critérios</p>
                  <p className="text-xs text-gray-500 mt-1">Score > 7.0 = Autônoma</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
                  <p className="text-sm font-medium">Decisão de Validação</p>
                  <p className="text-xs text-gray-500 mt-1">Autônoma ou Manual</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
                  <p className="text-sm font-medium">Geração do AVL</p>
                  <p className="text-xs text-gray-500 mt-1">Relatório de validação</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'autonomous' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Validação Autônoma</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-4">
                A validação autônoma é um processo automatizado que decide pela aprovação ou não
                do modelo com base em critérios pré-definidos pela DICOI. Este tipo de validação
                é aplicado quando o modelo atinge um score superior a 7.0 nos testes automatizados.
              </p>
              <p>
                Este processo aumenta a eficiência da validação e permite que a equipe DICOI foque
                em avaliações mais complexas que requerem intervenção humana.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Critérios para Validação Autônoma</h4>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critério</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Mínimo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Score Geral</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Pontuação geral do modelo nos testes automatizados</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Desempenho</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Métricas específicas de desempenho do algoritmo</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Robustez</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Estabilidade e resistência a variações nos dados</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.5</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Documentação</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Qualidade e completude da documentação</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Equidade</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Ausência de vieses significativos</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Processo de Decisão</h4>
                <p className="text-sm text-gray-600 mb-4">
                  O processo de decisão na validação autônoma segue os seguintes passos:
                </p>
                <ol className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">1</div>
                    <div className="text-sm">
                      <p>Verificação do score geral (≥ 7.0)</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">2</div>
                    <div className="text-sm">
                      <p>Checagem do atendimento aos valores mínimos em cada critério</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">3</div>
                    <div className="text-sm">
                      <p>Verificação de alertas críticos que impedem a aprovação automática</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">4</div>
                    <div className="text-sm">
                      <p>Decisão final (Aprovado/Reprovado) com base nas regras parametrizadas</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Parametrização</h4>
                <p className="text-sm text-gray-600 mb-4">
                  A DICOI tem a possibilidade de parametrizar os critérios de validação autônoma:
                </p>
                <ul className="space-y-2">
                  <li className="text-sm flex">
                    <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>Ajuste do score mínimo para aprovação automática</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>Definição dos valores mínimos para cada critério</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>Configuração de alertas críticos impeditivos</span>
                  </li>
                  <li className="text-sm flex">
                    <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span>Definição de regras específicas por tipo de modelo</span>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 bg-yellow-50 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Importante:</strong> Mesmo em validação autônoma, o sistema pode encaminhar
                        o modelo para validação manual caso identifique padrões que exijam análise humana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Benefícios da Validação Autônoma</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Eficiência</h5>
                  <p className="text-xs text-gray-600">
                    Redução significativa no tempo de validação para modelos que atendem aos critérios
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Consistência</h5>
                  <p className="text-xs text-gray-600">
                    Aplicação consistente de critérios de avaliação em todos os modelos
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Foco Estratégico</h5>
                  <p className="text-xs text-gray-600">
                    Permite que a equipe DICOI dedique mais tempo a modelos complexos ou críticos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Validação Manual</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                A validação manual é realizada pela equipe DICOI quando o modelo não atinge o score
                necessário para validação autônoma ou quando possui características específicas que
                exigem análise humana. O validador utiliza tanto os resultados dos testes automatizados
                quanto as evidências dos testes manuais para tomar a decisão.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Users size={20} className="text-blue-600 mr-2" />
                  Processo de Validação Manual
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Atividades do Validador:</p>
                    <ol className="mt-2 space-y-2">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">1.</span>
                        <span>Análise dos resultados dos testes automatizados</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">2.</span>
                        <span>Avaliação das evidências dos testes manuais</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">3.</span>
                        <span>Verificação de conformidade com requisitos de negócio</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">4.</span>
                        <span>Identificação de riscos e pontos de atenção</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">5.</span>
                        <span>Decisão de aprovação, aprovação com ressalvas ou reprovação</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">6.</span>
                        <span>Elaboração de relatório detalhado (AVL)</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <AlertTriangle size={20} className="text-blue-600 mr-2" />
                  Critérios de Avaliação
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Aspectos considerados:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Desempenho técnico do modelo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Alinhamento com objetivos de negócio</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Qualidade de código e documentação</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Robustez e estabilidade</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Vieses e questões éticas</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Potenciais riscos operacionais</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Conformidade com políticas internas</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Possíveis Resultados</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Aprovação</h5>
                  <p className="text-xs text-green-700">
                    O modelo atende a todos os requisitos técnicos e de negócio, podendo ser implementado em produção.
                  </p>
                  <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                    <strong>Próximo passo:</strong> Etapa de Implementação
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Aprovação com Ressalvas</h5>
                  <p className="text-xs text-yellow-700">
                    O modelo pode ser implementado, mas há recomendações de melhorias que devem ser consideradas em versões futuras.
                  </p>
                  <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
                    <strong>Próximo passo:</strong> Implementação com plano de melhorias
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="text-sm font-medium text-red-800 mb-2">Reprovação</h5>
                  <p className="text-xs text-red-700">
                    O modelo não atende aos requisitos mínimos e precisa de ajustes antes de seguir para implementação.
                  </p>
                  <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800">
                    <strong>Próximo passo:</strong> Retorno ao desenvolvimento para ajustes
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Upload de Evidências</h4>
              <p className="text-sm text-gray-600 mb-3">
                Durante o processo de validação manual, o validador pode realizar o upload de documentos
                complementares na etapa de validação do GAIA:
              </p>
              <ul className="space-y-2">
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Relatórios detalhados de avaliação</span>
                </li>
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Evidências de testes adicionais realizados</span>
                </li>
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Documentação de análises específicas</span>
                </li>
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span>Recomendações para melhorias futuras</span>
                </li>
              </ul>
              <p className="text-sm mt-3 italic text-gray-600">
                Estas evidências fazem parte do registro oficial de validação do modelo e são 
                armazenadas junto ao AVL no GAIA.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'avl' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Relatório AVL</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                O AVL (Relatório de Validação) é o documento oficial que registra a aprovação do modelo
                e consolida todas as informações do processo de validação. Este relatório é gerado ao final
                da etapa de validação e fica disponível no GAIA para consulta futura.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Conteúdo do AVL</h4>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seção</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Identificação</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Informações básicas do modelo: ID GAIA, nome, versão, área responsável
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Resultado da Validação</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Decisão final: Aprovado, Aprovado com ressalvas ou Reprovado
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Resumo dos Testes</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Síntese dos resultados dos testes automatizados e manuais
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Métricas</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Detalhamento do desempenho em cada uma das métricas avaliadas
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Recomendações</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Sugestões de melhorias ou ajustes para versões futuras
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Riscos e Mitigações</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Identificação de potenciais riscos e estratégias de mitigação
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Validador</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Identificação do validador (ou "Validação Autônoma") e data da validação
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Documentos Anexos</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Listagem de documentos e evidências adicionais
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Geração do AVL</h4>
                <p className="text-sm text-gray-600 mb-4">
                  O processo de geração do AVL varia de acordo com o tipo de validação:
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Validação Autônoma:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Gerado automaticamente pelo sistema</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Incorpora os resultados dos testes automatizados</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Registrado automaticamente no GAIA</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Validação Manual:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Elaborado pelo validador da DICOI</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Combina resultados automáticos e análise manual</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Pode incluir documentos e evidências adicionais</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Importância do AVL</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Função do Documento:</p>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Registro Oficial:</strong> Documento formal que atesta a validação do modelo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Rastreabilidade:</strong> Permite auditar o processo de validação a qualquer momento</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Base para Evolução:</strong> Referência para melhorias em versões futuras</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Governança:</strong> Parte essencial do ciclo de vida de modelos</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Nota:</strong> O AVL é um requisito obrigatório para a implementação
                        de modelos em produção, conforme definido na IN 1230-1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Conclusão da Etapa de Validação</h4>
              <p className="text-sm text-gray-600 mb-3">
                A etapa de Validação é concluída com o registro do AVL no GAIA, que pode ter os seguintes resultados:
              </p>
              <ul className="space-y-2">
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span><strong>Aprovado:</strong> O modelo segue para a etapa de Implementação</span>
                </li>
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
                  <span><strong>Aprovado com Ressalvas:</strong> Segue para Implementação, mas com recomendações a serem consideradas</span>
                </li>
                <li className="text-sm flex">
                  <CheckCircle2 size={16} className="text-red-500 mr-2 flex-shrink-0" />
                  <span><strong>Reprovado:</strong> Retorna para a etapa de Desenvolvimento para ajustes</span>
                </li>
              </ul>
              <p className="text-sm mt-3 italic text-gray-600">
                Após a conclusão da validação, os resultados dos testes e relatórios ficam disponíveis para
                visualização pelo desenvolvedor e gestor do modelo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationStage;