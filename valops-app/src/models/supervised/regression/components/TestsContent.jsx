// src/models/supervised/regression/components/TestsContent.jsx
import React from 'react';
import { Info } from 'lucide-react';
// Corrigindo o caminho de importação - usando caminho relativo simples sem extensão
import { TestsMetrics, TestsDetails } from './tests/index';

const TestsContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Testes para Modelos de Regressão</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>
              Esta seção detalha as métricas e testes específicos utilizados para avaliar 
              modelos de regressão. A escolha adequada das métricas de avaliação é essencial 
              para avaliar corretamente o desempenho do modelo no contexto do problema sendo resolvido.
            </p>
          </div>
        </div>
      </div>
      
      {/* Parte 1: Métricas de regressão */}
      <TestsMetrics />
      
      {/* Parte 2: Detalhes e exemplos de implementação */}
      <TestsDetails />
    </div>
  );
};

export default TestsContent;