// src/models/supervised/regression/components/OverviewContent.jsx
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Modelos de Regressão</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Modelos de regressão são algoritmos de aprendizado supervisionado que preveem valores 
          contínuos com base em variáveis preditoras. Diferentemente da classificação, que categoriza 
          dados em classes discretas, a regressão estima valores numéricos dentro de um intervalo contínuo.
        </p>
        <p>
          Estes modelos são amplamente utilizados em previsão de vendas, estimativa de preços, 
          análise de séries temporais, predição de demanda, e muitas outras aplicações onde 
          a variável alvo é numérica. A regressão pode ser simples (uma variável preditora) ou 
          múltipla (múltiplas variáveis preditoras).
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
              <span>Prever valores numéricos contínuos com a maior precisão possível</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Identificar relações entre variáveis independentes e dependentes</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Minimizar erros de predição (diferença entre valores previstos e reais)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Encontrar padrões e tendências em dados numéricos contínuos</span>
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
              <span>Multicolinearidade entre variáveis preditoras</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Overfitting em modelos complexos</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Outliers que afetam significativamente as estimativas</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Heteroscedasticidade (variância não constante dos resíduos)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Modelagem de relações não lineares entre variáveis</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Modelos de Regressão</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Regressão Linear</h5>
            <p className="text-sm text-gray-600">
              Modela a relação entre a variável resposta e uma ou mais variáveis preditoras usando uma 
              linha reta (regressão linear simples) ou um hiperplano (regressão linear múltipla).
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Regressão Polinomial</h5>
            <p className="text-sm text-gray-600">
              Estende a regressão linear modelando a relação entre a variável resposta e as variáveis 
              preditoras como um polinômio de grau n, capturando relações não lineares.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Regressão Robusta</h5>
            <p className="text-sm text-gray-600">
              Métodos menos sensíveis a outliers que a regressão linear tradicional, aplicando 
              técnicas que diminuem a influência de pontos extremos.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Regressão Regularizada</h5>
            <p className="text-sm text-gray-600">
              Inclui técnicas como Ridge, Lasso e ElasticNet, que adicionam penalidades para controlar 
              a complexidade do modelo e evitar overfitting.
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
            <h5 className="font-medium text-gray-800 mb-1">Função de Custo</h5>
            <p className="text-sm text-gray-600">
              Medida do erro total entre os valores previstos e os valores reais. O Erro 
              Quadrático Médio (MSE) é uma das funções de custo mais comuns em regressão.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Coeficientes de Regressão</h5>
            <p className="text-sm text-gray-600">
              Parâmetros que descrevem como as variáveis preditoras afetam a variável alvo. 
              Em regressão linear, incluem a interceptação e os coeficientes de cada variável.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Resíduos</h5>
            <p className="text-sm text-gray-600">
              Diferenças entre os valores observados e os valores previstos pelo modelo. 
              A análise dos resíduos é crucial para avaliar a qualidade do ajuste do modelo.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Coeficiente de Determinação (R²)</h5>
            <p className="text-sm text-gray-600">
              Medida que indica a proporção da variância na variável dependente que é predita 
              pelas variáveis independentes. Varia de 0 a 1, com valores mais altos indicando 
              melhor ajuste do modelo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;