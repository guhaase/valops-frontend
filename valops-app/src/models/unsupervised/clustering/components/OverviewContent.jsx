// src/models/supervised/clustering/components/OverviewContent.jsx
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Modelos de Clustering</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Modelos de clustering são algoritmos de aprendizado não-supervisionado que agrupam dados similares
          em clusters (grupos), com base nas características intrínsecas dos dados, sem a necessidade de rótulos
          predefinidos. O objetivo desses algoritmos é maximizar a similaridade dentro de cada grupo e a
          dissimilaridade entre grupos diferentes.
        </p>
        <p>
          O clustering é utilizado em diversas aplicações como segmentação de clientes, análise de imagens,
          organização de documentos, detecção de anomalias, compressão de dados, entre muitas outras. A escolha
          do algoritmo de clustering depende da natureza dos dados e dos objetivos específicos da análise.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Target className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-700">Objetivos</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Identificar grupos naturais dentro dos dados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Descobrir padrões e estruturas ocultas</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Reduzir a complexidade dos dados através da agregação</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Facilitar a exploração e análise de grandes volumes de dados</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <BarChart2 className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-700">Desafios Comuns</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Determinar o número ideal de clusters</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Escolher a medida de similaridade apropriada</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Lidar com dados de alta dimensionalidade</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Avaliação da qualidade dos clusters formados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Interpretação e validação dos resultados</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Modelos de Clustering</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Clustering Particionado</h5>
            <p className="text-sm text-gray-600">
              Divide os dados em grupos não sobrepostos. Cada ponto de dados pertence a exatamente um cluster.
              Exemplos incluem K-Means, K-Medoids e PAM (Partitioning Around Medoids).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Clustering Hierárquico</h5>
            <p className="text-sm text-gray-600">
              Cria uma hierarquia de clusters, permitindo diferentes níveis de granularidade.
              Pode ser aglomerativo (bottom-up) ou divisivo (top-down).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Clustering Baseado em Densidade</h5>
            <p className="text-sm text-gray-600">
              Define clusters como regiões densas de pontos, separadas por regiões de baixa densidade.
              Exemplos incluem DBSCAN, OPTICS e HDBSCAN.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Clustering Baseado em Modelos</h5>
            <p className="text-sm text-gray-600">
              Assume que os dados são gerados por uma mistura de distribuições probabilísticas.
              O exemplo mais comum é o algoritmo Expectation-Maximization (EM) com Gaussian Mixture Models (GMM).
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Book className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Conceitos Fundamentais</h4>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Medidas de Similaridade/Distância</h5>
            <p className="text-sm text-gray-600">
              Métodos para quantificar a similaridade ou distância entre pontos de dados, como distância Euclidiana,
              Manhattan, Coseno, ou correlação de Pearson.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Centroide e Medoide</h5>
            <p className="text-sm text-gray-600">
              O centroide é o ponto médio de um cluster, enquanto o medoide é o ponto de dados existente
              mais próximo ao centro do cluster.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Inércia e Variância Intra-cluster</h5>
            <p className="text-sm text-gray-600">
              Medidas da compacidade dos clusters, calculadas como a soma das distâncias quadradas 
              entre cada ponto e o centroide do seu cluster.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Índices de Validação de Clusters</h5>
            <p className="text-sm text-gray-600">
              Métricas para avaliar a qualidade dos clusters, incluindo o índice Silhouette, 
              Davies-Bouldin, Calinski-Harabasz, entre outros. Ajudam a determinar o número ideal de clusters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;