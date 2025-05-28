// src/models/supervised/dimensionality-reduction/components/OverviewContent.jsx
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Redução de Dimensionalidade</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Redução de dimensionalidade é uma técnica utilizada para transformar dados de alta dimensão em uma representação 
          de menor dimensão, mantendo as características mais importantes dos dados originais. Esta abordagem é fundamental 
          para lidar com o problema da "maldição da dimensionalidade" e melhorar o desempenho de modelos de aprendizado de máquina.
        </p>
        <p>
          Estas técnicas são aplicadas em diversos cenários, como visualização de dados complexos, compressão de informações, 
          remoção de ruído, e como pré-processamento para algoritmos de classificação e regressão. A redução de dimensionalidade 
          pode ser realizada por meio de seleção de características ou extração de características, dependendo dos objetivos do projeto.
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
              <span>Reduzir o número de variáveis mantendo a informação relevante</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Combater a maldição da dimensionalidade</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Visualizar dados multidimensionais em 2D ou 3D</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Melhorar o desempenho computacional de modelos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Eliminar multicolinearidade e redundância nos dados</span>
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
              <span>Determinar o número ideal de dimensões a manter</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Preservar informações discriminantes para tarefas Posteriores</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Interpretabilidade das novas dimensões criadas</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Escolha do algoritmo mais adequado para cada tipo de dado</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Lidar com dados não-lineares em suas relações originais</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Redução de Dimensionalidade</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Seleção de Características</h5>
            <p className="text-sm text-gray-600">
              Métodos que selecionam um subconjunto das características originais, eliminando aquelas redundantes ou irrelevantes.
              Exemplos incluem Recursive Feature Elimination, Filter Methods e Wrapper Methods.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Extração de Características</h5>
            <p className="text-sm text-gray-600">
              Técnicas que transformam o espaço original em novas dimensões, geralmente combinações das originais.
              Incluem PCA, LDA, t-SNE, UMAP e outros métodos de projeção.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Métodos Lineares</h5>
            <p className="text-sm text-gray-600">
              Algoritmos que preservam relações lineares entre os dados, como PCA, LDA e Factor Analysis.
              São computacionalmente eficientes e mais fáceis de interpretar.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Métodos Não-Lineares</h5>
            <p className="text-sm text-gray-600">
              Técnicas que capturam relações complexas e não-lineares nos dados, como t-SNE, UMAP, 
              Isomap, Autoencoders e Kernel PCA.
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
            <h5 className="font-medium text-gray-800 mb-1">Variância Explicada</h5>
            <p className="text-sm text-gray-600">
              Quantidade de informação (variabilidade) dos dados originais preservada após a redução de dimensionalidade.
              Métrica importante para determinar o número de componentes a reter.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Maldição da Dimensionalidade</h5>
            <p className="text-sm text-gray-600">
              Fenômeno onde o aumento de dimensões torna os dados esparsos, dificultando a modelagem.
              Em alta dimensionalidade, a distância entre pontos se torna menos informativa.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Correlação e Colinearidade</h5>
            <p className="text-sm text-gray-600">
              Relações lineares entre variáveis que indicam redundância informacional.
              A redução de dimensionalidade busca identificar e eliminar essas redundâncias.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Preservação de Distâncias</h5>
            <p className="text-sm text-gray-600">
              Capacidade de manter as relações de proximidade entre pontos após a redução.
              Métodos como t-SNE e UMAP priorizam preservar estruturas locais ou globais.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Manifold Learning</h5>
            <p className="text-sm text-gray-600">
              Técnicas que assumem que os dados de alta dimensão residem em um manifold de menor dimensão.
              Buscam descobrir essa estrutura subjacente para uma redução mais eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;