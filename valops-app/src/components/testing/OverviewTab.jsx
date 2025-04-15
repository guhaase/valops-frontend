// testing/OverviewTab.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OverviewTab = () => {
  // Dados simulados para os gráficos
  const testDistributionData = [
    { name: 'Testes Automatizados', value: 72, color: '#3498db' },
    { name: 'Testes Manuais', value: 28, color: '#e74c3c' }
  ];

  const automatedToolsData = [
    { name: 'MAIA', value: 85, color: '#1abc9c' },
    { name: 'Thaffarel', value: 15, color: '#9b59b6' }
  ];

  return (
    <div>
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Testes</h3>
        <p className="mb-4">
          Na etapa de Testes, o modelo e seus artefatos são submetidos a uma bateria de avaliações
          para verificar sua qualidade, robustez e conformidade com os requisitos técnicos e negociais.
          Esta etapa combina testes automatizados (via MAIA) e manuais (Chiron e AnalyticsLabb).
        </p>
        <p>
          Os artefatos são resgatados do Model Store (S3) e servem como insumo para os testes.
          Os resultados são armazenados em banco de dados e disponibilizados via API para o GAIA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">Distribuição de Testes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={testDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {testDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">Ferramentas Automatizadas</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={automatedToolsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {automatedToolsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Testes</h4>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
            <p className="text-sm font-medium">Extração de Artefatos</p>
            <p className="text-xs text-gray-500 mt-1">Model Store (S3)</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
            <p className="text-sm font-medium">Execução de Testes</p>
            <p className="text-xs text-gray-500 mt-1">Automatizados e Manuais</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
            <p className="text-sm font-medium">Análise de Resultados</p>
            <p className="text-xs text-gray-500 mt-1">Registro no Banco de Dados</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
            <p className="text-sm font-medium">Disponibilização</p>
            <p className="text-xs text-gray-500 mt-1">API para GAIA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;