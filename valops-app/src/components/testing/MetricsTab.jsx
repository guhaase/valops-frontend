// testing/MetricsTab.js
import React from 'react';
import { CheckCircle } from 'lucide-react';

const MetricsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Métricas e KPIs</h3>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p className="mb-3">
          A etapa de Testes gera uma série de métricas e indicadores que são utilizados para
          avaliar a qualidade e desempenho do modelo. Estas métricas são fundamentais para
          a decisão na etapa de Validação.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">Modelos Testados</h4>
          <p className="text-3xl font-bold text-blue-800">724</p>
          <p className="text-sm text-gray-500 mt-1">Total acumulado</p>
          <div className="mt-2 text-xs text-green-600">↑ 12% vs. trimestre anterior</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">Taxa de Aprovação</h4>
          <p className="text-3xl font-bold text-green-700">68%</p>
          <p className="text-sm text-gray-500 mt-1">Na primeira submissão</p>
          <div className="mt-2 text-xs text-green-600">↑ 5% vs. trimestre anterior</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">Tempo Médio</h4>
          <p className="text-3xl font-bold text-yellow-700">3.2 dias</p>
          <p className="text-sm text-gray-500 mt-1">Para conclusão dos testes</p>
          <div className="mt-2 text-xs text-red-600">↑ 0.5 dias vs. trimestre anterior</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">Score Médio</h4>
          <p className="text-3xl font-bold text-blue-800">7.6</p>
          <p className="text-sm text-gray-500 mt-1">Em testes automatizados</p>
          <div className="mt-2 text-xs text-green-600">↑ 0.3 vs. trimestre anterior</div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Composição do Score</h4>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrica</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Qualidade de Código</td>
                <td className="px-6 py-4 text-sm text-gray-500">Avaliação da qualidade e estrutura do código</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.0</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Desempenho do Modelo</td>
                <td className="px-6 py-4 text-sm text-gray-500">Métricas específicas de desempenho do algoritmo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Robustez</td>
                <td className="px-6 py-4 text-sm text-gray-500">Estabilidade e resistência a variações nos dados</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.0</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Documentação</td>
                <td className="px-6 py-4 text-sm text-gray-500">Qualidade e completude da documentação</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Viés e Equidade</td>
                <td className="px-6 py-4 text-sm text-gray-500">Avaliação de vieses e equidade do modelo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Resultado Final da Etapa de Testes</h4>
        <p className="text-sm text-gray-600 mb-3">
          O resultado final da etapa de Testes é um relatório completo que inclui:
        </p>
        <ul className="space-y-2">
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Score geral do modelo (escala de 0 a 10)</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Pontuação em cada métrica avaliada</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Evidências e resultados detalhados de testes</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Recomendações para melhorias (quando aplicável)</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Indicação para validação autônoma ou manual</span>
          </li>
        </ul>
        <p className="text-sm mt-4 italic text-gray-600">
          Este relatório é a base para a decisão na etapa de Validação.
        </p>
      </div>
    </div>
  );
};

export default MetricsTab;