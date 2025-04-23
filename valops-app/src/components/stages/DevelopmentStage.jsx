// DevelopmentStage.js
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Info, FileText, Database, Code, CheckCircle } from 'lucide-react';

const DevelopmentStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dados simulados para o gráfico de plataformas
  const platformData = [
    { name: 'AnalyticsLabb', modelos: 87, fill: '#8884d8' },
    { name: 'H2O', modelos: 45, fill: '#83a6ed' },
    { name: 'IBM AI', modelos: 73, fill: '#8dd1e1' },
    { name: 'Databricks', modelos: 63, fill: '#82ca9d' },
    { name: 'Outras', modelos: 12, fill: '#ffc658' }
  ];

  // Dados simulados para o gráfico de status
  const statusData = [
    { name: 'Em Desenvolvimento', value: 42, fill: '#ff8042' },
    { name: 'Pendente Revisão', value: 18, fill: '#ffbb28' },
    { name: 'Prontos para Catalogação', value: 25, fill: '#00C49F' }
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Desenvolvimento</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 1
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
            onClick={() => setActiveTab('metrics')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BarChart size={16} className="mr-2" />
              Métricas
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
              <Database size={16} className="mr-2" />
              Artefatos
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`pb-4 px-1 font-medium text-sm ${
              activeTab === 'documentation'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              Documentação
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Desenvolvimento</h3>
              <p className="mb-4">
                A etapa de Desenvolvimento é o ponto inicial do ciclo de vida de modelos no ValOps. Durante este estágio,
                os cientistas e engenheiros de dados criam os modelos de IA em diferentes plataformas tecnológicas suportadas.
              </p>
              <p className="mb-4">
                Nesta fase é gerado o número único do GAIA e a versão inicial do modelo que percorrerá as próximas etapas
                até a implementação. Todos os artefatos são salvos no Model Store (ambiente S3) para controle e rastreabilidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Plataformas Suportadas</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> AnalyticsLabb e H2O
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Plataforma de IA - IBM
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Databricks
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Futuras plataformas
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Artefatos Gerados</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> ID do GAIA
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Código-fonte do modelo
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Documentação técnica inicial
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Dados de treinamento e teste
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Conclusão da Etapa</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Fechamento da versão do modelo
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Armazenamento no Model Store
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Encaminhamento para Catalogação
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" /> Verificação de completude
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Métricas da Etapa de Desenvolvimento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Modelos em Desenvolvimento por Plataforma</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={platformData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="modelos" name="Quantidade de Modelos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Status dos Modelos em Desenvolvimento</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Total de Modelos</h4>
                <p className="text-3xl font-bold text-blue-800">280</p>
                <p className="text-sm text-gray-500 mt-1">Em todas as plataformas</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Tempo Médio</h4>
                <p className="text-3xl font-bold text-green-700">14.2 dias</p>
                <p className="text-sm text-gray-500 mt-1">Para desenvolvimento</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Taxa de Aprovação</h4>
                <p className="text-3xl font-bold text-yellow-700">78%</p>
                <p className="text-sm text-gray-500 mt-1">Na primeira submissão</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Desenvolvidos este mês</h4>
                <p className="text-3xl font-bold text-purple-700">32</p>
                <p className="text-sm text-gray-500 mt-1">+12% vs. mês anterior</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Gerenciamento de Artefatos</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Todos os artefatos gerados nesta etapa são salvos no <strong>Model Store (S3)</strong> e indexados 
                    pelo ID GAIA para garantir rastreabilidade e versionamento completo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artefato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatório</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Código-fonte</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Implementação do modelo em linguagem de programação</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Python, R, SQL</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dados de Treinamento</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Conjunto de dados utilizados para treinar o modelo</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CSV, Parquet, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dados de Teste</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Conjunto de dados utilizados para testar o modelo</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CSV, Parquet, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Modelo Serializado</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Versão serializada do modelo treinado</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PKL, H5, ONNX</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Notebook</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Notebook com análises exploratórias e desenvolvimento</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IPYNB, HTML</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Recomendado</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Metadados</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Informações sobre parâmetros e hiperparâmetros</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JSON, YAML</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documentation' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Documentação Técnica</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Requisitos de Documentação</h4>
              <p className="mb-3">
                Nesta etapa de desenvolvimento é gerada a documentação técnica inicial do modelo, que será complementada
                nas etapas subsequentes. A documentação é essencial para garantir rastreabilidade, compreensão e manutenção
                do modelo ao longo de seu ciclo de vida.
              </p>
              <p>
                O número GAIA e a versão do modelo são gerados automaticamente nesta fase e serão utilizados como identificadores
                únicos em todo o processo de validação e implementação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Documentação Técnica Necessária</h4>
                <ul className="space-y-3">
                  <li className="flex">
                    <Code className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold text-sm">Descrição do Modelo</p>
                      <p className="text-sm text-gray-600">Visão geral da abordagem, algoritmos e técnicas utilizadas</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Code className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold text-sm">Especificação de Dados</p>
                      <p className="text-sm text-gray-600">Detalhes sobre as fontes de dados, schemas e transformações</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Code className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold text-sm">Parâmetros e Hiperparâmetros</p>
                      <p className="text-sm text-gray-600">Configurações utilizadas no treinamento do modelo</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Code className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold text-sm">Métricas de Desempenho</p>
                      <p className="text-sm text-gray-600">Resultados iniciais de avaliação do modelo</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Code className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold text-sm">Dependências</p>
                      <p className="text-sm text-gray-600">Bibliotecas, versões e requisitos de infraestrutura</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Identificação GAIA</h4>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Exemplo de ID GAIA gerado:</p>
                  <p className="font-mono text-lg font-semibold text-blue-700">GAIA-MOD-2025-0042</p>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">
                  O ID GAIA segue o formato padrão que inclui:
                </p>
                
                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold">GAIA-MOD:</span> Prefixo padrão para modelos</li>
                  <li><span className="font-semibold">YYYY:</span> Ano de criação do modelo</li>
                  <li><span className="font-semibold">NNNN:</span> Número sequencial</li>
                </ul>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Versão do modelo:
                  </p>
                  <p className="font-mono text-lg font-semibold text-green-700">v1.0.0</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Seguindo o formato semântico: [major].[minor].[patch]
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-4">Conclusão da Etapa de Desenvolvimento</h4>
              
              <div className="border-l-4 border-green-500 pl-4 py-2 mb-4">
                <p className="text-gray-700">
                  O processo de desenvolvimento é concluído quando:
                </p>
              </div>
              
              <ol className="space-y-3 mb-4">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">1</div>
                  <div className="text-gray-700">
                    <p>Todos os artefatos obrigatórios são gerados e validados</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">2</div>
                  <div className="text-gray-700">
                    <p>A documentação técnica inicial é finalizada</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">3</div>
                  <div className="text-gray-700">
                    <p>A versão do modelo é fechada (versão 1.0.0)</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">4</div>
                  <div className="text-gray-700">
                    <p>Os artefatos são salvos no Model Store (S3)</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mr-3">5</div>
                  <div className="text-gray-700">
                    <p>O modelo é encaminhado para a etapa de Catalogação GAIA</p>
                  </div>
                </li>
              </ol>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Próximos passos:</span> Após a conclusão desta etapa, o Gestor responsável pelo modelo 
                  realizará a catalogação oficial no GAIA, incluindo as definições negociais e requisitos específicos do negócio.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevelopmentStage;