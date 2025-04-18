// testing/OverviewTab.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ReactWordcloud from 'react-wordcloud';
import trainingService from '../../services/trainingService';

// Word cloud options
const wordcloudOptions = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [14, 42],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};

const OverviewTab = () => {
  // Estado para armazenar os dados do tag cloud
  const [tagCloudData, setTagCloudData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dados simulados para os gráficos
  const testDistributionData = [
    { name: 'Testes Automatizados', value: 72, color: '#3498db' },
    { name: 'Testes Manuais', value: 28, color: '#e74c3c' }
  ];

  const automatedToolsData = [
    { name: 'MAIA', value: 85, color: '#1abc9c' },
    { name: 'Thaffarel', value: 15, color: '#9b59b6' }
  ];
  
  // Buscar dados da nuvem de tags quando o componente for montado
  useEffect(() => {
    const fetchTagCloudData = async () => {
      try {
        setLoading(true);
        const response = await trainingService.getTagCloudData();
        const tags = response.tags || [];
        
        // Transformar os dados para o formato esperado pelo ReactWordcloud
        const words = tags.map(tag => ({
          text: tag.name,
          value: tag.count
        }));
        
        setTagCloudData(words);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados da nuvem de tags:', err);
        setError('Não foi possível carregar os dados da nuvem de tags.');
        setLoading(false);
      }
    };
    
    fetchTagCloudData();
  }, []);

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

      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">Tags mais utilizadas em Materiais, Artigos e Notebooks</h4>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : tagCloudData.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Nenhuma tag encontrada</div>
          ) : (
            <div className="h-72 relative">
              {/* ReactWordcloud component */}
              <ReactWordcloud 
                options={wordcloudOptions}
                words={tagCloudData}
              />
              <div className="text-xs text-gray-500 text-center mt-2">
                Tamanho da tag representa a frequência de uso
              </div>
            </div>
          )}
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