// src/models/supervised/dimensionality-reduction/components/tests/TestsMetrics.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('explained-variance');
  
  // Dados das métricas de avaliação para redução de dimensionalidade
  const metrics = [
    {
      id: 'explained-variance',
      name: 'Variância Explicada',
      formula: 'var(X̂) / var(X)',
      description: 'Mede a proporção da variância nos dados originais que é preservada na representação reduzida. Quanto maior, melhor é a capacidade do modelo de preservar a informação original.',
      strengths: [
        'Intuição clara sobre a informação preservada',
        'Fácil de calcular e interpretar',
        'Métrica padrão para PCA e técnicas lineares',
        'Permite determinar número ideal de componentes',
        'Independente da escala dos dados originais'
      ],
      weaknesses: [
        'Menos relevante para métodos não-lineares',
        'Foco apenas na variância (pode ignorar estruturas importantes)',
        'Não avalia diretamente a utilidade para tarefas posteriores',
        'Pode superestimar a qualidade para dados ruidosos',
        'Assume que as direções de maior variância são as mais informativas'
      ],
      suitable: [
        'Avaliação de PCA e outras técnicas lineares',
        'Quando o objetivo é preservar a variabilidade dos dados',
        'Para determinar o número ideal de componentes',
        'Análise exploratória inicial'
      ],
      unsuitable: [
        'Avaliação de técnicas focadas em preservar estrutura local',
        'Quando a variância não é a característica mais importante',
        'Para dados em manifolds não-lineares complexos',
        'Quando o objetivo é separação de classes (use métricas supervisionadas)'
      ]
    },
    {
      id: 'reconstruction-error',
      name: 'Erro de Reconstrução',
      formula: '||X - g(f(X))||²',
      description: 'Mede a diferença entre os dados originais e sua reconstrução após passar pelo processo de redução e expansão da dimensionalidade (onde possível). Menor erro indica melhor preservação da informação.',
      strengths: [
        'Avaliação direta da fidelidade da representação',
        'Aplicável a métodos com transformação inversa (autoencoders, PCA)',
        'Intuitivo e facilmente interpretável',
        'Detecta perda de informação relevante',
        'Pode ser calculado por amostra para identificar outliers'
      ],
      weaknesses: [
        'Não aplicável a todos os métodos (t-SNE, UMAP não têm transformação inversa direta)',
        'Sensível à escala e pré-processamento dos dados',
        'Pode dar muita importância a ruído nos dados',
        'Não considera a utilidade para tarefas downstream',
        'Foco na reconstrução exata em vez de características relevantes'
      ],
      suitable: [
        'Avaliação de autoencoders e PCA',
        'Quando a reconstrução fiel é um objetivo',
        'Para compressão de dados',
        'Detecção de anomalias baseada em reconstrução'
      ],
      unsuitable: [
        'Métodos sem transformação inversa explícita',
        'Quando o foco é preservar apenas características discriminativas',
        'Para técnicas de visualização pura',
        'Quando a interpretabilidade da representação é mais importante'
      ]
    },
    {
      id: 'distance-correlation',
      name: 'Preservação de Distâncias',
      formula: 'corr(D_X, D_Y)',
      description: 'Avalia a correlação entre as distâncias par a par no espaço original e no espaço reduzido. Valores mais altos indicam melhor preservação da estrutura de distâncias.',
      strengths: [
        'Avalia diretamente a preservação da estrutura dos dados',
        'Aplicável a qualquer método de redução de dimensionalidade',
        'Independente da técnica específica utilizada',
        'Pode avaliar preservação local ou global dependendo da métrica',
        'Intuitiva para interpretação de visualizações'
      ],
      weaknesses: [
        'Computacionalmente intensiva para grandes conjuntos de dados',
        'Sensível à escolha da métrica de distância',
        'Pode dar demasiada importância a outliers',
        'Não distingue entre erros de curto e longo alcance',
        'Não avalia diretamente o impacto em tarefas subsequentes'
      ],
      suitable: [
        'Métodos como t-SNE, UMAP e Isomap',
        'Avaliação de técnicas de visualização',
        'Quando a preservação da estrutura é prioritária',
        'Comparação entre diferentes técnicas',
        'Avaliação de mapas de baixa dimensão'
      ],
      unsuitable: [
        'Quando o objetivo principal é compressão',
        'Para conjuntos de dados muito grandes (limitações computacionais)',
        'Quando a interpretabilidade da representação é mais importante',
        'Quando distâncias não são relevantes para a aplicação'
      ]
    },
    {
      id: 'neighborhood-preservation',
      name: 'Preservação de Vizinhança',
      formula: '(1/n) ∑ |N_k(i) ∩ N_k\'(i)| / k',
      description: 'Mede quão bem as relações de vizinhança são preservadas após a redução. Calcula a proporção de vizinhos que são mantidos próximos no espaço reduzido.',
      strengths: [
        'Foco na preservação das relações locais',
        'Menos sensível a distorções globais',
        'Crucial para métodos como t-SNE e UMAP',
        'Intuitivo para avaliar visualizações',
        'Pode ser ajustado para diferentes escalas de vizinhança'
      ],
      weaknesses: [
        'Dependente da escolha do número k de vizinhos',
        'Computacionalmente intensivo para grandes conjuntos',
        'Não captura relações globais facilmente',
        'Diferentes vizinhanças podem ter importâncias distintas',
        'Pode não ser representativo para dados muito heterogêneos'
      ],
      suitable: [
        'Avaliação de métodos focados em estrutura local (t-SNE, UMAP)',
        'Análise de visualizações de clusters',
        'Quando o foco é preservar relações de similaridade',
        'Para comparar diferentes técnicas de visualização'
      ],
      unsuitable: [
        'Quando a estrutura global é mais importante',
        'Para conjuntos extremamente grandes',
        'Quando o interesse principal é em outliers',
        'Se a aplicação requer alta precisão em distâncias absolutas'
      ]
    },
    {
      id: 'downstream-performance',
      name: 'Performance em Tarefas Posteriores',
      formula: 'Acc(M(X̂)) vs Acc(M(X))',
      description: 'Compara o desempenho de um modelo subsequente (ex: classificador) usando os dados originais versus a representação de dimensão reduzida. Avalia a preservação da informação relevante para a tarefa específica.',
      strengths: [
        'Avalia diretamente o impacto na tarefa final',
        'Foco na informação realmente útil, não apenas estatística',
        'Independente de métricas internas do método',
        'Perspectiva prática e aplicada',
        'Considera o contexto específico da aplicação'
      ],
      weaknesses: [
        'Depende do modelo downstream escolhido',
        'Pode mascarar problemas na representação',
        'Difícil separar efeitos da redução de dimensionalidade vs. modelo',
        'Resultados variam conforme a tarefa específica',
        'Requer implementação e avaliação de modelos adicionais'
      ],
      suitable: [
        'Quando a redução é um passo de pré-processamento',
        'Para redução supervisionada (ex: LDA)',
        'Avaliação final de pipeline completo',
        'Comparação de técnicas para uma aplicação específica'
      ],
      unsuitable: [
        'Avaliação isolada da qualidade da representação',
        'Quando não há uma tarefa downstream bem definida',
        'Para visualização exploratória',
        'Comparações generalizadas entre técnicas'
      ]
    },
    {
      id: 'silhouette',
      name: 'Coeficiente de Silhueta',
      formula: '(b - a) / max(a, b)',
      description: 'Mede a qualidade dos clusters formados no espaço reduzido. Valores próximos a 1 indicam boa separação entre clusters e coesão interna, o que sugere boa preservação da estrutura relevante.',
      strengths: [
        'Avalia estrutura de clusters e separabilidade',
        'Independente do algoritmo de clustering',
        'Combinação de coesão interna e separação externa',
        'Não requer conhecimento do número real de clusters',
        'Pode ser calculada por instância para análise detalhada'
      ],
      weaknesses: [
        'Assume estrutura de clusters nos dados',
        'Depende da escolha do algoritmo e métrica de distância',
        'Pode falhar para clusters de formas não convexas',
        'Sensível a diferentes densidades de clusters',
        'Não é adequada quando não há estrutura de clusters natural'
      ],
      suitable: [
        'Avaliação de técnicas para visualização de clusters',
        'Redução para tarefas de agrupamento',
        'Quando a separação de grupos é o objetivo',
        'Para dados com clusters naturais bem definidos'
      ],
      unsuitable: [
        'Dados sem estrutura de grupos definida',
        'Quando a preservação exata de distâncias é prioritária',
        'Para redução focada em compressão ou reconstrução',
        'Avaliação de técnicas para regressão ou tarefas não relacionadas a clusters'
      ]
    },
    {
      id: 'trustworthiness',
      name: 'Confiabilidade e Continuidade',
      formula: '1 - (2/nk(2n-3k-1)) ∑ (r(i,j) - k) × I(i,j)',
      description: 'Mede se pontos próximos na projeção também são próximos no espaço original (confiabilidade) e vice-versa (continuidade). Detecta falsos vizinhos e estruturas rompidas.',
      strengths: [
        'Detecta distorções importantes na estrutura dos dados',
        'Identifica falsos vizinhos introduzidos pela projeção',
        'Combina duas perspectivas complementares',
        'Focada em distorções perceptíveis em visualizações',
        'Independente da técnica específica utilizada'
      ],
      weaknesses: [
        'Cálculo complexo e computacionalmente intensivo',
        'Dependente da escolha de parâmetros (tamanho da vizinhança)',
        'Menos intuitiva que outras métricas',
        'Pode ser difícil estabelecer limites para boa qualidade',
        'Não considera todas as relações, apenas vizinhanças'
      ],
      suitable: [
        'Avaliação de técnicas de visualização',
        'Detecção de artefatos em projeções',
        'Comparação entre diferentes algoritmos',
        'Quando a preservação topológica é importante'
      ],
      unsuitable: [
        'Quando o foco é apenas reconstrução',
        'Para conjuntos extremamente grandes',
        'Casos onde distorções locais são aceitáveis',
        'Quando métricas mais simples são suficientes'
      ]
    }
  ];

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Métricas Principais de Avaliação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-6">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeMetric === metric.id 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {metric.name}
            </button>
          ))}
        </div>
        
        {/* Detalhes da métrica selecionada */}
        {metrics.map(metric => (
          activeMetric === metric.id && (
            <div key={`details-${metric.id}`} className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h5 className="text-lg font-semibold text-blue-800">{metric.name}</h5>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <code>{metric.formula}</code>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{metric.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                    <CheckCircle size={16} className="text-green-600 mr-2" />
                    Pontos Fortes
                  </h6>
                  <ul className="space-y-1">
                    {metric.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 bg-red-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                    <AlertTriangle size={16} className="text-red-600 mr-2" />
                    Limitações
                  </h6>
                  <ul className="space-y-1">
                    {metric.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-red-500 mr-2 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Quando Usar</h6>
                  <ul className="space-y-1">
                    {metric.suitable.map((item, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <CheckCircle size={14} className="text-blue-600 mr-2 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Quando Evitar</h6>
                  <ul className="space-y-1">
                    {metric.unsuitable.map((item, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-gray-400 mr-2 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h5 className="text-sm font-medium text-yellow-800">Recomendação</h5>
            <p className="text-sm text-yellow-700 mt-1">
              É recomendado utilizar múltiplas métricas para avaliar técnicas de redução de dimensionalidade, 
              pois cada métrica captura diferentes aspectos da qualidade da representação. 
              A escolha das métricas deve ser guiada pelo objetivo específico da redução (visualização, 
              pré-processamento, compressão) e pelas características dos dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;