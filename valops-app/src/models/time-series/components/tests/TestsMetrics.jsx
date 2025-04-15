// src/models/supervised/time-series/components/tests/TestsMetrics.jsx
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TestsMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('mse');
  
  // Dados das métricas de séries temporais
  const metrics = [
    {
      id: 'mse',
      name: 'MSE / RMSE',
      formula: 'MSE = 1/n ∑(y_i - ŷ_i)²  |  RMSE = √MSE',
      description: 'O Erro Quadrático Médio (MSE) e sua raiz quadrada (RMSE) medem a média dos quadrados dos erros entre valores observados e previstos. RMSE é mais interpretável por estar na mesma escala dos dados originais.',
      strengths: [
        'Penaliza erros maiores mais severamente devido ao termo quadrático',
        'Útil quando outliers ou erros grandes são especialmente indesejáveis',
        'RMSE é facilmente interpretável na mesma unidade dos dados originais',
        'Amplamente utilizado e compreendido na indústria e academia'
      ],
      weaknesses: [
        'Sensível a outliers e valores extremos',
        'Não normalizado, dificultando comparação entre séries de escalas diferentes',
        'Não diferencia entre erro positivo e negativo (superestimação vs. subestimação)',
        'Pode ser menos intuitivo para explicar a stakeholders não técnicos'
      ],
      suitable: [
        'Comparação de modelos para uma mesma série temporal',
        'Quando erros maiores têm impacto desproporcional',
        'Problemas onde a escala do erro é importante',
        'Otimização de modelos (função de perda common para regressão)'
      ],
      unsuitable: [
        'Comparação entre séries temporais de escalas muito diferentes',
        'Quando a interpretabilidade do erro em termos percentuais é necessária',
        'Situações onde outliers podem distorcer a avaliação',
        'Quando erros positivos e negativos têm implicações diferentes'
      ]
    },
    {
      id: 'mae',
      name: 'MAE',
      formula: 'MAE = 1/n ∑|y_i - ŷ_i|',
      description: 'O Erro Absoluto Médio (MAE) calcula a média dos valores absolutos das diferenças entre valores observados e previstos. Representa a magnitude média do erro sem considerar sua direção.',
      strengths: [
        'Menos sensível a outliers que MSE/RMSE',
        'Facilmente interpretável (erro médio na unidade original)',
        'Representa a magnitude média do erro sem exagerar valores extremos',
        'Representa a distância L1 (Manhattan) entre pontos reais e previstos'
      ],
      weaknesses: [
        'Não penaliza erros grandes tão severamente quanto MSE',
        'Não fornece informação sobre a direção do erro',
        'Não normalizado, dificultando comparação entre séries diferentes',
        'Derivada não contínua em zero (pode afetar alguns algoritmos de otimização)'
      ],
      suitable: [
        'Quando todos os erros devem ser tratados com igual importância',
        'Em presença de outliers onde RMSE seria muito afetado',
        'Quando a interpretabilidade direta do erro é importante',
        'Para obter uma visão da magnitude média do erro sem distorções'
      ],
      unsuitable: [
        'Quando erros maiores devem ser penalizados desproporcionalmente',
        'Para comparar séries com escalas muito diferentes',
        'Quando a direção do erro (positivo ou negativo) é relevante',
        'Como função de perda para alguns algoritmos de otimização'
      ]
    },
    {
      id: 'mape',
      name: 'MAPE',
      formula: 'MAPE = 1/n ∑|(y_i - ŷ_i)/y_i| × 100%',
      description: 'O Erro Percentual Absoluto Médio (MAPE) expressa o erro em termos percentuais em relação aos valores reais, fornecendo uma medida relativa e independente da escala.',
      strengths: [
        'Independente da escala, permitindo comparação entre diferentes séries',
        'Facilmente interpretável como porcentagem do valor real',
        'Comunica bem o significado do erro para não especialistas',
        'Útil para relatórios e comunicação de performance'
      ],
      weaknesses: [
        'Indefinido ou problemático quando valores reais são zero ou próximos de zero',
        'Assimétrico: penaliza mais superestimação que subestimação',
        'Não distingue entre erros em diferentes magnitudes absolutas',
        'Pode gerar valores infinitos ou muito grandes para valores próximos a zero'
      ],
      suitable: [
        'Comparação de modelos entre diferentes séries temporais',
        'Quando o significado relativo do erro é mais importante que o absoluto',
        'Comunicação de resultados para públicos não técnicos',
        'Séries temporais com valores consistentemente distantes de zero'
      ],
      unsuitable: [
        'Séries que contêm ou se aproximam de zero',
        'Quando erros de mesma magnitude são igualmente importantes, independente do valor',
        'Situações onde a assimetria na penalização é problemática',
        'Otimização de modelos devido à possibilidade de valores infinitos'
      ]
    },
    {
      id: 'smape',
      name: 'sMAPE',
      formula: 'sMAPE = 1/n ∑|y_i - ŷ_i|/(|y_i| + |ŷ_i|) × 200%',
      description: 'O Erro Percentual Absoluto Médio Simétrico (sMAPE) é uma variação do MAPE que busca corrigir a assimetria, usando a média dos valores absolutos reais e previstos como denominador.',
      strengths: [
        'Parcialmente resolve o problema dos valores zero no MAPE tradicional',
        'Mais simétrico que MAPE (penaliza sobre e subestimação de forma similar)',
        'Limitado a um valor máximo de 200%, evitando erros infinitos',
        'Independente da escala, permitindo comparações entre séries diferentes'
      ],
      weaknesses: [
        'Ainda problemático quando tanto o valor real quanto o previsto são próximos de zero',
        'Interpretação menos intuitiva que o MAPE tradicional',
        'Pode produzir valores entre 0-200%, enquanto MAPE é entre 0-100%',
        'Menos utilizado e reconhecido que outras métricas como MAPE e RMSE'
      ],
      suitable: [
        'Alternativa ao MAPE quando a simetria na penalização é importante',
        'Competições de forecasting (utilizado em algumas competições importantes)',
        'Comparação entre diferentes séries temporais',
        'Quando valores zeros ou próximos de zero são preocupantes no MAPE'
      ],
      unsuitable: [
        'Séries com muitos valores próximos ou iguais a zero',
        'Quando a interpretabilidade direta e simples é crucial',
        'Situações onde o padrão da indústria exige métricas mais tradicionais',
        'Quando a limitação a 200% obscurece a magnitude real dos erros',
        'Em contextos onde MAPE é o padrão da indústria'
      ]
    },
    {
      id: 'mase',
      name: 'MASE',
      formula: 'MASE = mean(|e_t|) / mean(|y_t - y_{t-m}|)',
      description: 'O Erro Absoluto Escalado Médio (MASE) compara o erro do modelo com o erro de um modelo ingênuo (naive) que simplesmente usaria o valor da observação anterior (ou da mesma estação em dados sazonais).',
      strengths: [
        'Independente de escala e aplicável a qualquer série temporal',
        'Bem definido mesmo para séries com zeros ou valores próximos de zero',
        'Penaliza erros de forma simétrica',
        'Interpretável: valores < 1 indicam modelo melhor que a previsão ingênua (naive)'
      ],
      weaknesses: [
        'Menos intuitivo que métricas percentuais para não especialistas',
        'Dependente da qualidade da previsão ingênua usada como referência',
        'Pode ser enganoso para séries com fortes tendências ou sazonalidade',
        'Menos conhecido e utilizado que medidas como RMSE e MAPE'
      ],
      suitable: [
        'Comparação entre séries temporais de diferentes escalas e unidades',
        'Séries com valores zero ou próximos de zero onde MAPE seria problemático',
        'Avaliação relativa ao benchmark mínimo (previsão ingênua)',
        'Competições de forecasting (usado em M3, M4 e outras)'
      ],
      unsuitable: [
        'Quando a interpretabilidade direta do erro é crucial',
        'Séries onde a previsão ingênua é extremamente ruim ou irrelevante',
        'Comunicação com stakeholders não técnicos familiarizados com MAPE',
        'Casos onde a magnitude absoluta do erro é mais importante que a relativa'
      ]
    },
    {
      id: 'acf',
      name: 'ACF dos Resíduos',
      formula: 'r_k = ∑(e_t × e_{t-k}) / ∑(e_t²)',
      description: 'A Função de Autocorrelação (ACF) aplicada aos resíduos examina se os erros de previsão estão correlacionados temporalmente, o que indicaria que o modelo não capturou todos os padrões nos dados.',
      strengths: [
        'Verifica se o modelo capturou toda a estrutura temporal disponível',
        'Identifica padrões não modelados nos resíduos',
        'Pode indicar a necessidade de características adicionais ou diferentes modelos',
        'Complementa métricas de erro com análise de independência dos resíduos'
      ],
      weaknesses: [
        'Não é uma única métrica, mas um conjunto de valores para diferentes defasagens',
        'Requer análise visual ou testes estatísticos adicionais (Ljung-Box)',
        'Não indica diretamente a magnitude do erro',
        'Pode ser difícil de interpretar para não especialistas'
      ],
      suitable: [
        'Diagnóstico da qualidade do modelo além da simples magnitude do erro',
        'Verificação se todos os padrões temporais foram capturados',
        'Identificação de defasagens importantes que poderiam melhorar o modelo',
        'Validação de pressupostos para inferência estatística'
      ],
      unsuitable: [
        'Como única métrica de avaliação (deve complementar outras)',
        'Comparação simplificada entre modelos diferentes',
        'Comunicação de resultados para stakeholders não técnicos',
        'Otimização direta de modelos (não é uma função objetivo única)'
      ]
    },
    {
      id: 'coverage',
      name: 'Cobertura de Intervalo de Previsão',
      formula: '% de observações reais contidas nos intervalos de previsão',
      description: 'Avalia a qualidade da quantificação de incerteza medindo a porcentagem de valores reais que caem dentro dos intervalos de previsão gerados pelo modelo.',
      strengths: [
        'Avalia a calibração da incerteza do modelo, não apenas sua precisão pontual',
        'Crucial para tomada de decisão baseada em risco',
        'Detecta intervalos muito estreitos ou muito amplos',
        'Complementa métricas de erro pontual com avaliação de incerteza'
      ],
      weaknesses: [
        'Não considera a largura dos intervalos (intervalos muito amplos são trivialmente bons)',
        'Precisa ser avaliada em conjunto com a largura média dos intervalos',
        'Requer modelos que produzam distribuições de previsão ou intervalos',
        'Mais difícil de comparar diretamente entre diferentes níveis de confiança'
      ],
      suitable: [
        'Avaliação da quantificação de incerteza em modelos probabilísticos',
        'Situações onde a confiabilidade dos intervalos é crucial para decisões',
        'Complemento a métricas de erro pontual',
        'Validação da calibração do modelo probabilístico'
      ],
      unsuitable: [
        'Como única métrica de avaliação',
        'Para modelos que não geram intervalos de previsão',
        'Quando apenas a precisão pontual é relevante',
        'Sem considerar também a largura dos intervalos'
      ]
    },
    {
      id: 'directional',
      name: 'Precisão Direcional',
      formula: '% de vezes que a direção da mudança é corretamente prevista',
      description: 'Mede a capacidade do modelo de prever corretamente a direção da mudança (aumento ou diminuição), independentemente da magnitude exata do valor previsto.',
      strengths: [
        'Foca na dinâmica qualitativa, importante em muitas aplicações financeiras',
        'Independente da escala e magnitude dos erros',
        'Facilmente interpretável como porcentagem',
        'Valiosa quando a direção da mudança é mais importante que o valor exato'
      ],
      weaknesses: [
        'Ignora completamente a magnitude dos erros',
        'Limitada para séries com tendência forte (alta precisão trivial)',
        'Não diferencia entre pequenas e grandes mudanças',
        'Pode ser enganosa se usada isoladamente'
      ],
      suitable: [
        'Previsão de mercados financeiros e trading',
        'Situações onde a direção da mudança orienta a decisão',
        'Complemento a métricas de erro tradicional',
        'Séries com alternância frequente entre aumentos e diminuições'
      ],
      unsuitable: [
        'Como única métrica de avaliação',
        'Séries com tendência forte em uma direção',
        'Quando a magnitude exata da previsão é crucial',
        'Para otimização de modelos (não é diferenciável)'
      ]
    },
    {
      id: 'wape',
      name: 'WAPE (ou MAD/Mean Ratio)',
      formula: 'WAPE = ∑|y_i - ŷ_i| / ∑|y_i|',
      description: 'O Erro Percentual Absoluto Ponderado (WAPE) ou razão MAD/Mean representa a soma dos erros absolutos dividida pela soma dos valores absolutos reais, fornecendo uma visão do erro relativo total.',
      strengths: [
        'Menos sensível a valores próximos de zero que o MAPE',
        'Dá mais peso a erros em valores maiores (ponderação natural)',
        'Bem definido mesmo quando alguns valores são zero',
        'Interpretável como percentual do volume total'
      ],
      weaknesses: [
        'Pode ocultar erros em períodos de baixo volume',
        'Não totalmente independente da escala como MAPE',
        'Menos conhecido que métricas tradicionais como MAPE e RMSE',
        'Não distingue entre erros positivos e negativos'
      ],
      suitable: [
        'Previsão de demanda e séries com forte variação de volume',
        'Quando erros em valores maiores são naturalmente mais importantes',
        'Alternativa ao MAPE para séries com valores próximos de zero',
        'Avaliação agregada de múltiplas séries temporais'
      ],
      unsuitable: [
        'Quando erros em períodos de baixo volume são igualmente importantes',
        'Se a direção do erro (positivo/negativo) é relevante',
        'Casos onde é necessário penalizar desproporcionalmente erros maiores',
        'Quando a comunicação precisa usar métricas mais estabelecidas'
      ]
    }
  ];

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Métricas Principais para Avaliação de Séries Temporais</h4>
        
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
              É recomendado utilizar múltiplas métricas para avaliar modelos de séries temporais, 
              pois cada métrica fornece uma perspectiva diferente sobre o desempenho. A escolha das 
              métricas deve considerar a natureza dos dados, a importância relativa de diferentes tipos de 
              erro, e as implicações práticas da aplicação específica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsMetrics;