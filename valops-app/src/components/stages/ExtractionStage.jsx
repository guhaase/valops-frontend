// ExtractionStage.js
import React, { useState } from 'react';
import { ArrowLeft, Info, Database, FileText, Server, Download } from 'lucide-react';

const ExtractionStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Extração de Artefatos</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 3
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
            onClick={() => setActiveTab('storage')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'storage'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Database size={16} className="mr-2" />
              Model Store
            </div>
          </button>
          <button
            onClick={() => setActiveTab('artifacts')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'artifacts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              Tipos de Artefatos
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Extração de Artefatos</h3>
              <p className="mb-4">
                A etapa de Extração de Artefatos envolve a preparação e armazenamento dos artefatos do modelo 
                no Model Store (ambiente S3). Estes artefatos serão utilizados nas etapas de teste e validação.
              </p>
              <p>
                Este processo garante que os modelos de diferentes plataformas (AnalyticsLabb, IBM, Databricks, etc.) 
                possam ser avaliados de forma padronizada e consistente ao longo do fluxo de validação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Entradas</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Modelo catalogado no GAIA</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Código-fonte do modelo</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Dados de treinamento/teste</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Documentação técnica</span>
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
                    <span className="ml-2">Extração dos artefatos da plataforma</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">2</span>
                    </div>
                    <span className="ml-2">Estruturação em formato padronizado</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">3</span>
                    </div>
                    <span className="ml-2">Armazenamento no Model Store (S3)</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">4</span>
                    </div>
                    <span className="ml-2">Indexação pelo ID GAIA</span>
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
                    <span className="ml-2">Artefatos disponíveis no Model Store</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Modelo pronto para testes</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Interface agnóstica para acessos</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Rastreabilidade garantida</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Extração</h4>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
                  <p className="text-sm font-medium">Recebimento do Modelo</p>
                  <p className="text-xs text-gray-500 mt-1">Pós-catalogação GAIA</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
                  <p className="text-sm font-medium">Extração de Artefatos</p>
                  <p className="text-xs text-gray-500 mt-1">Da plataforma de origem</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
                  <p className="text-sm font-medium">Padronização</p>
                  <p className="text-xs text-gray-500 mt-1">Estrutura consistente</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
                  <p className="text-sm font-medium">Armazenamento</p>
                  <p className="text-xs text-gray-500 mt-1">Model Store (S3)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Model Store (S3)</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                O Model Store é o repositório central que armazena todos os artefatos dos modelos,
                utilizando a infraestrutura S3 (Simple Storage Service). Este ambiente garante 
                padronização, segurança e acessibilidade dos artefatos durante todo o processo
                de validação.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Server size={20} className="text-blue-600 mr-2" />
                  Características do Model Store
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Armazenamento:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Estrutura hierárquica por ID GAIA</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Versionamento automático</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Redundância e durabilidade</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Backup automático</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Segurança:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Controle de acesso granular</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Criptografia em repouso e em trânsito</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Auditoria de acessos</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Políticas de retenção</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Download size={20} className="text-blue-600 mr-2" />
                  Acesso aos Artefatos
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Métodos de Acesso:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>API padronizada para todas as ferramentas</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Interface Zagallo para validadores</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Acesso direto para ferramentas de teste</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Integração com o GAIA</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Permissões:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>MAIA - acesso de leitura para testes automatizados</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Validadores - acesso de leitura via Zagallo</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Desenvolvedores - acesso somente na fase de desenvolvimento</span>
                      </li>
                      <li className="text-sm flex">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Administradores - acesso completo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Estrutura de Armazenamento</h4>
              
              <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
                <p className="mb-2">Model Store (S3)</p>
                <p className="ml-4 mb-1">├── GAIA-MOD-2025-0042/</p>
                <p className="ml-8 mb-1">├── v1.0.0/</p>
                <p className="ml-12 mb-1">├── código/</p>
                <p className="ml-16 mb-1">├── model.py</p>
                <p className="ml-16 mb-1">├── utils.py</p>
                <p className="ml-16 mb-1">└── requirements.txt</p>
                <p className="ml-12 mb-1">├── dados/</p>
                <p className="ml-16 mb-1">├── training_data.csv</p>
                <p className="ml-16 mb-1">└── test_data.csv</p>
                <p className="ml-12 mb-1">├── modelo/</p>
                <p className="ml-16 mb-1">└── model.pkl</p>
                <p className="ml-12 mb-1">└── docs/</p>
                <p className="ml-16 mb-1">├── technical_doc.md</p>
                <p className="ml-16 mb-1">└── metrics.json</p>
                <p className="ml-8 mb-1">└── metadata.json</p>
                <p className="ml-4 mb-1">└── ...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Tipos de Artefatos</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                Os artefatos armazenados no Model Store incluem todos os elementos necessários para
                testar, validar e implementar o modelo. A padronização destes artefatos garante que
                modelos de diferentes plataformas possam ser processados de forma consistente.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artefatos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formatos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatório</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Código-fonte</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Scripts principais</li>
                        <li>Funções auxiliares</li>
                        <li>Dependências</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Python, R, SQL</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dados</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Dados de treinamento</li>
                        <li>Dados de teste</li>
                        <li>Dados de validação</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">CSV, Parquet, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Modelo</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Modelo serializado</li>
                        <li>Parâmetros</li>
                        <li>Hiperparâmetros</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">PKL, H5, ONNX</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Documentação</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Documentação técnica</li>
                        <li>Métricas de desempenho</li>
                        <li>Relatórios de análise</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">MD, PDF, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Metadados</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Informações de versão</li>
                        <li>Histórico de alterações</li>
                        <li>Tags e categorizações</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">JSON, YAML</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Notebooks</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        <li>Notebooks exploratórios</li>
                        <li>Análises de desenvolvimento</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">IPYNB, HTML</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Recomendado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Padronização de Artefatos</h4>
                <p className="text-sm text-gray-600 mb-3">
                  A padronização dos artefatos garante:
                </p>
                <ul className="space-y-2">
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Consistência entre diferentes plataformas</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Facilidade de acesso para validação</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Interface única para ferramentas de teste</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Rastreabilidade durante todo o ciclo de vida</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3">Interface Agnóstica</h4>
                <p className="text-sm text-gray-600 mb-3">
                  A interface agnóstica para acesso aos artefatos proporciona:
                </p>
                <ul className="space-y-2">
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Independência de plataforma de origem</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Acesso padronizado para ferramentas de teste</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Adaptadores para diferentes formatos</span>
                  </li>
                  <li className="text-sm flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <span className="ml-2">Evolução contínua para novas plataformas</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">Conclusão da Etapa de Extração</h4>
              <p className="text-sm text-gray-600 mb-3">
                Esta etapa é concluída quando:
              </p>
              <ul className="space-y-2">
                <li className="text-sm flex">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span className="ml-2">Todos os artefatos obrigatórios foram extraídos com sucesso</span>
                </li>
                <li className="text-sm flex">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span className="ml-2">Os artefatos estão armazenados no Model Store (S3)</span>
                </li>
                <li className="text-sm flex">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span className="ml-2">A verificação de integridade foi bem-sucedida</span>
                </li>
                <li className="text-sm flex">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span className="ml-2">O modelo está pronto para a etapa de Testes</span>
                </li>
              </ul>
              <p className="text-sm mt-3 italic text-gray-600">
                Após a conclusão desta etapa, o modelo está preparado para ser submetido aos testes
                automáticos (MAIA) e manuais na próxima fase do fluxo de validação.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractionStage;