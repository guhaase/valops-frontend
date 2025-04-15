// src/models/supervised/time-series/components/TestsContent.jsx
import React from 'react';
import { Info } from 'lucide-react';
import TestsMetrics from './tests/TestsMetrics';
import TestsDetails from './tests/TestsDetails';

const TestsContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Testes para Modelos de Séries Temporais</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>
              Esta seção detalha as métricas e métodos específicos para avaliar modelos de séries temporais. 
              A validação de modelos de séries temporais requer considerações especiais devido à dependência 
              temporal dos dados, sendo fundamental preservar a ordem cronológica durante os testes e utilizar 
              métricas apropriadas para diferentes contextos de previsão.
            </p>
          </div>
        </div>
      </div>
      
      {/* Parte 1: Métricas de séries temporais */}
      <TestsMetrics />
      
      {/* Parte 2: Detalhes sobre validação e diagnóstico */}
      <TestsDetails />
    </div>
  );
};

export default TestsContent;