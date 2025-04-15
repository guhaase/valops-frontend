// src/models/computer-vision/components/tests/TestsMetrics.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('accuracy');
  
  // Dados das métricas de visão computacional
  const metrics = [
    {
      id: 'accuracy',
      name: 'Acurácia',
      formula: 'Predições Corretas / Total de Predições',
      description: 'Proporção de classificações corretas em relação ao total de imagens. Métrica básica para classificação de imagens.',
      strengths: [
        'Fácil de entender e comunicar',
        'Implementação simples',
        'Boa visão geral do desempenho',
        'Útil para datasets balanceados'
      ],
      weaknesses: [
        'Enganosa para datasets desbalanceados',
        'Não distingue tipos de erros',
        'Não adequada para tarefas de detecção/segmentação',
        'Não considera confiança das previsões'
      ],
      suitable: [
        'Classificação de imagens com classes balanceadas',
        'Aplicações onde todos os tipos de erro têm impacto similar',
        'Avaliação inicial de modelos de classificação'
      ],
      unsuitable: [
        'Datasets com classes desbalanceadas',
        'Tarefas de detecção de objetos ou segmentação',
        'Quando diferentes tipos de erro têm diferentes impactos'
      ]
    },
    {
      id: 'mAP',
      name: 'mAP (Mean Average Precision)',
      formula: 'Média das AP para cada classe',
      description: 'Métrica padrão para avaliação de detecção de objetos. Calcula a precisão média para diferentes limiares de IoU e para todas as classes.',
      strengths: [
        'Avalia tanto localização quanto classificação',
        'Considera diferentes limiares de confiança (curva Precision-Recall)',
        'Padrão estabelecido em competições (COCO, Pascal VOC)',
        'Robusto para diferentes configurações de detecção'
      ],
      weaknesses: [
        'Complexo para entender e implementar',
        'Diferentes implementações (COCO vs. Pascal VOC)',
        'Pode mascarar deficiências em classes específicas',
        'Não incorpora tempo de inferência ou eficiência'
      ],
      suitable: [
        'Avaliação de modelos de detecção de objetos',
        'Benchmarking e comparação de diferentes modelos',
        'Aplicações onde tanto precisão quanto recall são importantes'
      ],
      unsuitable: [
        'Modelos de classificação simples',
        'Quando velocidade de detecção é mais crítica que precisão',
        'Quando a tarefa principal é segmentação'
      ]
    },
    {
      id: 'iou',
      name: 'IoU (Intersection over Union)',
      formula: 'Área de Intersecção / Área de União',
      description: 'Mede a sobreposição entre duas regiões (previsão e ground truth). Usado tanto para avaliação de detecção de objetos quanto segmentação.',
      strengths: [
        'Intuitivo e fácil de visualizar',
        'Avalia precisão espacial das previsões',
        'Independente do tamanho do objeto/região',
        'Aplicável tanto para bounding boxes quanto máscaras'
      ],
      weaknesses: [
        'Não captura erros de classificação',
        'Sensível a pequenos erros em objetos pequenos',
        'Não considera confiança das previsões',
        'Não distingue entre diferentes tipos de erros espaciais'
      ],
      suitable: [
        'Avaliação da precisão de localização em detecção',
        'Avaliação da qualidade de segmentação',
        'Como limiar para determinar detecções corretas'
      ],
      unsuitable: [
        'Avaliação completa de sistemas de detecção (sem considerar classificação)',
        'Quando apenas classificação é importante',
        'Como métrica única isolada'
      ]
    },
    {
      id: 'dice',
      name: 'Coeficiente Dice (F1-Score espacial)',
      formula: '2|A∩B| / (|A|+|B|)',
      description: 'Métrica que mede a similaridade entre duas amostras, frequentemente usada em segmentação. É equivalente ao F1-Score aplicado a pixels.',
      strengths: [
        'Equilibra precisão e recall a nível de pixel',
        'Menos sensível a desbalanceamento que IoU',
        'Penaliza mais fortemente erros graves de segmentação',
        'Função de perda diretamente otimizável'
      ],
      weaknesses: [
        'Pode ser enganoso para objetos muito pequenos',
        'Não distingue entre diferentes tipos de erros',
        'Não considera relações entre diferentes objetos',
        'Variações na implementação podem afetar resultados'
      ],
      suitable: [
        'Segmentação semântica e de instâncias',
        'Segmentação médica onde falsos negativos são importantes',
        'Quando há desbalanceamento entre regiões foreground/background'
      ],
      unsuitable: [
        'Avaliação de detecção de objetos baseada em bounding boxes',
        'Quando a localização exata não é crítica',
        'Como substituto para métricas específicas de detecção'
      ]
    },
    {
      id: 'fps',
      name: 'FPS (Frames Per Second)',
      formula: 'Número de imagens processadas / tempo total',
      description: 'Medida da velocidade de inferência do modelo, especialmente importante para aplicações em tempo real.',
      strengths: [
        'Diretamente relacionada à usabilidade em aplicações reais',
        'Fácil de medir e entender',
        'Crucial para sistemas em tempo real',
        'Permite avaliar trade-off entre precisão e velocidade'
      ],
      weaknesses: [
        'Dependente do hardware utilizado',
        'Não indica qualidade das previsões',
        'Pode variar com tamanho/complexidade da imagem',
        'Implementação e otimização podem alterar resultados'
      ],
      suitable: [
        'Sistemas em tempo real (robótica, veículos autônomos)',
        'Aplicações móveis com recursos limitados',
        'Quando o tempo de resposta é crítico'
      ],
      unsuitable: [
        'Quando precisão é mais importante que velocidade',
        'Como métrica isolada sem considerar qualidade',
        'Para comparação entre hardwares diferentes'
      ]
    },
    {
      id: 'top-k',
      name: 'Top-K Accuracy',
      formula: 'TP (entre as K previsões mais prováveis) / Total',
      description: 'Considera uma previsão correta se a classe verdadeira está entre as K classes mais prováveis previstas pelo modelo.',
      strengths: [
        'Útil para problemas com muitas classes',
        'Considera a incerteza do modelo',
        'Mais flexível que acurácia simples',
        'Melhor reflete aplicações reais com várias opções'
      ],
      weaknesses: [
        'Pode mascarar má performance em classes específicas',
        'Menos relevante para problemas com poucas classes',
        'Difícil escolher K apropriado',
        'Não adequado para sistemas totalmente automatizados'
      ],
      suitable: [
        'Classificação com grande número de classes',
        'Sistemas com interação humana',
        'Quando há ambiguidade inerente entre classes'
      ],
      unsuitable: [
        'Sistemas binários ou com poucas classes',
        'Quando apenas a classe mais provável é relevante',
        'Sistemas totalmente automatizados sem supervisão'
      ]
    },
    {
      id: 'segmentation-metrics',
      name: 'Métricas de Segmentação (mIoU)',
      formula: 'Média de IoU para todas as classes',
      description: 'Mean Intersection over Union mede a qualidade da segmentação calculando a média do IoU para todas as classes no dataset.',
      strengths: [
        'Específica para avaliação de segmentação',
        'Considera todas as classes uniformemente',
        'Padrão em datasets de segmentação (Cityscapes, ADE20K)',
        'Avalia precisão por pixel'
      ],
      weaknesses: [
        'Classes raras têm o mesmo peso que comuns',
        'Não incorpora confiança das previsões',
        'Pode mascarar falhas em classes específicas',
        'Sensível a detalhes de implementação (borda, background)'
      ],
      suitable: [
        'Avaliação de modelos de segmentação semântica',
        'Benchmarking em datasets de segmentação padrão',
        'Quando todas as classes têm importância similar'
      ],
      unsuitable: [
        'Quando certas classes são mais importantes que outras',
        'Para segmentação de instâncias (sem distinção entre instâncias)',
        'Quando a fronteira entre objetos é crítica'
      ]
    },
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
              Para uma avaliação abrangente, é recomendado utilizar múltiplas métricas que avaliem diferentes 
              aspectos do modelo. Por exemplo, para modelos de detecção, considere mAP para precisão, FPS para 
              velocidade e métricas específicas para casos de uso particulares. A seleção de métricas deve ser 
              guiada pelos requisitos específicos da aplicação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;