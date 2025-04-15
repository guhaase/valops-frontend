// src/models/supervised/clustering/components/TestsContent.jsx
import React from 'react';
import { Info } from 'lucide-react';
import TestsMetrics from './tests/TestsMetrics';
import TestsDetails from './tests/TestsDetails';

const TestsContent = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Testes para Modelos de Clustering</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>
              Esta seção detalha as métricas e testes específicos utilizados para avaliar 
              modelos de clustering. Como o clustering é uma técnica não-supervisionada, 
              as métricas de validação são diferentes das utilizadas em modelos supervisionados 
              e focam principalmente na coesão interna dos clusters e na separação entre eles.
            </p>
          </div>
        </div>
      </div>
      
      {/* Parte 1: Métricas de clustering */}
      <TestsMetrics />
      
      {/* Parte 2: Detalhes e exemplos de implementação */}
      <TestsDetails />
    </div>
  );
};

export default TestsContent;