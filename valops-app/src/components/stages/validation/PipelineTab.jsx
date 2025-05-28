import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  Upload, 
  Play, 
  FileCog, 
  FileText, 
  List, 
  BarChart,
  AlertCircle,
  ArrowUpDown,
  Clock,
  ArrowRightLeft,
  RotateCcw
} from 'lucide-react';

const PipelineTab = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubtab, setActiveSubtab] = useState('Prévia');
  
  // Função para renderizar a sub-navegação - removida conforme solicitado
  const renderSubNavigation = () => {
    return null;
  };
  
  return (
    <div>
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Pipeline de Validação</h3>
        
        {/* Sub-navegação para todas as seções da Pipeline - POSICIONADA AQUI */}
        {renderSubNavigation()}
        
        <p className="mb-3 mt-3">
          Importe artefatos, configure APIs de testes e defina uma estratégia completa para validação do seu modelo.
          Este ambiente permite organizar e automatizar o processo de validação, criando fluxos personalizados
          que atendam aos requisitos específicos do seu projeto.
        </p>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Nova funcionalidade disponível!</h4>
              <p className="text-sm text-green-700 mt-1">
                A nova API de Validação de Modelos está disponível para uso. Acesse a aba <strong>APIs de Teste</strong> para experimentar.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex overflow-x-auto mb-6 pb-2">
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${
              activeSection === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Workflow size={16} className="mr-2" />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveSection('artifacts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${
              activeSection === 'artifacts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload size={16} className="mr-2" />
            Artefatos
          </button>
          <button 
            onClick={() => setActiveSection('apis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${
              activeSection === 'apis' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } relative`}
          >
            <FileCog size={16} className="mr-2" />
            APIs de Teste
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" title="Nova API disponível"></span>
          </button>
          <button 
            onClick={() => setActiveSection('queue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${
              activeSection === 'queue' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List size={16} className="mr-2" />
            Fila de Processamento
          </button>
          <button 
            onClick={() => setActiveSection('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${
              activeSection === 'reports' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} className="mr-2" />
            Modelos de Relatório
          </button>
        </div>
      </div>
      
      {/* Conteúdo das seções */}
      {activeSection === 'overview' && activeSubtab === 'Prévia' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Validação Prévia</h4>
          <p className="text-sm text-gray-600 mb-4">
            A validação prévia ocorre antes da implementação do modelo e garante que todos os requisitos técnicos 
            e de qualidade sejam atendidos antes do seu uso em produção.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Objetivos da Validação Prévia</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p className="ml-3 text-sm text-gray-600">Verificar conformidade técnica e qualidade do modelo</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p className="ml-3 text-sm text-gray-600">Avaliar métricas de desempenho em dados de teste controlados</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p className="ml-3 text-sm text-gray-600">Identificar e mitigar potenciais riscos antes da implementação</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p className="ml-3 text-sm text-gray-600">Garantir que o modelo está pronto para implementação em produção</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'overview' && activeSubtab === 'revalidacao' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Revalidação</h4>
          <p className="text-sm text-gray-600 mb-4">
            A revalidação é realizada periodicamente ou quando ocorrem mudanças significativas nos dados ou 
            no ambiente de produção, garantindo que o modelo continue funcionando conforme esperado.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Objetivos da Revalidação</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p className="ml-3 text-sm text-gray-600">Verificar a estabilidade do modelo ao longo do tempo</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p className="ml-3 text-sm text-gray-600">Detectar data drift e model drift em dados reais</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p className="ml-3 text-sm text-gray-600">Recalibrar o modelo conforme necessário</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p className="ml-3 text-sm text-gray-600">Determinar a necessidade de retreinamento ou atualizações</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'overview' && activeSubtab === 'Posterior' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Validação Posterior</h4>
          <p className="text-sm text-gray-600 mb-4">
            A validação Posterior ocorre após a implementação em produção, monitorando continuamente o desempenho 
            do modelo em ambiente real e avaliando seu impacto nos resultados de negócio.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Objetivos da Validação Posterior</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p className="ml-3 text-sm text-gray-600">Monitorar desempenho contínuo em produção</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p className="ml-3 text-sm text-gray-600">Avaliar métricas de negócio e valor gerado</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p className="ml-3 text-sm text-gray-600">Identificar oportunidades de melhoria</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p className="ml-3 text-sm text-gray-600">Retroalimentar o ciclo de desenvolvimento de modelos</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'artifacts' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Workflow className="mr-2 text-blue-600" size={20} />
                Fluxo de Validação
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Defina um fluxo personalizado que integre artefatos, APIs de teste e relatórios para validar seu modelo
                de forma eficiente e padronizada.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <div className="h-0.5 w-16 bg-blue-200"></div>
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <FileCog size={20} />
                      </div>
                      <div className="h-0.5 w-16 bg-blue-200"></div>
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <ArrowUpDown size={20} />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div className="text-center w-10">Artefatos</div>
                      <div className="text-center w-10">APIs</div>
                      <div className="text-center w-10">Processamento</div>
                    </div>
                    
                    <div className="flex items-center mt-8 mb-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <BarChart size={20} />
                      </div>
                      <div className="h-0.5 w-16 bg-blue-200"></div>
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div className="h-0.5 w-16 bg-blue-200"></div>
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div className="text-center w-10">Análise</div>
                      <div className="text-center w-10">Relatório</div>
                      <div className="text-center w-10">Validação</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Configurar Novo Fluxo
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Status do Pipeline</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Artefatos Importados</span>
                    <span className="text-sm font-medium text-blue-700">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">APIs Configuradas</span>
                    <span className="text-sm font-medium text-blue-700">2/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Testes Executados</span>
                    <span className="text-sm font-medium text-green-700">8/8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Relatórios Gerados</span>
                    <span className="text-sm font-medium text-yellow-700">1/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Próximos passos:</strong> Configure as APIs restantes e gere os relatórios pendentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Pipelines Recentes</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Modelo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pipeline de Validação NLP</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NLP / Classificação</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completo</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23/03/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Ver Detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pipeline de Validação Regressão</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Regression / Linear</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Em Progresso</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Continuar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pipeline de Validação Computer Vision</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Computer Vision / Object Detection</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Erro</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28/03/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">Verificar Erro</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'artifacts' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">Artefatos Importados</h4>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                <Upload size={16} className="mr-2" />
                Importar Artefato
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importado em</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      modelo_treinado.h5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Modelo</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">245 MB</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Ver</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      dataset_teste.csv
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dataset</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120 MB</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Ver</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      config_validacao.json
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Configuração</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32 KB</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">02/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Ver</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Tipos de Artefatos Suportados</h4>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                    <div className="text-sm font-bold">ML</div>
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Modelos Treinados</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivos .h5, .pkl, .pt, .onnx, SavedModel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                    <div className="text-sm font-bold">CSV</div>
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Datasets</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivos .csv, .parquet, .json, .xlsx
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center">
                    <div className="text-sm font-bold">CFG</div>
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Configurações</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivos .json, .yaml, .ini, .cfg
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0 h-10 w-10 bg-red-100 text-red-800 rounded-full flex items-center justify-center">
                    <div className="text-sm font-bold">IMG</div>
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Imagens e Mídias</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivos .jpg, .png, .mp4, .wav
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Upload de Artefato</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload size={36} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-xs text-gray-500">Tamanho máximo: 500MB</p>
                
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Selecionar Arquivo
                </button>
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Informações do Artefato</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome Descritivo</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Dataset de validação 2025 Q1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Artefato</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Modelo</option>
                      <option>Dataset</option>
                      <option>Configuração</option>
                      <option>Imagem/Mídia</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Descreva brevemente este artefato..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'apis' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">APIs de Teste Configuradas</h4>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                <FileCog size={16} className="mr-2" />
                Adicionar API
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da API</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Execução</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      API de Validação de Modelo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/api/v1/validation/model</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">02/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Executar</button>
                        <button className="text-blue-600 hover:text-blue-800">Editar</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      API de Validação de Datasets
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/api/v1/validation/dataset</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Executar</button>
                        <button className="text-blue-600 hover:text-blue-800">Editar</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      API de Validação de Desempenho
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/api/v1/validation/performance</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Configurando</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 cursor-not-allowed">Executar</button>
                        <button className="text-blue-600 hover:text-blue-800">Editar</button>
                        <button className="text-red-600 hover:text-red-800">Remover</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Configuração de Nova API</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da API</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: API de Validação de Equidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: /api/v1/validation/fairness"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>POST</option>
                    <option>GET</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                  <div className="text-xs text-indigo-600 mt-1 flex items-center">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Use POST para APIs com upload de arquivos (multipart/form-data)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headers (formato JSON)</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    rows="3"
                    placeholder='{"Content-Type": "application/json", "Authorization": "Bearer ${token}"}'
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Corpo da Requisição (formato JSON)</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    rows="5"
                    placeholder='{"model_path": "${modelPath}", "dataset_path": "${datasetPath}"}'
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Salvar Configuração
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">API de Validação de Modelos</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Nova
                </span>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg mb-4 flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Importante:</strong> Esta API utiliza <code className="font-mono bg-yellow-100 px-1 rounded">multipart/form-data</code> para envio de arquivos.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Esta API permite realizar testes completos em modelos de machine learning, validando robustez, incerteza, resiliência e hiperparâmetros.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X Train *</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="x_train"
                        className="hidden"
                        accept=".csv,.parquet"
                      />
                      <label
                        htmlFor="x_train"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex-grow truncate"
                      >
                        Selecionar arquivo CSV/Parquet
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Arquivo CSV ou Parquet com features de treino</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X Test *</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="x_test"
                        className="hidden"
                        accept=".csv,.parquet"
                      />
                      <label
                        htmlFor="x_test"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex-grow truncate"
                      >
                        Selecionar arquivo CSV/Parquet
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Arquivo CSV ou Parquet com features de teste</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Y Train *</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="y_train"
                        className="hidden"
                        accept=".csv,.parquet"
                      />
                      <label
                        htmlFor="y_train"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex-grow truncate"
                      >
                        Selecionar arquivo CSV/Parquet
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Arquivo CSV ou Parquet com target de treino</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Y Test *</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="y_test"
                        className="hidden"
                        accept=".csv,.parquet"
                      />
                      <label
                        htmlFor="y_test"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex-grow truncate"
                      >
                        Selecionar arquivo CSV/Parquet
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Arquivo CSV ou Parquet com target de teste</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model File *</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="model_file"
                        className="hidden"
                        accept=".pkl,.h5,.joblib,.sav"
                      />
                      <label
                        htmlFor="model_file"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex-grow truncate"
                      >
                        Selecionar arquivo pickle do modelo
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Arquivo pickle do modelo</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experiment Type *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione o tipo de experimento</option>
                      <option value="binary_classification">Classificação Binária</option>
                      <option value="multiclass_classification">Classificação Multiclasse</option>
                      <option value="regression">Regressão</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Tipo de experimento</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tests *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      multiple
                    >
                      <option value="robustness">Robustez</option>
                      <option value="uncertainty">Incerteza</option>
                      <option value="resilience">Resiliência</option>
                      <option value="hyperparameters">Hiperparâmetros</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Lista de testes separados por vírgula</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Execution Type *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione o tipo de execução</option>
                      <option value="quick">Rápida</option>
                      <option value="medium">Média</option>
                      <option value="full">Completa</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Tipo de execução</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experimento *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 12345"
                    />
                    <p className="text-xs text-gray-500 mt-1">Código numérico do experimento para identificar os resultados</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feature Subset (opcional)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: feature1,feature2,feature3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lista de features separadas por vírgula (opcional)</p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <div className="text-sm text-gray-600">
                    * Campos obrigatórios
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                    <Play size={16} className="mr-2" />
                    Executar Validação
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">APIs de Teste Disponíveis</h4>
              <p className="text-sm text-gray-600 mb-4">
                As seguintes APIs estão disponíveis para uso no pipeline de validação:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <h5 className="text-sm font-medium text-gray-700">API de Validação de Modelos</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Executa testes de validação em modelos de ML, verificando a estrutura, 
                    conformidade com padrões e requisitos técnicos.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Endpoint: /api/v1/validation/model
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <h5 className="text-sm font-medium text-gray-700">API de Validação de Datasets</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Analisa datasets quanto à completude, qualidade dos dados, 
                    distribuição estatística e potenciais problemas.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Endpoint: /api/v1/validation/dataset
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <h5 className="text-sm font-medium text-gray-700">API de Validação de Desempenho</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Avalia o desempenho do modelo em termos de precisão, tempo de resposta 
                    e eficiência computacional.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Endpoint: /api/v1/validation/performance
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <h5 className="text-sm font-medium text-gray-700">API de Validação de Equidade</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Analisa o modelo quanto a vieses e disparidades de tratamento entre 
                    diferentes grupos.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Endpoint: /api/v1/validation/fairness
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <h5 className="text-sm font-medium text-gray-700">API de Geração de Relatórios</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Gera relatórios detalhados de validação com base nos resultados dos 
                    testes e análises realizadas.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Endpoint: /api/v1/validation/report
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-blue-700">
                      Você também pode criar suas próprias APIs de teste ou integrar com serviços externos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'queue' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">Fila de Processamento</h4>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
                  <Play size={16} className="mr-2" />
                  Iniciar Processamento
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Limpar Fila
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefa</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Validação do Modelo NLP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Concluído</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800">Ver Resultados</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Análise de Dataset
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Em Processamento</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:text-red-800">Cancelar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Teste de Desempenho
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Na Fila</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:text-red-800">Remover</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Geração de Relatório
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Na Fila</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:text-red-800">Remover</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Status do Processamento</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">1/4</div>
                  <div className="text-sm text-gray-500">Tarefas Concluídas</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-500">Em Processamento</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-500">Na Fila</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-500">Erros</div>
                </div>
              </div>
              
              <h5 className="text-sm font-medium text-gray-700 mb-2">Progresso Geral</h5>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div className="bg-blue-600 h-4 rounded-full text-xs text-white flex items-center justify-center" style={{ width: '25%' }}>25%</div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      O tempo estimado para conclusão de todas as tarefas é de aproximadamente 35 minutos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Adicionar Nova Tarefa à Fila</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Tarefa</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Validação de Modelo</option>
                    <option>Análise de Dataset</option>
                    <option>Teste de Desempenho</option>
                    <option>Teste de Equidade</option>
                    <option>Geração de Relatório</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Validação de desempenho do modelo XYZ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API a ser utilizada</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>API de Validação de Modelos</option>
                    <option>API de Validação de Datasets</option>
                    <option>API de Validação de Desempenho</option>
                    <option>API de Validação de Equidade</option>
                    <option>API de Geração de Relatórios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parâmetros (formato JSON)</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    rows="4"
                    placeholder='{"model_id": "modelo_123", "dataset_id": "dataset_456"}'
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Baixa</option>
                    <option selected>Normal</option>
                    <option>Alta</option>
                    <option>Urgente</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Adicionar à Fila
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'reports' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">Modelos de Relatório Disponíveis</h4>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                <FileText size={16} className="mr-2" />
                Criar Novo Modelo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-blue-50">
                  <h5 className="font-medium text-gray-800 mb-1">Relatório de Validação Completo</h5>
                  <p className="text-xs text-gray-600">Relatório abrangente com todas as métricas e análises</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="text-gray-800">01/04/2025</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Formato:</span>
                      <span className="text-gray-800">HTML, PDF</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Visualizar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Usar</button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-green-50">
                  <h5 className="font-medium text-gray-800 mb-1">Relatório de Desempenho</h5>
                  <p className="text-xs text-gray-600">Foco em métricas de desempenho e benchmarks</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="text-gray-800">25/03/2025</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Formato:</span>
                      <span className="text-gray-800">HTML, JSON</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Visualizar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Usar</button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-yellow-50">
                  <h5 className="font-medium text-gray-800 mb-1">Relatório de Equidade</h5>
                  <p className="text-xs text-gray-600">Análise de vieses e disparidades no modelo</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="text-gray-800">15/03/2025</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Formato:</span>
                      <span className="text-gray-800">HTML, PDF</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Visualizar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Usar</button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-red-50">
                  <h5 className="font-medium text-gray-800 mb-1">Relatório de Riscos</h5>
                  <p className="text-xs text-gray-600">Identificação de riscos e estratégias de mitigação</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="text-gray-800">20/03/2025</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Formato:</span>
                      <span className="text-gray-800">HTML, DOCX</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Visualizar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Usar</button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-purple-50">
                  <h5 className="font-medium text-gray-800 mb-1">Relatório Executivo</h5>
                  <p className="text-xs text-gray-600">Resumo conciso para apresentação à gestão</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="text-gray-800">28/03/2025</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Formato:</span>
                      <span className="text-gray-800">PPT, PDF</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Visualizar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Usar</button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden border-dashed flex items-center justify-center p-6">
                <button className="text-blue-600 hover:text-blue-800 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <span className="text-sm">Adicionar Novo Modelo</span>
                </button>
              </div>
            </div>
            
            <h4 className="font-semibold text-gray-800 mb-4">Relatórios Gerados</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gerado em</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Validação NLP - Relatório Completo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Relatório de Validação Completo</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">02/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PDF</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Visualizar</button>
                        <button className="text-blue-600 hover:text-blue-800">Download</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Regressão Linear - Relatório de Desempenho
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Relatório de Desempenho</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTML</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Visualizar</button>
                        <button className="text-blue-600 hover:text-blue-800">Download</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Personalizar Modelo de Relatório</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Modelo</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Relatório Personalizado de Validação"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seções</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Resumo Executivo</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Métricas de Desempenho</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Análise de Equidade e Viés</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Avaliação de Robustez</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Análise de Drift</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Riscos e Mitigações</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Recomendações</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formatos de Saída</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">HTML</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">PDF</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">DOCX</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">JSON</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elementos Visuais</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Gráficos</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Tabelas</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" checked />
                    <span className="text-sm">Indicadores</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Comparativos</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template HTML (opcional)</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  rows="5"
                  placeholder='<div class="report-container">
  <h1>{{title}}</h1>
  <div class="summary">{{summary}}</div>
  <!-- Adicione mais elementos de template aqui -->
</div>'
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Use variáveis como {"{{title}}"}, {"{{metrics}}"}, {"{{charts}}"} etc.</p>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Salvar Modelo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineTab;