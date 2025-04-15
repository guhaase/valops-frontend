// testing/AutomatedTestsTab.js
import React from 'react';
import { Info, Code } from 'lucide-react';

const AutomatedTestsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Testes Automatizados</h3>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p className="mb-3">
          Os testes automatizados são executados primariamente pelo MAIA (principal ferramenta) e complementados
          pelo Thaffarel. Estes testes resgatam os artefatos do Model Store, aplicam uma série de verificações
          pré-definidas e geram relatórios detalhados que são salvos no banco de dados.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Code size={20} className="text-blue-600 mr-2" />
            MAIA (Ferramenta Principal)
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Testes Executados:</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Verificação de completude dos artefatos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Validação de dados de entrada/saída</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Análise estatística dos resultados</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Verificação de robustez e estabilidade</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Análise de vieses algorítmicos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Processo:</p>
              <ol className="mt-2 space-y-1">
                <li className="text-sm flex">
                  <span className="text-blue-500 mr-2">1.</span>
                  <span>Acesso ao S3 para resgate dos artefatos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-blue-500 mr-2">2.</span>
                  <span>Aplicação dos testes pré-definidos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-blue-500 mr-2">3.</span>
                  <span>Geração de métricas e resultados</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-blue-500 mr-2">4.</span>
                  <span>Registro no banco de dados do MAIA</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-blue-500 mr-2">5.</span>
                  <span>Disponibilização via API para o GAIA</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Code size={20} className="text-blue-600 mr-2" />
            Thaffarel (Complementar)
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Testes Executados:</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Testes específicos de domínio</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Análises complementares de desempenho</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Verificação de conformidade com regras de negócio</span>
                </li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Processo:</p>
              <p className="text-sm text-gray-600 mt-2">
                O Thaffarel complementa os testes do MAIA com verificações específicas para
                determinados tipos de modelos ou domínios de negócio. Os resultados são 
                integrados ao relatório final de testes.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Parametrização de Testes</h4>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Importante:</strong> A DICOI pode parametrizar os testes (inclusão, exclusão, definição de threshold)
                e a validação autônoma (rol de testes para compor a nota) via interface dedicada.
              </p>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parâmetro</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Definido por</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Inclusão de Testes</td>
                <td className="px-6 py-4 text-sm text-gray-500">Definição de quais testes serão aplicados ao modelo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DICOI</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Threshold</td>
                <td className="px-6 py-4 text-sm text-gray-500">Valores mínimos aceitáveis para cada métrica</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DICOI</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pesos das Métricas</td>
                <td className="px-6 py-4 text-sm text-gray-500">Relevância de cada métrica na composição do score final</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DICOI</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Critérios de Aprovação</td>
                <td className="px-6 py-4 text-sm text-gray-500">Regras para aprovação automática (ex: score > 7.0)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DICOI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Armazenamento de Resultados</h4>
        <p className="text-sm text-gray-600">
          Todos os resultados dos testes automatizados são registrados no banco de dados e disponibilizados 
          via API para integração com o GAIA. Estes resultados ficam visíveis apenas para a DICOI até a 
          conclusão da etapa de validação, quando são liberados para visualização pelo desenvolvedor e gestor.
        </p>
      </div>
    </div>
  );
};

export default AutomatedTestsTab;