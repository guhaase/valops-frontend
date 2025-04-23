// testing/OverviewTab.js
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import WordCloud from 'react-d3-cloud';
import trainingService from '../../services/trainingService';

// Word cloud constants
const MAX_FONT_SIZE = 40;
const MIN_FONT_SIZE = 14;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 100;

// Componente tooltip personalizado para a nuvem de palavras
const WordCloudTooltip = ({ visible, text, value, x, y }) => {
  if (!visible) return null;
  
  return (
    <div 
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'normal',
        zIndex: 1000,
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      <strong>{text}:</strong> {value}
      <div 
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid rgba(0, 0, 0, 0.8)'
        }}
      />
    </div>
  );
};

const OverviewTab = () => {
  // Estado para armazenar os dados do tag cloud
  const [tagCloudData, setTagCloudData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para controlar o tooltip
  const [tooltip, setTooltip] = useState({ 
    visible: false,
    text: '',
    value: 0,
    x: 0,
    y: 0
  });
  
  // Referência para o container da nuvem de palavras
  const cloudContainerRef = useRef(null);

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
        
        // Transformar os dados para o formato esperado pelo WordCloud
        const words = tags.map(tag => ({
          text: tag.name,
          value: tag.count
        }));
        
        setTagCloudData(words);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados da nuvem de tags:', err);
        setError('Não foi possível carregar os dados da nuvem de tags.');
        
        // Dados de fallback para quando a API falha
        const fallbackData = [
          { text: 'Robustez', value: 64 },
          { text: 'Testes', value: 58 },
          { text: 'Validação', value: 52 },
          { text: 'Machine Learning', value: 48 },
          { text: 'API', value: 44 },
          { text: 'Modelos', value: 40 },
          { text: 'Python', value: 36 },
          { text: 'Classificação', value: 32 },
          { text: 'Regressão', value: 28 },
          { text: 'Notebooks', value: 24 },
          { text: 'Documentação', value: 22 },
          { text: 'Treinamento', value: 20 },
          { text: 'Dados', value: 18 },
          { text: 'Pipeline', value: 16 },
          { text: 'Framework', value: 14 }
        ];
        
        setTagCloudData(fallbackData);
        setLoading(false);
      }
    };
    
    fetchTagCloudData();
  }, []);
  
  // Preparar os dados para a nuvem de palavras
  const sortedWords = useMemo(
    () => tagCloudData.sort((a, b) => b.value - a.value).slice(0, MAX_WORDS),
    [tagCloudData]
  );

  // Calcular os valores mínimos e máximos para normalização
  const [minOccurences, maxOccurences] = useMemo(() => {
    if (sortedWords.length === 0) return [0, 1]; // Prevenir divisão por zero
    const min = Math.min(...sortedWords.map((w) => w.value));
    const max = Math.max(...sortedWords.map((w) => w.value));
    return [min, max];
  }, [sortedWords]);

  // Função para calcular o tamanho da fonte baseado na ocorrência da palavra
  const calculateFontSize = useCallback(
    (wordOccurrences) => {
      // Lidar com caso onde min é igual a max
      if (minOccurences === maxOccurences) return MAX_FONT_SIZE;
      
      const normalizedValue =
        (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
      const fontSize =
        MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
      return Math.round(fontSize);
    },
    [maxOccurences, minOccurences]
  );

  // Função para calcular o peso da fonte baseado na ocorrência da palavra
  const calculateFontWeight = useCallback(
    (wordOccurrences) => {
      // Lidar com caso onde min é igual a max
      if (minOccurences === maxOccurences) return MAX_FONT_WEIGHT;
      
      const normalizedValue =
        (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
      const fontWeight =
        MIN_FONT_WEIGHT +
        normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
      return Math.round(fontWeight);
    },
    [maxOccurences, minOccurences]
  );
  
  // Manipuladores para interação com a nuvem de palavras
  const handleWordMouseOver = useCallback((event, word) => {
    if (!cloudContainerRef.current) return;
    
    const containerRect = cloudContainerRef.current.getBoundingClientRect();
    const targetRect = event.target.getBoundingClientRect();
    
    // Calcular posição relativa ao container
    const x = targetRect.left + (targetRect.width / 2) - containerRect.left;
    const y = targetRect.top - containerRect.top;
    
    setTooltip({
      visible: true,
      text: word.text,
      value: word.value,
      x,
      y
    });
  }, []);
  
  const handleWordMouseOut = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);
  
  // Callback quando o componente WordCloud termina de renderizar
  const onWordCloudRendered = useCallback(() => {
    if (!cloudContainerRef.current) return;
    
    // Selecionar todos os textos SVG dentro da nuvem de palavras
    const wordElements = cloudContainerRef.current.querySelectorAll('text');
    
    // Adicionar eventos de mouse a cada palavra
    wordElements.forEach(el => {
      // Extrair o texto da palavra
      const text = el.textContent;
      
      // Encontrar o objeto de dados correspondente
      const wordData = sortedWords.find(w => w.text === text);
      
      if (wordData) {
        // Remover event listeners antigos para evitar duplicação
        el.removeEventListener('mouseover', handleWordMouseOver);
        el.removeEventListener('mouseout', handleWordMouseOut);
        
        // Adicionar novos event listeners
        el.addEventListener('mouseover', (e) => handleWordMouseOver(e, wordData));
        el.addEventListener('mouseout', handleWordMouseOut);
        
        // Alterar o estilo do cursor para indicar interatividade
        el.style.cursor = 'pointer';
      }
    });
  }, [handleWordMouseOver, handleWordMouseOut, sortedWords]);
  
  // Efeito para adicionar eventos após renderização do WordCloud
  useEffect(() => {
    if (!loading && sortedWords.length > 0) {
      // Adicionar um pequeno atraso para garantir que o componente foi renderizado
      const timer = setTimeout(() => {
        onWordCloudRendered();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, sortedWords, onWordCloudRendered]);

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
          ) : sortedWords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Nenhuma tag encontrada</div>
          ) : (
            <div className="h-72 relative" ref={cloudContainerRef}>
              {/* WordCloud component usando react-d3-cloud */}
              <WordCloud
                width={800}
                height={270}
                font="Poppins" // Alterado de "impact" para um visual mais moderno
                fontWeight={(word) => calculateFontWeight(word.value)}
                data={sortedWords}
                rotate={0}
                padding={1}
                fontSize={(word) => calculateFontSize(word.value)}
                random={() => 0.5}
              />
              
              {/* Tooltip personalizado */}
              <WordCloudTooltip {...tooltip} />
              
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