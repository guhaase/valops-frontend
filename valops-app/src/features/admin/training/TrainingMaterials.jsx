// src/features/admin/training/TrainingMaterials.jsx
import React, { useState, useEffect } from 'react';
import trainingService from '../../../services/trainingService';
import MaterialForm from './MaterialForm';

const TrainingMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    page_size: 10
  });
  const [totalItems, setTotalItems] = useState(0);
  const [tags, setTags] = useState([]);

  // Carregar os dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Carregar em paralelo
        const [materialsData, categoriesData, tagsData] = await Promise.all([
          trainingService.getMaterials(filters),
          trainingService.getAllCategories(),
          trainingService.getTrainingTags()
        ]);
        
        setMaterials(materialsData.items || materialsData);
        setTotalItems(materialsData.total || materialsData.length);
        setCategories(categoriesData);
        setTags(tagsData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        setError(`Erro ao carregar dados: ${err.response?.data?.detail || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [filters]);

  // Manipulação de alterações no filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // Manipulação de paginação
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Abrir formulário para novo material
  const handleNewMaterial = () => {
    setSelectedMaterial(null);
    setShowForm(true);
  };

  // Abrir formulário para editar um material
  const handleEditMaterial = async (materialId) => {
    try {
      setLoading(true);
      const materialData = await trainingService.getMaterialDetails(materialId);
      setSelectedMaterial(materialData);
      setShowForm(true);
    } catch (err) {
      console.error('Erro ao carregar detalhes do material:', err);
      setError(`Erro ao carregar detalhes: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Excluir um material
  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Tem certeza que deseja excluir este material de treinamento?')) {
      try {
        setLoading(true);
        await trainingService.deleteMaterial(materialId);
        
        // Atualizar a lista de materiais
        setMaterials(prev => prev.filter(material => material.id !== materialId));
        setError(null);
      } catch (err) {
        console.error('Erro ao excluir material:', err);
        setError(`Erro ao excluir material: ${err.response?.data?.detail || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Salvar um material (novo ou editado)
  const handleSaveMaterial = async (materialData) => {
    try {
      setLoading(true);
      
      let result;
      
      if (selectedMaterial) {
        // Atualizar material existente
        result = await trainingService.updateMaterial(selectedMaterial.id, materialData);
        
        // Atualizar a lista de materiais
        setMaterials(prev => 
          prev.map(item => item.id === selectedMaterial.id ? result : item)
        );
      } else {
        // Criar novo material
        result = await trainingService.createMaterial(materialData);
        
        // Adicionar à lista de materiais se estiver na mesma página/filtro
        setMaterials(prev => [result, ...prev]);
      }
      
      setShowForm(false);
      setSelectedMaterial(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao salvar material:', err);
      setError(`Erro ao salvar material: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obter o nível em formato legível
  const getLevelLabel = (level) => {
    const levels = {
      'BASIC': 'Básico',
      'INTERMEDIATE': 'Intermediário',
      'ADVANCED': 'Avançado'
    };
    return levels[level] || level;
  };

  // Obter o tipo em formato legível
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

  // Obter o nome da categoria
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '-';
  };

  return (
    <div className="space-y-8">
      {showForm ? (
        <MaterialForm
          material={selectedMaterial}
          categories={categories}
          tags={tags}
          onSave={handleSaveMaterial}
          onCancel={() => {
            setShowForm(false);
            setSelectedMaterial(null);
          }}
          loading={loading}
        />
      ) : (
        <>
          {/* Filtros e ações */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Materiais de Treinamento</h2>
              <button
                onClick={handleNewMaterial}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Novo Material
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Título, autor ou descrição"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Lista de materiais */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : materials.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum material encontrado com os filtros atuais.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-4 text-left">Título</th>
                        <th className="py-3 px-4 text-left">Tipo</th>
                        <th className="py-3 px-4 text-left">Categoria</th>
                        <th className="py-3 px-4 text-left">Nível</th>
                        <th className="py-3 px-4 text-left">Autor</th>
                        <th className="py-3 px-4 text-center">Data</th>
                        <th className="py-3 px-4 text-center">Ativo</th>
                        <th className="py-3 px-4 text-center">Destaque</th>
                        <th className="py-3 px-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {materials.map((material) => (
                        <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">
                            {material.title.length > 30 
                              ? `${material.title.substring(0, 30)}...` 
                              : material.title}
                          </td>
                          <td className="py-3 px-4">
                            {getTypeLabel(material.type)}
                          </td>
                          <td className="py-3 px-4">
                            {getCategoryName(material.category_id)}
                          </td>
                          <td className="py-3 px-4">
                            {getLevelLabel(material.level)}
                          </td>
                          <td className="py-3 px-4">
                            {material.author}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {new Date(material.publish_date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`py-1 px-3 rounded-full text-xs ${
                              material.is_active 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {material.is_active ? 'Sim' : 'Não'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`py-1 px-3 rounded-full text-xs ${
                              material.is_featured 
                                ? 'bg-purple-200 text-purple-800' 
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                              {material.is_featured ? 'Sim' : 'Não'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleEditMaterial(material.id)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={loading}
                            >
                              Excluir
                            </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Paginação */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Exibindo {materials.length} de {totalItems} materiais
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                      disabled={filters.page <= 1 || loading}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={materials.length < filters.page_size || loading}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingMaterials;