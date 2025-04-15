// src/models/supervised/classification/ClassificationModels.jsx
import React, { useState } from 'react';
import OverviewContent from './components/OverviewContent';
import ArticlesList from './components/ArticlesList';
import MainModels from './components/MainModels';
import TestsContent from './components/TestsContent';
import ExamplesList from './components/ExamplesList';


const ClassificationModels = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Navegação de abas */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === 'articles'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Artigos
          </button>
          
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === 'models'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Principais Modelos
          </button>
          
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === 'tests'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas
          </button>
          
          <button
            onClick={() => setActiveTab('examples')}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === 'examples'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Exemplos
          </button>
        </nav>
      </div>
      
      {/* Conteúdo das abas */}
      <div className="mt-4">
        {activeTab === 'overview' && <OverviewContent />}
        {activeTab === 'articles' && <ArticlesList />}
        {activeTab === 'models' && <MainModels />}
        {activeTab === 'tests' && <TestsContent />}
        {activeTab === 'examples' && <ExamplesList />}
      </div>
    </div>
  );
};

export default ClassificationModels;
