import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Video, File, Book, Award, Star, 
  Tag, Eye, Download, AlertTriangle, Clock, Calendar 
} from 'lucide-react';
import trainingService from '../../services/trainingService';

const TrainingMaterialsList = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const pageSize = 8; // Número de itens por página
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar dados em paralelo
      const [
        materialsResponse, 
        categoriesData, 
        tagsData,
        featuredData,
        statsData
      ] = await Promise.all([
        trainingService.getMaterials({
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
          category: selectedCategory || undefined,
          level: selectedLevel || undefined,
          type: selectedType || undefined,
          tag: selectedTag || undefined
        }),
        trainingService.getAllCategories(),
        trainingService.getTrainingTags(),
        trainingService.getFeaturedMaterials(4),
        trainingService.getTrainingStatistics()
      ]);
      
      // Processar dados
      setMaterials(materialsResponse.items || []);
      setTotalPages(materialsResponse.pagination?.totalPages || 1);
      setTotalItems(materialsResponse.pagination?.totalItems || 0);
      setCategories(categoriesData || []);
      setTags(tagsData || []);
      setFeaturedMaterials(featuredData || []);
      setStatistics(statsData || {});
      
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar materiais de treinamento. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery, selectedCategory, selectedLevel, selectedType, selectedTag]);
  
  const handleMaterialClick = (materialId) => {
    navigate(`/testing/training/material/${materialId}`);
  };
  
  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <File className="w-5 h-5 text-blue-500" />;
      case 'book':
        return <Book className="w-5 h-5 text-blue-500" />;
      case 'course':
        return <Award className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-blue-500" />;
    }
  };
  
  const getLevelBadge = (level) => {
    let bgColor = 'bg-blue-100 text-blue-800';
    let text = 'Intermediário';
    
    switch(level?.toLowerCase()) {
      case 'beginner':
        bgColor = 'bg-green-100 text-green-800';
        text = 'Iniciante';
        break;
      case 'intermediate':
        bgColor = 'bg-blue-100 text-blue-800';
        text = 'Intermediário';
        break;
      case 'advanced':
        bgColor = 'bg-purple-100 text-purple-800';
        text = 'Avançado';
        break;
      default:
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {text}
      </span>
    );
  };
  
  const renderFeaturedMaterials = () => {
    if (!featuredMaterials.length) return null;
    
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredMaterials.map(material => (
            <div 
              key={material.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMaterialClick(material.id)}
            >
              {material.thumbnail ? (
                <div className="h-40 bg-gray-100 relative">
                  <img 
                    src={material.thumbnail ? (material.thumbnail.startsWith('http') ? material.thumbnail : `/api/training/media/${material.id}/imagem/thumbnail.png`) : `/api/training/media/${material.id}/imagem/thumbnail.png`} 
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getLevelBadge(material.level)}
                  </div>
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                  {getTypeIcon(material.type)}
                  <div className="absolute top-2 right-2">
                    {getLevelBadge(material.level)}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  {getTypeIcon(material.type)}
                  <span className="ml-1 capitalize">
                    {material.type === 'video' ? 'Vídeo' : 
                     material.type === 'document' ? 'Documento' :
                     material.type === 'book' ? 'E-book' :
                     material.type === 'course' ? 'Curso' : 'Material'
                    }
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{material.title}</h3>
                
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="ml-1">{material.rating || 0}</span>
                  <span className="mx-2">•</span>
                  <Eye className="w-4 h-4" />
                  <span className="ml-1">{material.view_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderFilters = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar materiais..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            {/* Categoria */}
            <select
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            {/* Nível */}
            <select
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Todos os níveis</option>
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
            
{/* Tipo */}
<select
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="video">Vídeos</option>
              <option value="document">Documentos</option>
              <option value="book">E-books</option>
              <option value="course">Cursos</option>
            </select>
            
            {/* Tags (se houver muitas, considere um componente de seleção mais avançado) */}
            {tags.length > 0 && (
              <select
                className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Todas as tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderMaterialsList = () => {
    if (loading && materials.length === 0) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error && materials.length === 0) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar materiais</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (materials.length === 0) {
      return (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <AlertTriangle className="h-6 w-6 text-gray-600" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Nenhum material encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            Não encontramos nenhum material de treinamento com os critérios selecionados.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLevel('');
                setSelectedType('');
                setSelectedTag('');
                setCurrentPage(1);
              }}
            >
              Limpar filtros
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Materiais de Treinamento 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({totalItems} {totalItems === 1 ? 'resultado' : 'resultados'})
            </span>
          </h2>
          
          <div className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map(material => (
            <div 
              key={material.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleMaterialClick(material.id)}
            >
              {material.thumbnail ? (
                <div className="h-40 bg-gray-100 relative">
                  <img 
                    src={material.thumbnail ? (material.thumbnail.startsWith('http') ? material.thumbnail : `/api/training/media/${material.id}/imagem/thumbnail.png`) : `/api/training/media/${material.id}/imagem/thumbnail.png`} 
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  {material.type === 'video' && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="rounded-full bg-white bg-opacity-80 p-2">
                        <Video className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                  <div className="rounded-full bg-white p-3 shadow-md">
                    {getTypeIcon(material.type)}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 flex items-center">
                    {getTypeIcon(material.type)}
                    <span className="ml-1 capitalize">
                      {material.type === 'video' ? 'Vídeo' : 
                       material.type === 'document' ? 'Documento' :
                       material.type === 'book' ? 'E-book' :
                       material.type === 'course' ? 'Curso' : 'Material'
                      }
                    </span>
                  </span>
                  {getLevelBadge(material.level)}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{material.title}</h3>
                
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{material.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {material.tags && Array.isArray(material.tags) && material.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span className="ml-1">{material.rating || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4" />
                      <span className="ml-1">{material.view_count || 0}</span>
                    </div>
                    
                    {material.download_count > 0 && (
                      <div className="flex items-center">
                        <Download className="w-4 h-4" />
                        <span className="ml-1">{material.download_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Números de página */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Cálculo para mostrar páginas relevantes quando há muitas
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                // Mostrar reticências para páginas omitidas
                if (totalPages > 5) {
                  if (i === 0 && pageNum > 1) {
                    return (
                      <button
                        key="start-ellipsis"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </button>
                    );
                  }
                  
                  if (i === 4 && pageNum < totalPages) {
                    return (
                      <button
                        key="end-ellipsis"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </button>
                    );
                  }
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <span className="sr-only">Próxima</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    );
  };
  
  const renderStatistics = () => {
    if (!statistics) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <File className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Materiais
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statistics.total_materials || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cursos Disponíveis
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statistics.total_courses || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Horas de Conteúdo
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statistics.video_content_hours || 0}h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Star className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avaliação Média
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statistics.average_rating ? statistics.average_rating.toFixed(1) : '0.0'}/5
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Treinamentos</h1>
        </div>
        
        {renderStatistics()}
        
        {renderFeaturedMaterials()}
        
        {renderFilters()}
        
        {renderMaterialsList()}
      </div>
    </div>
  );
};

export default TrainingMaterialsList;