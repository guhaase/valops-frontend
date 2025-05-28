// testing/models/classification/ClassificationTestsMetrics.js
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('accuracy');
  
  // Dados das métricas de classificação
  const metrics = [
    {
      id: 'accuracy',
      name: 'Acurácia',
      formula: '(TP + TN) / (TP + TN + FP + FN)',
      description: 'Proporção de predições corretas (tanto positivas quanto negativas) em relação ao total de casos.',
      strengths: [
        'Fácil de entender e comunicar',
        'Adequada quando as classes são balanceadas',
        'Medida direta do desempenho geral do modelo'
      ],
      weaknesses: [
        'Pode ser enganosa com classes desbalanceadas',
        'Não diferencia tipos de erros (FP vs FN)',
        'Não considera probabilidades ou confiança das previsões'
      ],
      suitable: [
        'Conjuntos de dados balanceados',
        'Quando falsos positivos e falsos negativos têm importância semelhante',
        'Métricas iniciais de desempenho'
      ],
      unsuitable: [
        'Conjuntos de dados altamente desbalanceados',
        'Quando o custo de diferentes tipos de erro varia significativamente',
        'Problemas onde uma classe é rara (como detecção de fraudes)'
      ]
    },
    {
      id: 'precision',
      name: 'Precisão',
      formula: 'TP / (TP + FP)',
      description: 'Proporção de predições positivas corretas em relação ao total de predições positivas. Indica a qualidade das predições positivas do modelo.',
      strengths: [
        'Importante quando falsos positivos são custosos',
        'Foco na qualidade das previsões positivas',
        'Não é afetada pelo número de negativos verdadeiros'
      ],
      weaknesses: [
        'Ignora falsos negativos',
        'Pode ser manipulada tornando o modelo muito conservador',
        'Não considera a cobertura de casos positivos'
      ],
      suitable: [
        'Quando falsos positivos têm alto custo ou consequências graves',
        'Filtragem de spam (queremos certeza de que emails marcados como spam realmente são)',
        'Diagnóstico médico (evitar tratamentos desnecessários)'
      ],
      unsuitable: [
        'Quando falsos negativos são mais importantes que falsos positivos',
        'Quando a cobertura de todos os casos positivos é crucial',
        'Conjuntos de dados extremamente desbalanceados'
      ]
    },
    {
      id: 'recall',
      name: 'Recall (Sensibilidade)',
      formula: 'TP / (TP + FN)',
      description: 'Proporção de casos positivos reais que foram corretamente identificados. Indica a capacidade do modelo de encontrar todos os casos positivos.',
      strengths: [
        'Importante quando falsos negativos são custosos',
        'Foco na identificação de todos os casos positivos',
        'Indicador de cobertura da classe positiva'
      ],
      weaknesses: [
        'Ignora falsos positivos',
        'Pode ser maximizada trivialmente classificando tudo como positivo',
        'Não considera a precisão das previsões positivas'
      ],
      suitable: [
        'Quando não encontrar casos positivos tem alto custo',
        'Detecção de doenças (não queremos deixar de diagnosticar pacientes doentes)',
        'Identificação de fraudes (é pior deixar passar uma fraude)'
      ],
      unsuitable: [
        'Quando falsos positivos são mais preocupantes que falsos negativos',
        'Quando recursos para lidar com positivos são limitados (ex: auditorias)',
        'Quando classificar corretamente negativos também é importante'
      ]
    },
    {
      id: 'f1',
      name: 'F1-Score',
      formula: '2 * (Precision * Recall) / (Precision + Recall)',
      description: 'Média harmônica entre precisão e recall, buscando um equilíbrio entre esses dois objetivos frequentemente conflitantes.',
      strengths: [
        'Combina precisão e recall em uma única métrica',
        'Penaliza extremos (alta precisão/baixo recall ou vice-versa)',
        'Útil para conjuntos de dados desbalanceados',
        'Considera tanto falsos positivos quanto falsos negativos'
      ],
      weaknesses: [
        'Não considera verdadeiros negativos',
        'Assume igual importância entre precisão e recall',
        'Pode ser difícil interpretar isoladamente',
        'Não incorpora custos diferentes para erros'
      ],
      suitable: [
        'Conjuntos de dados desbalanceados',
        'Quando precisão e recall são igualmente importantes',
        'Avaliação geral de modelos em competições ou benchmarks',
        'Informação resumida sobre desempenho'
      ],
      unsuitable: [
        'Quando precisão e recall têm importâncias diferentes',
        'Quando verdadeiros negativos são importantes na avaliação',
        'Contextos que exigem métricas mais específicas ou customizadas'
      ]
    },
    {
      id: 'auc-roc',
      name: 'AUC-ROC',
      formula: 'Área sob a curva ROC (TPR vs FPR)',
      description: 'Mede a capacidade do modelo de distinguir entre classes. Representa a probabilidade de o modelo classificar um exemplo positivo aleatório acima de um exemplo negativo aleatório.',
      strengths: [
        'Independente do threshold de decisão',
        'Avalia o modelo em diferentes pontos de operação',
        'Robusto para conjuntos desbalanceados',
        'Considera todas as combinações possíveis de exemplos positivos/negativos'
      ],
      weaknesses: [
        'Pode ser enganosa se o ROC parece bom, mas PR (Precision-Recall) é ruim',
        'Menos intuitiva que métricas diretas como precisão e recall',
        'Pode dar impressão otimista em dados muito desbalanceados',
        'Não reflete diretamente o desempenho operacional do modelo'
      ],
      suitable: [
        'Comparação de diferentes modelos independentemente do threshold',
        'Avaliação do poder de discriminação geral',
        'Quando o threshold de classificação será ajustado Posteriormente',
        'Modelos que produzem scores/probabilidades em vez de classificações binárias'
      ],
      unsuitable: [
        'Conjuntos extremamente desbalanceados (preferir AUC-PR)',
        'Quando uma operação específica do modelo é importante (use métricas no threshold desejado)',
        'Quando custos de erros são muito assimétricos'
      ]
    },
    {
      id: 'confusion-matrix',
      name: 'Matriz de Confusão',
      formula: 'Tabela: [[TN, FP], [FN, TP]]',
      description: 'Tabela que mostra as contagens de verdadeiros positivos (TP), falsos positivos (FP), verdadeiros negativos (TN) e falsos negativos (FN), permitindo uma visão completa do desempenho do classificador.',
      strengths: [
        'Fornece visão completa do desempenho de classificação',
        'Base para cálculo de múltiplas métricas',
        'Permite identificar em quais classes o modelo tem dificuldade',
        'Útil para análise detalhada de erros'
      ],
      weaknesses: [
        'Não é uma métrica única, necessita interpretação',
        'Complexidade aumenta com o número de classes',
        'Não considera diretamente probabilidades ou scores',
        'Require threshold de decisão definido'
      ],
      suitable: [
        'Análise completa de desempenho do classificador',
        'Identificação de padrões específicos de erro',
        'Base para escolha de outras métricas',
        'Comunicação detalhada de resultados'
      ],
      unsuitable: [
        'Quando é necessária uma métrica única de comparação',
        'Conjuntos com muitas classes (difícil visualização)',
        'Comunicação rápida ou resumida de resultados'
      ]
    },
    {
      id: 'log-loss',
      name: 'Log Loss (Cross-Entropy)',
      formula: '-1/N ∑(yi·log(pi) + (1-yi)·log(1-pi))',
      description: 'Mede a performance de um modelo de classificação cujas saídas são probabilidades. Penaliza fortemente previsões confiantes que estão incorretas.',
      strengths: [
        'Considera a incerteza das predições (probabilidades)',
        'Penaliza fortemente previsões confiantes que estão erradas',
        'Incentiva calibração de probabilidades',
        'Função de perda para otimização de muitos modelos'
      ],
      weaknesses: [
        'Menos intuitiva que métricas diretas como acurácia',
        'Escala dependente do número de classes',
        'Difícil comunicar para stakeholders não técnicos',
        'Valores absolutos não têm interpretação direta'
      ],
      suitable: [
        'Otimização de modelos durante treinamento',
        'Avaliação da calibração de probabilidades',
        'Problemas onde a confiança da previsão é importante',
        'Comparação de modelos probabilísticos'
      ],
      unsuitable: [
        'Comunicação com público não técnico',
        'Quando apenas a classe prevista importa, não sua probabilidade',
        'Situações onde erros têm custos muito diferentes'
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
              É recomendado utilizar múltiplas métricas para avaliar modelos de classificação, 
              pois cada métrica fornece uma perspectiva diferente sobre o desempenho. 
              A escolha das métricas deve ser guiada pelo contexto do problema e pelas 
              consequências dos diferentes tipos de erro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;