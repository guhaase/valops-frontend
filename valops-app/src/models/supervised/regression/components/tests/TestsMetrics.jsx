// src/models/supervised/regression/components/tests/TestsMetrics.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('mse');
  
  // Dados das métricas de regressão
  const metrics = [
    {
      id: 'mse',
      name: 'MSE (Mean Squared Error)',
      formula: '(1/n) * Σ(yi - ŷi)²',
      description: 'Média dos quadrados das diferenças entre os valores previstos e os valores reais. Penaliza erros maiores de forma quadrática.',
      strengths: [
        'Penaliza erros grandes mais fortemente',
        'Matematicamente tratável para otimização',
        'Diferenciável e conveniente para treinamento de modelos',
        'Útil quando grandes erros são particularmente indesejáveis'
      ],
      weaknesses: [
        'Sensível a outliers',
        'Não possui a mesma unidade da variável alvo (está em unidades ao quadrado)',
        'Difícil de interpretar em termos absolutos',
        'Não é facilmente comparável entre problemas diferentes'
      ],
      suitable: [
        'Quando erros grandes são mais problemáticos que pequenos',
        'Funções de perda para treinamento de modelos',
        'Comparação entre diferentes modelos para o mesmo problema',
        'Quando o contexto do problema penaliza outliers'
      ],
      unsuitable: [
        'Quando a interpretabilidade direta é necessária',
        'Conjuntos de dados com muitos outliers',
        'Quando todos os erros devem ser tratados com a mesma importância',
        'Comunicação com stakeholders não técnicos'
      ]
    },
    {
      id: 'rmse',
      name: 'RMSE (Root Mean Squared Error)',
      formula: '√[(1/n) * Σ(yi - ŷi)²]',
      description: 'Raiz quadrada do MSE. Mantém a mesma unidade da variável alvo e preserva a penalização de erros grandes.',
      strengths: [
        'Mantém a mesma unidade da variável target (mais interpretável)',
        'Penaliza erros grandes mais do que pequenos',
        'Amplamente utilizado e compreendido na literatura',
        'Combina efeitos de viés e variância'
      ],
      weaknesses: [
        'Ainda sensível a outliers',
        'Não indica a direção do erro (viés positivo ou negativo)',
        'Menos tratável matematicamente que MSE',
        'Pode ser difícil de comunicar para não especialistas'
      ],
      suitable: [
        'Quando a interpretabilidade na mesma unidade é importante',
        'Relatórios e comunicação de performance do modelo',
        'Comparação entre diferentes modelos para o mesmo conjunto de dados',
        'Avaliação final de modelos'
      ],
      unsuitable: [
        'Como função de perda para otimização direta (MSE é preferível)',
        'Conjuntos com valores extremos ou outliers significativos',
        'Quando erros em diferentes direções têm impactos diferentes'
      ]
    },
    {
      id: 'mae',
      name: 'MAE (Mean Absolute Error)',
      formula: '(1/n) * Σ|yi - ŷi|',
      description: 'Média dos valores absolutos das diferenças entre os valores previstos e os valores reais. Trata todos os erros de forma linear.',
      strengths: [
        'Menos sensível a outliers que MSE/RMSE',
        'Interpretável na mesma unidade da variável alvo',
        'Trata todos os erros proporcionalmente ao seu tamanho',
        'Intuitivo para comunicação'
      ],
      weaknesses: [
        'Não diferenciável no ponto zero (desafios para otimização)',
        'Não captura bem situações onde erros grandes são desproporcionalmente piores',
        'Pode levar a múltiplas soluções em alguns casos',
        'Menos utilizado como função de perda em algoritmos tradicionais'
      ],
      suitable: [
        'Quando outliers estão presentes mas ainda são significativos',
        'Quando todos os erros são igualmente importantes,independente da magnitude',
        'Para comunicação com stakeholders não técnicos',
        'Avaliação de modelos em domínios financeiros'
      ],
      unsuitable: [
        'Como função de perda para alguns algoritmos de otimização',
        'Quando erros grandes devem ser fortemente penalizados',
        'Em problemas onde a diferenciabilidade é importante para otimização'
      ]
    },
    {
      id: 'r2',
      name: 'R² (Coeficiente de Determinação)',
      formula: '1 - (Σ(yi - ŷi)² / Σ(yi - ȳ)²)',
      description: 'Proporção da variância da variável dependente que é previsível a partir das variáveis independentes. Varia geralmente de 0 a 1.',
      strengths: [
        'Adimensional e fácil de interpretar (0 a 1 na maioria dos casos)',
        'Comparável entre diferentes problemas',
        'Indica quão bem o modelo se ajusta aos dados em relação à média simples',
        'Familiar para stakeholders com conhecimento estatístico'
      ],
      weaknesses: [
        'Pode ser enganoso para modelos não lineares',
        'Pode ser negativo em alguns casos (modelo pior que a média)',
        'Não indica se o modelo é adequado, apenas se é melhor que a média',
        'Aumenta automaticamente quando mais variáveis são adicionadas'
      ],
      suitable: [
        'Comunicação geral da qualidade do ajuste do modelo',
        'Comparação entre problemas diferentes',
        'Contextos onde 0-1 é uma escala intuitiva',
        'Análise preliminar da eficácia do modelo'
      ],
      unsuitable: [
        'Como único critério para seleção de modelos',
        'Quando o objetivo principal é minimizar o erro absoluto',
        'Para modelos com viés intencional',
        'Otimização direta em algoritmos de aprendizado'
      ]
    },
    {
      id: 'mape',
      name: 'MAPE (Mean Absolute Percentage Error)',
      formula: '(1/n) * Σ|(yi - ŷi)/yi| * 100%',
      description: 'Média dos erros percentuais absolutos. Expressa a precisão como uma porcentagem do erro em relação aos valores reais.',
      strengths: [
        'Expressa o erro em porcentagem (fácil de interpretar)',
        'Independente da escala da variável alvo',
        'Comparável entre diferentes conjuntos de dados',
        'Intuitivo para comunicação com stakeholders'
      ],
      weaknesses: [
        'Problemático quando valores reais são próximos ou iguais a zero',
        'Assimétrico: penaliza mais previsões abaixo do real que acima',
        'Pode dar peso excessivo a erros em valores pequenos',
        'Indefinido quando existem zeros no conjunto de dados'
      ],
      suitable: [
        'Séries temporais como previsão de demanda ou vendas',
        'Quando a interpretação percentual é importante',
        'Comunicação de resultados para não especialistas',
        'Comparação entre diferentes conjuntos de dados'
      ],
      unsuitable: [
        'Conjuntos com valores próximos ou iguais a zero',
        'Quando erros simétricos são importantes',
        'Treinamento direto de modelos (função de perda)',
        'Quando pequenos valores absolutos são comuns nos dados'
      ]
    },
    {
      id: 'explained-variance',
      name: 'Variância Explicada',
      formula: '1 - Var(y - ŷ) / Var(y)',
      description: 'Mede a proporção da variância na variável dependente que é explicada pelo modelo. Similar ao R², mas mais robusto a viés sistemático.',
      strengths: [
        'Captura apenas a variância, não sendo afetada por viés sistemático',
        'Adimensional e intuitiva (0 a 1 na maioria dos casos)',
        'Complementar ao R² para avaliação de modelos',
        'Útil quando há potencial viés sistemático'
      ],
      weaknesses: [
        'Menos conhecida que outras métricas como R²',
        'Pode não capturar todos os aspectos de qualidade do modelo',
        'Ainda depende da normalidade dos resíduos para interpretação ideal',
        'Requer contexto adicional para interpretação completa'
      ],
      suitable: [
        'Complemento ao R² para avaliação mais robusta',
        'Quando há suspeita de viés sistemático no modelo',
        'Análise estatística mais detalhada',
        'Comparação entre diferentes abordagens de modelagem'
      ],
      unsuitable: [
        'Como métrica única de avaliação',
        'Comunicação com audiências não técnicas',
        'Quando a interpretabilidade direta é crítica',
        'Otimização direta durante o treinamento'
      ]
    },
    {
      id: 'max-error',
      name: 'Erro Máximo',
      formula: 'max(|yi - ŷi|)',
      description: 'O maior erro absoluto entre todas as previsões. Captura o pior caso de erro do modelo.',
      strengths: [
        'Identifica o pior erro possível do modelo',
        'Importante para aplicações sensíveis a erro máximo',
        'Fácil de entender e comunicar',
        'Na mesma unidade da variável alvo'
      ],
      weaknesses: [
        'Extremamente sensível a outliers',
        'Baseado em um único ponto, pode não representar o comportamento geral',
        'Não fornece informação sobre a distribuição geral dos erros',
        'Pode variar significativamente entre amostras'
      ],
      suitable: [
        'Aplicações críticas onde erros grandes são inaceitáveis',
        'Análise de cenários de pior caso',
        'Complemento para outras métricas mais abrangentes',
        'Relatórios de risco ou conformidade'
      ],
      unsuitable: [
        'Como métrica principal para otimização de modelos',
        'Conjuntos com potenciais outliers ou ruído',
        'Quando o comportamento médio é mais importante',
        'Como único critério para seleção de modelos'
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
              É recomendado utilizar múltiplas métricas para avaliar modelos de regressão, 
              pois cada métrica fornece uma perspectiva diferente sobre o desempenho. 
              A escolha das métricas deve ser guiada pelo contexto do problema e pelas 
              consequências dos diferentes tipos de erro para seu caso específico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;