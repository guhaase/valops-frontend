// src/models/supervised/dimensionality-reduction/components/TestsContent.jsx
import React from 'react';
import { Info } from 'lucide-react';
import TestsMetrics from './tests/TestsMetrics';
import TestsDetails from './tests/TestsDetails';

const TestsContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Testes para Técnicas de Redução de Dimensionalidade</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>
              Esta seção detalha as métricas e testes específicos utilizados para avaliar 
              técnicas de redução de dimensionalidade. A avaliação adequada é essencial para
              garantir que a representação reduzida preserve as informações relevantes dos dados originais.
            </p>
          </div>
        </div>
      </div>
      
      {/* Parte 1: Métricas de avaliação */}
      <TestsMetrics />
      
      {/* Parte 2: Detalhes e exemplos de implementação */}
      <TestsDetails />
    </div>
  );
};

export default TestsContent;