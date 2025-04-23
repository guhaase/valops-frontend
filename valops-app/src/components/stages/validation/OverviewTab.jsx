// src/components/stages/validation/OverviewTab.jsx
import React from 'react';
import { Info, CheckCircle2, FileText, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const OverviewTab = () => {
  return (
    <div>
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Sobre a Etapa de Validação</h3>
        <p className="mb-4">
          A etapa de Validação representa o processo decisório quanto à aprovação ou não do modelo.
          Esta decisão é baseada nos resultados da etapa de Testes e pode ocorrer de forma autônoma 
          (automática) ou manual, dependendo do score obtido e dos critérios definidos pela DICOI.
        </p>
        <p>
          Quando aprovado, o modelo recebe um relatório de validação (AVL) que confirma sua 
          conformidade com os requisitos técnicos e negociais, permitindo seu avanço para a 
          implementação em produção.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">Tipos de Validação</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-green-800">Validação Autônoma</h5>
                  <p className="text-sm text-green-700 mt-1">
                    Aprovação automática baseada em critérios pré-definidos (score > 7.0)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-blue-800">Validação Manual</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Avaliação realizada pela equipe DICOI, baseada em testes automáticos e manuais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">Resultados Possíveis</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-green-800">Aprovação</h5>
                  <p className="text-sm text-green-700 mt-1">
                    O modelo atende aos requisitos e pode seguir para implementação
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-yellow-800">Aprovação com Ressalvas</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    O modelo pode ser implementado, mas há recomendações de melhorias
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-red-800">Reprovação</h5>
                  <p className="text-sm text-red-700 mt-1">
                    O modelo não atende aos requisitos e precisa de ajustes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-4">Fluxo de Validação</h4>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
            <p className="text-sm font-medium">Recebimento dos Resultados</p>
            <p className="text-xs text-gray-500 mt-1">Testes automatizados e manuais</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
            <p className="text-sm font-medium">Avaliação de Critérios</p>
            <p className="text-xs text-gray-500 mt-1">Score > 7.0 = Autônoma</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
            <p className="text-sm font-medium">Decisão de Validação</p>
            <p className="text-xs text-gray-500 mt-1">Autônoma ou Manual</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
            <p className="text-sm font-medium">Geração do AVL</p>
            <p className="text-xs text-gray-500 mt-1">Relatório de validação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;