// src/models/supervised/time-series/components/OverviewContent.jsx
import React from 'react';
import { Book, BarChart2, Target, CheckCircle2 } from 'lucide-react';

const OverviewContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Modelos de Séries Temporais</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="mb-4">
          Modelos de séries temporais são algoritmos projetados para analisar dados ordenados sequencialmente 
          no tempo, identificando padrões, tendências, sazonalidade e outras características temporais. 
          Estes modelos são fundamentais para previsão (forecasting), detecção de anomalias 
          e compreensão de fenômenos que evoluem ao longo do tempo.
        </p>
        <p>
          As séries temporais são utilizadas em diversos domínios como finanças (previsão de preços de ações), 
          meteorologia (previsão do tempo), economia (projeção de indicadores), medicina (monitoramento de sinais vitais), 
          indústria (manutenção preditiva), entre muitos outros. A natureza sequencial e dependente do tempo 
          desses dados requer abordagens especializadas.
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
              <span>Prever valores futuros com base em observações passadas</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Identificar e modelar padrões temporais (tendências, sazonalidade, ciclos)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Detectar anomalias ou mudanças estruturais na série</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Compreender relações temporais entre diferentes variáveis</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Estabelecer intervalos de confiança para previsões</span>
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
              <span>Dependência temporal e autocorrelação dos dados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Tratamento de sazonalidade em diferentes escalas</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Mudanças estruturais e não-estacionariedade</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Dados ausentes e irregularmente espaçados</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Validação de modelos preservando ordem temporal</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Escolha do horizonte de previsão adequado</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Tipos de Análise de Séries Temporais</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Análise de Componentes</h5>
            <p className="text-sm text-gray-600">
              Decompõe a série temporal em componentes como tendência, sazonalidade, 
              ciclos e resíduos (componente aleatório), permitindo entender as forças 
              que impulsionam os dados.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Previsão (Forecasting)</h5>
            <p className="text-sm text-gray-600">
              Estima valores futuros da série com base em padrões históricos, 
              utilizando horizonte de curto, médio ou longo prazo dependendo 
              da aplicação desejada.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Detecção de Anomalias</h5>
            <p className="text-sm text-gray-600">
              Identifica pontos ou períodos que diferem significativamente do comportamento 
              esperado da série, indicando eventos incomuns que merecem investigação.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-2">Análise Causal</h5>
            <p className="text-sm text-gray-600">
              Examina relações de causa-efeito entre diferentes séries temporais, 
              identificando variáveis exógenas que podem influenciar a série principal.
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
            <h5 className="font-medium text-gray-800 mb-1">Estacionariedade</h5>
            <p className="text-sm text-gray-600">
              Propriedade em que as características estatísticas (média, variância, autocorrelação) 
              da série não mudam ao longo do tempo. Muitos modelos estatísticos requerem 
              estacionariedade, sendo necessário transformar séries não-estacionárias.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Autocorrelação</h5>
            <p className="text-sm text-gray-600">
              Correlação de uma série com versões defasadas de si mesma. A função de autocorrelação (ACF) 
              e a função de autocorrelação parcial (PACF) são ferramentas fundamentais para 
              identificar padrões temporais e selecionar modelos apropriados.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Sazonalidade</h5>
            <p className="text-sm text-gray-600">
              Padrões recorrentes que ocorrem em intervalos regulares (diários, semanais, mensais, anuais). 
              A análise e modelagem adequada da sazonalidade é crucial para muitas séries temporais 
              em domínios como vendas, energia e clima.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Validação Temporal</h5>
            <p className="text-sm text-gray-600">
              Estratégias de validação que respeitam a ordem cronológica dos dados, como 
              validação temporal (treinar com dados antigos, testar com dados recentes) ou 
              validação cruzada de séries temporais, preservando a dependência temporal.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <h5 className="font-medium text-gray-800 mb-1">Métricas de Erro Específicas</h5>
            <p className="text-sm text-gray-600">
              Métricas como MAPE (Erro Percentual Absoluto Médio), RMSE (Erro Quadrático Médio) e 
              MAE (Erro Absoluto Médio), que avaliam a qualidade de previsões considerando 
              diferentes aspectos como escala, outliers e interpretabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;