// src/models/supervised/clustering/components/tests/TestsMetrics.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('silhouette');
  
  // Dados das métricas de clustering
  const metrics = [
    {
      id: 'silhouette',
      name: 'Coeficiente Silhouette',
      formula: '(b - a) / max(a, b)',
      description: 'Mede o quão similar um objeto é ao seu próprio cluster (coesão) em comparação com outros clusters (separação). Varia de -1 a 1, onde valores próximos a 1 indicam boa separação e coesão.',
      strengths: [
        'Avalia simultaneamente coesão e separação',
        'Interpretável (valores entre -1 e 1)',
        'Disponível para qualquer métrica de distância',
        'Pode ser aplicado a qualquer algoritmo de clustering',
        'Permite visualização por cluster e por ponto'
      ],
      weaknesses: [
        'Tende a favorecer clusters convexos e bem separados',
        'Computacionalmente intensivo para grandes conjuntos de dados',
        'Sensível a diferenças de densidade e escala',
        'Menos preciso para clusters não esféricos',
        'Valor médio pode esconder problemas em clusters específicos'
      ],
      suitable: [
        'Avaliação geral da qualidade do clustering',
        'Comparação entre diferentes números de clusters',
        'Identificação de clusters problemáticos',
        'Validação de resultados de K-Means e algoritmos similares',
        'Análise visual da estrutura dos clusters'
      ],
      unsuitable: [
        'Conjuntos de dados com clusters de formas complexas',
        'Clusters com densidades muito diferentes',
        'Análises que exigem eficiência computacional extrema',
        'Quando a interpretação do desempenho absoluto é crítica'
      ]
    },
    {
      id: 'davies-bouldin',
      name: 'Índice Davies-Bouldin',
      formula: '1/n ∑ max(i≠j) ((σi + σj) / d(ci, cj))',
      description: 'Mede a razão entre a dispersão dentro dos clusters e a separação entre eles. Valores mais baixos indicam clusters mais compactos e bem separados.',
      strengths: [
        'Não favorece um número específico de clusters',
        'Computacionalmente menos exigente que Silhouette',
        'Considera apenas distâncias entre centroides',
        'Facilmente interpretável (valores menores são melhores)',
        'Bom para comparação relativa entre modelos'
      ],
      weaknesses: [
        'Assume clusters convexos e isótropos',
        'Sensível a outliers',
        'Pode não identificar corretamente clusters sobrepostos',
        'Baseado apenas na dispersão média, sem considerar a distribuição',
        'Favorece clusters de tamanho e densidade similares'
      ],
      suitable: [
        'Avaliação rápida de modelos de clustering',
        'Comparação entre diferentes números de clusters',
        'Algoritmos baseados em centróides, como K-Means',
        'Validação de clusters quando há restrição de tempo computacional',
        'Análise preliminar antes de métricas mais intensivas'
      ],
      unsuitable: [
        'Clusters de formas muito irregulares',
        'Dados com outliers significativos',
        'Quando clusters de tamanhos muito diferentes são esperados',
        'Validação final de resultados críticos (usar em conjunto com outras métricas)'
      ]
    },
    {
      id: 'calinski-harabasz',
      name: 'Índice Calinski-Harabasz',
      formula: '[tr(B_k)/(k-1)]/[tr(W_k)/(n-k)]',
      description: 'Também conhecido como Critério da Razão de Variância (VRC), mede a razão entre a dispersão entre clusters e a dispersão dentro dos clusters. Valores maiores indicam clusters mais densos e bem separados.',
      strengths: [
        'Computacionalmente eficiente',
        'Funciona bem para clusters globulares',
        'Valores interpretáveis (maiores valores são melhores)',
        'Eficaz para identificar o número de clusters via método do cotovelo',
        'Particularmente adequado para K-Means'
      ],
      weaknesses: [
        'Favorece clusters convexos e circulares',
        'Assume igualdade de importância entre coesão e separação',
        'Menos eficaz para clusters de formas complexas',
        'Sensível a outliers',
        'Pode fornecer resultados enganosos com clusters sobrepostos'
      ],
      suitable: [
        'Seleção rápida do número de clusters',
        'Validação de algoritmos baseados em centróides',
        'Análise exploratória inicial',
        'Conjuntos de dados grandes onde eficiência é necessária',
        'Clusters que se espera que sejam aproximadamente esféricos'
      ],
      unsuitable: [
        'Clusters de formas arbitrárias ou complexas',
        'Dados com outliers significativos',
        'Quando a densidade dos clusters varia significativamente',
        'Validação de algoritmos baseados em densidade'
      ]
    },
    {
      id: 'inertia',
      name: 'Inércia',
      formula: '∑(x∈Ci) ||x - μi||²',
      description: 'Soma das distâncias quadradas de cada ponto ao centroide do seu cluster. Também conhecida como soma dos quadrados dentro do cluster (WCSS). Valores menores indicam clusters mais compactos.',
      strengths: [
        'Computacionalmente eficiente e simples de calcular',
        'Diretamente otimizada pelo algoritmo K-Means',
        'Útil para o método do cotovelo na determinação do número de clusters',
        'Intuitiva: representa a compacidade interna dos clusters',
        'Correlacionada com a qualidade para clusters esféricos'
      ],
      weaknesses: [
        'Não tem limite superior (valores não normalizados)',
        'Valores dependem da escala dos dados',
        'Diminui monotonicamente com o aumento do número de clusters',
        'Não considera a separação entre clusters',
        'Inadequada para comparar diferentes conjuntos de dados'
      ],
      suitable: [
        'Determinação do número de clusters pelo método do cotovelo',
        'Avaliação da convergência do K-Means',
        'Comparação de diferentes inicializações para o mesmo algoritmo',
        'Análise preliminar rápida da qualidade do clustering',
        'Conjuntos de dados onde eficiência computacional é crítica'
      ],
      unsuitable: [
        'Comparação entre diferentes algoritmos de clustering',
        'Avaliação absoluta da qualidade do clustering',
        'Dados com clusters de densidades ou tamanhos muito diferentes',
        'Clusters de formas não-convexas ou não-esféricas',
        'Comparação entre conjuntos de dados diferentes'
      ]
    },
    {
      id: 'dunn',
      name: 'Índice Dunn',
      formula: 'min(i≠j) d(Ci,Cj) / max(k) diam(Ck)',
      description: 'Razão entre a menor distância entre clusters e o maior diâmetro de cluster. Valores maiores indicam clusters compactos e bem separados.',
      strengths: [
        'Considera simultaneamente a separação e a compacidade',
        'Independente do número de clusters',
        'Valores interpretáveis (maiores valores são melhores)',
        'Pode ser adaptado para diferentes métricas de distância',
        'Sensível a estruturas densas e bem separadas'
      ],
      weaknesses: [
        'Computacionalmente intensivo para grandes conjuntos de dados',
        'Extremamente sensível a outliers',
        'Baseado apenas na distância mínima entre clusters',
        'Pode penalizar excessivamente um único cluster disperso',
        'Instável com pequenas mudanças nos dados'
      ],
      suitable: [
        'Validação detalhada da qualidade do clustering',
        'Identificação de outliers problemáticos',
        'Comparação entre diferentes números de clusters',
        'Avaliação da robustez dos clusters',
        'Conjuntos de dados onde a separação clara é importante'
      ],
      unsuitable: [
        'Grandes conjuntos de dados (computacionalmente custoso)',
        'Dados com ruído ou outliers significativos',
        'Análise preliminar rápida',
        'Quando a robustez da métrica é importante',
        'Clusters de tamanhos muito diferentes'
      ]
    },
    {
      id: 'internal-external',
      name: 'Validação Interna vs. Externa',
      formula: 'Vários índices comparados com rótulos verdadeiros',
      description: 'Comparação entre métricas internas (baseadas apenas nos dados) e externas (que usam rótulos verdadeiros para validação). Útil quando há dados rotulados disponíveis para comparação.',
      strengths: [
        'Fornece validação objetiva quando rótulos verdadeiros estão disponíveis',
        'Permite avaliar o desempenho real do algoritmo',
        'Utiliza métricas como ARI, NMI e Homogeneidade',
        'Importante para pesquisa e benchmarking',
        'Útil para validar suposições sobre a estrutura dos dados'
      ],
      weaknesses: [
        'Requer dados rotulados (raramente disponíveis em problemas reais)',
        'Os rótulos verdadeiros podem não corresponder à estrutura natural dos dados',
        'Diferentes métricas externas podem levar a conclusões diferentes',
        'Nem sempre reflete a utilidade prática dos clusters',
        'Pode levar a overfitting da estrutura conhecida'
      ],
      suitable: [
        'Avaliação de algoritmos em datasets de referência',
        'Pesquisa e desenvolvimento de novos algoritmos',
        'Quando rótulos verdadeiros estão disponíveis para validação',
        'Comparação objetiva entre diferentes abordagens',
        'Validação de clustering semi-supervisionado'
      ],
      unsuitable: [
        'Maioria dos problemas práticos (sem rótulos)',
        'Exploração de estruturas desconhecidas nos dados',
        'Quando os rótulos verdadeiros não representam a estrutura natural',
        'Aplicações onde a interpretabilidade dos clusters é mais importante que a correspondência com classes conhecidas'
      ]
    },
    {
      id: 'dbcv',
      name: 'DBCV (Density-Based Clustering Validation)',
      formula: 'Baseada em densidade relativa e separação',
      description: 'Métrica específica para validação de algoritmos baseados em densidade, como DBSCAN e HDBSCAN. Considera a densidade dentro dos clusters e os vales de densidade entre eles.',
      strengths: [
        'Adequada para clusters de formas arbitrárias',
        'Não assume clusters convexos ou esféricos',
        'Avalia efetivamente algoritmos baseados em densidade',
        'Detecta clusters de diferentes densidades',
        'Valores interpretáveis (-1 a 1, maiores valores são melhores)'
      ],
      weaknesses: [
        'Computacionalmente intensiva',
        'Específica para clustering baseado em densidade',
        'Menos comum e estabelecida que outras métricas',
        'Implementação mais complexa',
        'Sensível aos parâmetros de estimação de densidade'
      ],
      suitable: [
        'Validação de resultados de DBSCAN, HDBSCAN e OPTICS',
        'Dados com clusters de formas complexas e arbitrárias',
        'Conjuntos de dados com clusters de diferentes densidades',
        'Quando métodos tradicionais de validação falham',
        'Validação de detecção de outliers baseada em densidade'
      ],
      unsuitable: [
        'Algoritmos baseados em centróides como K-Means',
        'Quando eficiência computacional é crítica',
        'Comparação geral entre diferentes tipos de algoritmos',
        'Conjuntos de dados muito grandes',
        'Quando métricas mais estabelecidas são suficientes'
      ]
    }
  ];

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Métricas Principais de Avaliação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-1 mb-6">
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
              É recomendado utilizar múltiplas métricas para avaliar modelos de clustering, 
              pois cada métrica fornece uma perspectiva diferente sobre a qualidade dos clusters.
              A escolha das métricas deve considerar o tipo de algoritmo utilizado, as características
              dos dados e o objetivo da análise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;