// testing/InventoryTab.js
import React, { useState } from 'react'; 
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import ClassificationModels from '../../models/supervised/classification/ClassificationModels';
import RegressionModels from '../../models/supervised/regression/RegressionModels';
import TimeSeriesModels from '../../models/time-series/TimeSeriesModels';
import ClusteringModels from '../../models/unsupervised/clustering/ClusteringModels';
import DimensionalityReductionModels from '../../models/unsupervised/dimensionality-reduction/DimensionalityReductionModels';
import ComputerVisionModels from '../../models/computer-vision/ComputerVisionModels';

// This was the issue - ComputerVisionModels was being referenced without being used

const InventoryTab = () => {
  // Estado para controlar quais categorias estão expandidas
  const [expandedCategories, setExpandedCategories] = useState({
    '1': true,   
    '1.1': true, 
    '1.2': false,
    '2': false,
    '2.1': false,
    '2.2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false
  });

  // Função para alternar a expansão de uma categoria
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Estrutura de dados para o inventário de testes
  const testInventory = [
    {
      id: '1',
      title: 'Modelos Supervisionados',
      subcategories: [
        {
          id: '1.1',
          title: 'Classificação',
          component: <ClassificationModels />,
          models: [] 
        },
        {
          id: '1.2',
          title: 'Regressão',
          component: <RegressionModels />,
          models: [] 
          
        }
      ]
    },
    {
      id: '2',
      title: 'Modelos Não Supervisionados',
      subcategories: [
        {
          id: '2.1',
          title: 'Clusterização',
          component: <ClusteringModels />,
          models: [] 
        },
        {
          id: '2.2',
          title: 'Redução de Dimensionalidade',
          component: <DimensionalityReductionModels />,
          models: [] 
        }
      ]
    },
    {
      id: '3',
      title: 'Modelos para Séries Temporais',
      subcategories: [
        {
          id: '3.1',
          title: 'Séries Temporais',
          component: <TimeSeriesModels />,
          models: []
        }
      ]
    },
    {
      id: '4',
      title: 'Modelos de IA para Visão Computacional',
      subcategories: [
        {
          id: '4.1',
          title: 'Visão Computacional',
          component: <ComputerVisionModels />,
          models: []
        }
      ]
    },
    {
      id: '5',
      title: 'Modelos de IA para Processamento de Linguagem Natural (NLP)',
      subcategories: [],
      models: [
        { id: '5.1', name: 'Análise de Sentimento', tests: ['Acurácia', 'F1-Score', 'Testes de Robustez a Variações Linguísticas'] },
        { id: '5.2', name: 'Geração de Texto', tests: ['BLEU Score', 'ROUGE Score', 'Perplexidade', 'Avaliação Humana', 'Testes de Diversidade'] },
        { id: '5.3', name: 'Modelos de Embeddings', tests: ['Tarefas de Analogia', 'Word Similarity', 'Análise de Vizinhança', 'Visualização de PCA/t-SNE'] },
        { id: '5.4', name: 'Resumo de Texto', tests: ['ROUGE Score', 'Avaliação Humana', 'Análise de Retenção de Informação Chave'] }
      ]
    },
    {
      id: '6',
      title: 'Modelos de Recomendação',
      subcategories: [],
      models: [
        { id: '6.1', name: 'Baseados em Filtragem Colaborativa', tests: ['RMSE', 'MAE', 'Recall@K', 'Precision@K', 'NDCG', 'MAP'] },
        { id: '6.2', name: 'Baseados em Conteúdo', tests: ['Precision@K', 'Recall@K', 'Diversity', 'Coverage', 'Análise de Similaridade'] },
        { id: '6.3', name: 'Híbridos', tests: ['RMSE', 'MAE', 'Recall@K', 'Diversity', 'Serendipity', 'Testes AB'] }
      ]
    },
    {
      id: '7',
      title: 'Modelos Causais e Econométricos',
      subcategories: [],
      models: [
        { id: '7.1', name: 'Modelos de Regressão com Variáveis Instrumentais', tests: ['Teste de Endogeneidade', 'Teste de Hausman', 'Avaliação de Instrumentos'] },
        { id: '7.2', name: 'Métodos de Painel com Efeitos Fixos e Aleatórios', tests: ['Teste de Hausman', 'Teste de Efeitos Fixos vs Pooled', 'R² Between/Within'] },
        { id: '7.3', name: 'Séries Temporais Econométricas', tests: ['Testes de Causalidade de Granger', 'Testes de Cointegração', 'Análise de Impulso-Resposta'] },
        { id: '7.4', name: 'Diferença-em-Diferenças', tests: ['Verificação de Tendências Paralelas', 'Testes de Placebo', 'Análise de Sensibilidade'] }
      ]
    },
    {
      id: '8',
      title: 'Modelos de Aprendizado por Reforço',
      subcategories: [],
      models: [
        { id: '8.1', name: 'Q-Learning', tests: ['Recompensa Média', 'Taxa de Convergência', 'Tempo até Solução Ótima'] },
        { id: '8.2', name: 'Deep Q-Network (DQN)', tests: ['Curva de Aprendizado', 'Robustez a Variações no Ambiente', 'Análise de Estabilidade'] },
        { id: '8.3', name: 'Aprendizado Baseado em Políticas', tests: ['Recompensa Acumulada', 'Entropia da Política', 'Análise de Trade-off Exploração/Explotação'] }
      ]
    }
  ];

  // Renderização de um modelo com seus testes
  const renderModel = (model) => {
    return (
      <div key={model.id} className="mb-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h6 className="font-medium text-gray-800 mb-2">{model.name}</h6>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-700 mb-1">Testes aplicáveis:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {model.tests.map((test, index) => (
              <li key={index} className="text-sm flex items-center">
                <span className="text-green-500 mr-2">•</span>
                <span>{test}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Renderização de uma subcategoria com componente específico ou modelos
  const renderSubcategory = (subcategory) => {
    const isExpanded = expandedCategories[subcategory.id];
    
    return (
      <div key={subcategory.id} className="mb-3">
        <div 
          className="flex items-center p-2 bg-blue-50 rounded-lg cursor-pointer"
          onClick={() => toggleCategory(subcategory.id)}
        >
          {isExpanded ? 
            <ChevronDown size={16} className="text-blue-600 mr-2" /> : 
            <ChevronRight size={16} className="text-blue-600 mr-2" />
          }
          <h5 className="font-medium text-blue-700">{subcategory.title}</h5>
        </div>
        
        {isExpanded && (
          <div className="ml-6 mt-2">
            {subcategory.component ? 
              // Renderiza componente específico se existir
              subcategory.component : 
              // Caso contrário, renderiza lista de modelos
              subcategory.models.map(model => renderModel(model))
            }
          </div>
        )}
      </div>
    );
  };

  // Renderização de uma categoria com subcategorias
  const renderCategory = (category) => {
    const isExpanded = expandedCategories[category.id];
    
    return (
      <div key={category.id} className="mb-4">
        <div 
          className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer"
          onClick={() => toggleCategory(category.id)}
        >
          {isExpanded ? 
            <ChevronDown size={20} className="text-blue-600 mr-2" /> : 
            <ChevronRight size={20} className="text-blue-600 mr-2" />
          }
          <h4 className="font-semibold text-blue-800">{category.id}. {category.title}</h4>
        </div>
        
        {isExpanded && (
          <div className="ml-6 mt-2">
            {category.subcategories && category.subcategories.length > 0 ? (
              // Renderizar subcategorias se existirem
              category.subcategories.map(subcategory => renderSubcategory(subcategory))
            ) : (
              // Renderizar modelos diretamente se não houver subcategorias
              category.models && category.models.map(model => renderModel(model))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Inventário de Testes</h3>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="mb-3">
              Este inventário apresenta os diferentes tipos de modelos e os testes específicos 
              aplicados a cada um durante o processo de validação. Os testes são escolhidos 
              de acordo com a natureza e objetivo de cada tipo de modelo para garantir uma 
              avaliação adequada de seu desempenho, robustez e conformidade.
            </p>
            <p>
              Clique em cada categoria para expandir e ver os tipos de modelos e testes aplicáveis.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        {testInventory.map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default InventoryTab;