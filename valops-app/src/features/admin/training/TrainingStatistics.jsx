// src/features/admin/training/TrainingStatistics.jsx
import React, { useState, useEffect } from 'react';
import trainingService from '../../../services/trainingService';

const TrainingStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await trainingService.getTrainingStatistics();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setError(`Erro ao carregar estatísticas: ${err.response?.data?.detail || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Renderizar números formatados
  const formatNumber = (num) => {
    return num.toLocaleString('pt-BR');
  };

  // Função para determinar a classe CSS baseada na quantidade
  const getCountClass = (count) => {
    if (count > 100) return 'text-green-600';
    if (count > 50) return 'text-blue-600';
    if (count > 10) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Estatísticas Gerais */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Estatísticas de Treinamentos</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total de Materiais */}
            <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <span className="text-blue-600 text-4xl font-bold mb-2">
                {formatNumber(stats.total_materials || 0)}
              </span>
              <span className="text-gray-600 text-sm">Total de Materiais</span>
            </div>
            
            {/* Materiais Ativos */}
            <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <span className="text-green-600 text-4xl font-bold mb-2">
                {formatNumber(stats.active_materials || 0)}
              </span>
              <span className="text-gray-600 text-sm">Materiais Ativos</span>
            </div>
            
            {/* Total de Visualizações */}
            <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <span className="text-purple-600 text-4xl font-bold mb-2">
                {formatNumber(stats.total_views || 0)}
              </span>
              <span className="text-gray-600 text-sm">Visualizações</span>
            </div>
            
            {/* Total de Downloads */}
            <div className="bg-yellow-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <span className="text-yellow-600 text-4xl font-bold mb-2">
                {formatNumber(stats.total_downloads || 0)}
              </span>
              <span className="text-gray-600 text-sm">Downloads</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhuma estatística disponível.
          </p>
        )}
      </div>
      
      {/* Estatísticas por Categoria */}
      {!loading && stats && stats.by_category && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Materiais por Categoria</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Categoria</th>
                  <th className="py-3 px-6 text-center">Quantidade</th>
                  <th className="py-3 px-6 text-center">Visualizações</th>
                  <th className="py-3 px-6 text-center">Downloads</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {stats.by_category.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">{category.name}</td>
                    <td className={`py-3 px-6 text-center font-semibold ${getCountClass(category.material_count)}`}>
                      {formatNumber(category.material_count)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatNumber(category.view_count || 0)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatNumber(category.download_count || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Estatísticas por Tipo */}
      {!loading && stats && stats.by_type && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Materiais por Tipo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.by_type.map((type) => (
              <div key={type.type} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getTypeLabel(type.type)}</span>
                  <span className={`text-lg font-semibold ${getCountClass(type.count)}`}>
                    {formatNumber(type.count)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Visualizações: {formatNumber(type.view_count || 0)}</span>
                  <span>Downloads: {formatNumber(type.download_count || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Estatísticas por Nível */}
      {!loading && stats && stats.by_level && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Materiais por Nível</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.by_level.map((level) => (
              <div key={level.level} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getLevelLabel(level.level)}</span>
                  <span className={`text-lg font-semibold ${getCountClass(level.count)}`}>
                    {formatNumber(level.count)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Visualizações: {formatNumber(level.view_count || 0)}</span>
                  <span>Downloads: {formatNumber(level.download_count || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Materiais Mais Populares */}
      {!loading && stats && stats.most_viewed && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Materiais Mais Visualizados</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Título</th>
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-center">Visualizações</th>
                  <th className="py-3 px-6 text-center">Downloads</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {stats.most_viewed.map((material) => (
                  <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">
                      {material.title.length > 30 
                        ? `${material.title.substring(0, 30)}...` 
                        : material.title}
                    </td>
                    <td className="py-3 px-6">
                      {getTypeLabel(material.type)}
                    </td>
                    <td className="py-3 px-6 text-center font-semibold text-blue-600">
                      {formatNumber(material.view_count || 0)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatNumber(material.download_count || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Funções auxiliares para formatação de labels
const getTypeLabel = (type) => {
  const types = {
    'COURSE': 'Curso',
    'VIDEO': 'Vídeo',
    'ARTICLE': 'Artigo',
    'BOOK': 'Livro',
    'PRESENTATION': 'Apresentação',
    'WEBINAR': 'Webinar',
    'DOCUMENT': 'Documento',
    'OTHER': 'Outro'
  };
  return types[type] || type;
};

const getLevelLabel = (level) => {
  const levels = {
    'BASIC': 'Básico',
    'INTERMEDIATE': 'Intermediário',
    'ADVANCED': 'Avançado'
  };
  return levels[level] || level;
};

export default TrainingStatistics;