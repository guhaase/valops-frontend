// testing/ManualTestsTab.js
import React from 'react';
import { Code, CheckCircle } from 'lucide-react';

const ManualTestsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Testes Manuais</h3>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p className="mb-3">
          Os testes manuais são executados pela equipe de validação (DICOI) utilizando as ferramentas 
          Chiron e AnalyticsLabb. Estes testes complementam os automatizados, permitindo análises mais 
          específicas e verificações que requerem intervenção humana.
        </p>
        <p>
          O validador baixa os artefatos via Zagallo ou solicita ao desenvolvedor e aplica os testes
          que julgar necessários, utilizando os ambientes criativos disponíveis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Code size={20} className="text-blue-600 mr-2" />
            Chiron
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Finalidade:</p>
              <p className="text-sm text-gray-600 mt-2">
                O Chiron é um ambiente de validação manual que permite ao validador executar 
                testes específicos e verificações detalhadas do modelo.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Tipos de Testes:</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Verificação de casos extremos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Testes de cenários específicos de negócio</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Validação de comportamento com dados sintéticos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Avaliação de interpretabilidade do modelo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Code size={20} className="text-blue-600 mr-2" />
            AnalyticsLabb
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Finalidade:</p>
              <p className="text-sm text-gray-600 mt-2">
                O AnalyticsLabb oferece um ambiente criativo para testes mais complexos 
                e análises que requeiram maior flexibilidade.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Tipos de Testes:</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Avaliações aprofundadas de desempenho</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Testes personalizados para modelos específicos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Análises comparativas com outros modelos</span>
                </li>
                <li className="text-sm flex">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Verificações de qualidade de código e documentação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Processo de Testes Manuais</h4>
        
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 border-r border-gray-200 p-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-800 font-bold">1</span>
              </div>
              <p className="text-sm font-medium">Preparação</p>
              <p className="text-xs text-gray-500 mt-1">
                O validador acessa os artefatos via Zagallo ou solicita ao desenvolvedor
              </p>
            </div>
            
            <div className="w-full md:w-1/4 border-r border-gray-200 p-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-800 font-bold">2</span>
              </div>
              <p className="text-sm font-medium">Planejamento</p>
              <p className="text-xs text-gray-500 mt-1">
                Definição dos testes necessários com base no tipo de modelo
              </p>
            </div>
            
            <div className="w-full md:w-1/4 border-r border-gray-200 p-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-800 font-bold">3</span>
              </div>
              <p className="text-sm font-medium">Execução</p>
              <p className="text-xs text-gray-500 mt-1">
                Realização dos testes nos ambientes Chiron e AnalyticsLabb
              </p>
            </div>
            
            <div className="w-full md:w-1/4 p-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-800 font-bold">4</span>
              </div>
              <p className="text-sm font-medium">Documentação</p>
              <p className="text-xs text-gray-500 mt-1">
                Registro dos resultados e evidências para o processo de validação
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Documentação dos Testes Manuais</h4>
        <p className="text-sm text-gray-600 mb-3">
          Os resultados dos testes manuais são documentados e incluídos no processo de validação.
          Estes documentos incluem:
        </p>
        <ul className="space-y-2">
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Relatório detalhado dos testes executados</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Evidências de resultados e comportamentos observados</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Recomendações e apontamentos para melhorias</span>
          </li>
          <li className="text-sm flex">
            <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Avaliação qualitativa do modelo</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ManualTestsTab;