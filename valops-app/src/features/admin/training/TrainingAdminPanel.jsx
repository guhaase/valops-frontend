// src/features/admin/training/TrainingAdminPanel.jsx
import React, { useState } from 'react';
import { Tabs, Tab } from '../../../components/Tabs';
import TrainingCategories from './TrainingCategories';
import TrainingMaterials from './TrainingMaterials';
import TrainingStatistics from './TrainingStatistics';

const TrainingAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [error, setError] = useState(null);

  // Manipulador seguro para mudança de tab
  const handleTabChange = (tabId) => {
    try {
      setActiveTab(tabId);
    } catch (err) {
      console.error('Erro ao mudar de aba:', err);
      setError(`Erro ao mudar de aba: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administração de Treinamentos</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <Tabs activeTab={activeTab} onChange={handleTabChange}>
        <Tab id="materials" label="Materiais">
          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded">Erro ao carregar componente de Materiais.</div>}>
            <TrainingMaterials />
          </ErrorBoundary>
        </Tab>
        <Tab id="categories" label="Categorias">
          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded">Erro ao carregar componente de Categorias.</div>}>
            <TrainingCategories />
          </ErrorBoundary>
        </Tab>
        <Tab id="statistics" label="Estatísticas">
          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded">Erro ao carregar componente de Estatísticas.</div>}>
            <TrainingStatistics />
          </ErrorBoundary>
        </Tab>
      </Tabs>
    </div>
  );
};

// Componente de Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado em ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-100 rounded">
          <h3 className="font-bold mb-2">Ocorreu um erro ao renderizar este componente</h3>
          <p className="text-sm">{this.state.error?.message || 'Erro desconhecido'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TrainingAdminPanel;