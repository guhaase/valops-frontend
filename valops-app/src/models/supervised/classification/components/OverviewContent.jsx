// testing/models/classification/ClassificationOverview.js
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Modelos de Classificação</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Modelos de classificação são algoritmos de aprendizado supervisionado que identificam a 
          qual categoria ou classe um novo dado pertence, com base em exemplos prévios cujas categorias 
          são conhecidas. Esta é uma das tarefas mais fundamentais e amplamente utilizadas em machine learning.
        </p>
        <p>
          A classificação é utilizada em diversas aplicações como filtragem de spam, detecção de fraudes, 
          previsão de abandono de clientes (churn), diagnóstico médico, entre muitas outras. Dependendo 
          do número de classes possíveis, a classificação pode ser binária (duas classes) ou multiclasse 
          (três ou mais classes).
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
              <span>Identificar corretamente a classe à qual um novo exemplo pertence</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Generalizar padrões a partir de dados de treinamento</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Maximizar a precisão da previsão em dados não vistos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Balancear o trade-off entre overfitting e underfitting</span>
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
              <span>Dados desbalanceados entre classes</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Overfitting em conjuntos de dados pequenos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Seleção adequada de features e engenharia de atributos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Escolha da métrica de avaliação apropriada</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Interpretabilidade vs. desempenho do modelo</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Modelos de Classificação</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Classificação Binária</h5>
            <p className="text-sm text-gray-600">
              Classifica dados em uma de duas classes (ex: spam/não-spam, fraude/não-fraude). 
              É o tipo mais simples e comum de problemas de classificação.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Classificação Multiclasse</h5>
            <p className="text-sm text-gray-600">
              Classifica dados em uma de três ou mais classes mutuamente exclusivas 
              (ex: classificação de espécies, categorias de produtos).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Classificação Multirrótulo</h5>
            <p className="text-sm text-gray-600">
              Atribui múltiplas classes a um único exemplo (ex: uma imagem pode conter "céu", 
              "montanha" e "lago" simultaneamente).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Detecção de Anomalias</h5>
            <p className="text-sm text-gray-600">
              Identifica observações que diferem significativamente do padrão esperado 
              (ex: detecção de fraudes, falhas em equipamentos).
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
            <h5 className="font-medium text-gray-800 mb-1">Função de Decisão</h5>
            <p className="text-sm text-gray-600">
              A função matemática que mapeia os dados de entrada para as classes previstas, 
              separando o espaço de características em regiões de decisão.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Fronteira de Decisão</h5>
            <p className="text-sm text-gray-600">
              A fronteira que separa as diferentes classes no espaço de características. 
              Sua forma depende do algoritmo utilizado (linear, não-linear, etc.).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Probabilidade de Classe</h5>
            <p className="text-sm text-gray-600">
              Muitos classificadores não apenas predizem a classe, mas também fornecem a 
              probabilidade de pertencer a cada classe possível, o que é importante para 
              a tomada de decisão com base em confiança.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Trade-off Viés-Variância</h5>
            <p className="text-sm text-gray-600">
              O equilíbrio entre um modelo muito simples (alto viés, baixa variância) e 
              um modelo muito complexo (baixo viés, alta variância), que é fundamental 
              para a generalização adequada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;