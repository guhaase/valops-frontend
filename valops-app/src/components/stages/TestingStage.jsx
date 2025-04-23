// TestingStage.js
import React, { useState } from 'react';
import { ArrowLeft, Info, BarChart3, PlayCircle, CheckSquare, BookOpen, GraduationCap } from 'lucide-react';
import OverviewTab from '../testing/OverviewTab';
import AutomatedTestsTab from '../testing/AutomatedTestsTab';
import ManualTestsTab from '../testing/ManualTestsTab';
import MetricsTab from '../testing/MetricsTab';
import InventoryTab from '../testing/InventoryTab';
import TrainingTab from '../testing/TrainingTab';

const TestingStage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          <h2 className="text-2xl font-bold text-blue-800">Etapa de Testes</h2>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Etapa 4
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Info size={16} className="mr-2" />
              Visão Geral
            </div>
          </button>
          <button
            onClick={() => setActiveTab('automated')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'automated'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <PlayCircle size={16} className="mr-2" />
              Testes Automatizados
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'manual'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <CheckSquare size={16} className="mr-2" />
              Testes Manuais
            </div>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BookOpen size={16} className="mr-2" />
              Inventário de Testes
            </div>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <GraduationCap size={16} className="mr-2" />
              Treinamento
            </div>
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BarChart3 size={16} className="mr-2" />
              Métricas
            </div>
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="p-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'automated' && <AutomatedTestsTab />}
        {activeTab === 'manual' && <ManualTestsTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'metrics' && <MetricsTab />}
      </div>
    </div>
  );
};

export default TestingStage;