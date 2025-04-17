import React, { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, Video, FileText, Download, ExternalLink, Play, Clock, Tag, Star, Plus, Filter, BookOpenCheck, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import trainingService from '../../services/trainingService';

const TrainingTab = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState({
    total_materials: 0,
    video_content_hours: 0,
    total_courses: 0,
    average_rating: 0,
    total_views: 0,
    total_downloads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    dateRange: '',
    minRating: ''
  });
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1, 
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Função para obter o ícone adequado para cada categoria
  const getIconForCategory = useCallback((categoryId, iconName) => {
    switch (categoryId) {
      case 'videos':
        return <Video size={16} className="mr-2" />;
      case 'books':
        return <BookOpen size={16} className="mr-2" />;
      case 'docs':
        return <FileText size={16} className="mr-2" />;
      case 'courses':
        return <BookOpenCheck size={16} className="mr-2" />;
      default:
        return null;
    }
  }, []);
  
  // Função que carrega todos os dados necessários
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Categorias default para caso a API falhe
      const defaultCategories = [
        { id: 'all', name: 'Todos', icon: null },
        { id: 'videos', name: 'Vídeos', icon: getIconForCategory('videos') },
        { id: 'docs', name: 'Documentação', icon: getIconForCategory('docs') },
        { id: 'books', name: 'Livros', icon: getIconForCategory('books') },
        { id: 'courses', name: 'Cursos', icon: getIconForCategory('courses') }
      ];
      
      // Carregar categorias
      try {
        console.log('Tentando carregar categorias da API...');
        const categoriesResponse = await trainingService.getCategories();
        console.log('Categorias recebidas:', categoriesResponse);
        
        // Adicionar categoria "Todos" e usar as categorias da API
        if (Array.isArray(categoriesResponse) && categoriesResponse.length > 0) {
          const allCategories = [
            { id: 'all', name: 'Todos', icon: null },
            ...categoriesResponse.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: getIconForCategory(cat.id, cat.icon)
            }))
          ];
          setCategories(allCategories);
        } else {
          console.warn('Resposta de categorias vazia, usando categorias padrão');
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        // Usar categorias default em caso de erro
        setCategories(defaultCategories);
        
        // Se não conseguirmos carregar categorias, ainda tentamos carregar materiais
        console.warn('Usando categorias padrão devido a erro na API');
      }
      
      // Carregar materiais com filtros aplicados
      try {
        const materialsResponse = await trainingService.getMaterials({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery || undefined,
          level: filters.level || undefined,
          date_range: filters.dateRange || undefined,
          min_rating: filters.minRating || undefined,
          page: page,
          page_size: 10
        });
        
        if (materialsResponse && materialsResponse.items) {
          setMaterials(materialsResponse.items);
          setPagination(materialsResponse.pagination || {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0
          });
        } else {
          // Se não houver uma resposta válida, usamos um array vazio
          setMaterials([]);
          setPagination({
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0
          });
          console.warn('Resposta de materiais inválida:', materialsResponse);
        }
      } catch (err) {
        console.error('Erro ao carregar materiais:', err);
        setMaterials([]);
        setPagination({
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0
        });
        throw new Error('Falha ao carregar materiais de treinamento');
      }
      
      // Carregar estatísticas
      try {
        const statsResponse = await trainingService.getStatistics();
        if (statsResponse) {
          setStatistics(statsResponse);
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        // Não interromper o fluxo por falha nas estatísticas
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados de treinamento:', err);
      setError(err.message || 'Não foi possível carregar os materiais de treinamento. Tente novamente mais tarde.');
      setLoading(false);
    }
  }, [activeCategory, searchQuery, filters, page, getIconForCategory]);

  // Carregar dados ao montar componente ou quando os filtros mudarem
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Atualizar filtros
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Voltar para a primeira página ao mudar filtros
    setPage(1);
  };
  
  // Aplicar todos os filtros de uma vez
  const applyFilters = () => {
    fetchData();
  };
  
  // Registrar visualização ou download
  const trackUsage = async (id, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      
      await trainingService.trackUsage(id, action);
      
      // Atualizar estatísticas localmente (opcional)
      if (action === 'view') {
        setStatistics(prev => ({
          ...prev,
          total_views: (prev.total_views || 0) + 1
        }));
      } else if (action === 'download') {
        setStatistics(prev => ({
          ...prev,
          total_downloads: (prev.total_downloads || 0) + 1
        }));
      }
      
      setActionLoading(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error(`Erro ao registrar ${action}:`, err);
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Dados dos materiais de treinamento vindos da API
  const trainingMaterials = loading ? [] : materials;
  
  // Usar diretamente os materiais da API com tratamento para quando estiver vazio
  const filteredMaterials = loading ? [] : trainingMaterials;

  // Funções para renderizar os cards de materiais por tipo
  const renderVideoCard = (material) => {
    const isLoading = actionLoading[material.id] || false;
    // Construir URL da thumbnail e adicionar log para debug
    console.log(`Material original:`, material);
    
    // Usar o caminho direto para as imagens
    const thumbnailUrl = `/treinamentos/${material.id}/imagem/thumbnail.png`;
    
    
    const handleWatch = async () => {
      await trackUsage(material.id, 'view');
      // Se o título contiver "Robustez", vamos para a página de detalhes da robustez
      if (material.title && material.title.includes("Robustez")) {
        navigate('/testing/training/material/robustez');
      } else if (material.id) {
        navigate(`/testing/training/material/${material.id}`);
      } else {
        window.open(material.url, '_blank');
      }
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <div className="relative cursor-pointer" onClick={handleWatch}>
          <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt={material.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button 
                className="p-3 bg-blue-600 text-white rounded-full"
                disabled={isLoading}
              >
                {isLoading ? 
                  <Loader size={24} className="animate-spin" /> : 
                  <Play size={24} />
                }
              </button>
            </div>
          </div>
          {material.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded flex items-center">
              <Clock size={12} className="mr-1" />
              {material.duration}
            </div>
          )}
        </div>
        <div className="p-4 flex-grow cursor-pointer" onClick={handleWatch}>
          <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="mr-4">{material.author}</span>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
              <span>{material.rating || 0}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {material.tags && material.tags.map(tag => (
              <span key={typeof tag === 'string' ? tag : tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Adicionado: {new Date(material.publish_date || material.date).toLocaleDateString()}
            </span>
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleWatch}
              disabled={isLoading}
            >
              {isLoading ? 
                <Loader size={12} className="animate-spin mr-1" /> : 
                <ExternalLink size={12} className="mr-1" />
              }
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBookCard = (material) => {
    const isLoading = actionLoading[material.id] || false;
    console.log(`Book material:`, material);
    
    // Usar o caminho direto para as imagens
    const thumbnailUrl = `/treinamentos/${material.id}/imagem/thumbnail.png`;
    
    const handleViewDetails = async () => {
      await trackUsage(material.id, 'view');
      navigate(`/testing/training/material/${material.id}`);
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 flex cursor-pointer" onClick={handleViewDetails}>
          <div className="flex-shrink-0 mr-4 w-20">
            <img 
              src={thumbnailUrl} 
              alt={material.title}
              className="w-full rounded"
              onError={(e) => {
                console.error(`Erro ao carregar imagem: ${thumbnailUrl}`);
                e.target.src = 'https://via.placeholder.com/100x150.png?text=Book';
              }}
              onLoad={() => console.log(`Imagem carregada com sucesso: ${thumbnailUrl}`)}
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span className="mr-3">{material.author}</span>
              {material.pages && <span className="mr-3">{material.pages} páginas</span>}
              <div className="flex items-center">
                <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
                <span>{material.rating || 0}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {material.tags && material.tags.map(tag => (
                <span key={typeof tag === 'string' ? tag : tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 p-3 bg-gray-50 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Nível: {material.level}</span>
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleViewDetails}
              disabled={isLoading}
            >
              {isLoading ? 
                <Loader size={12} className="animate-spin mr-1" /> : 
                <ExternalLink size={12} className="mr-1" />
              }
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentCard = (material) => {
    const isLoading = actionLoading[material.id] || false;
    
    const handleViewDetails = async () => {
      await trackUsage(material.id, 'view');
      navigate(`/testing/training/material/${material.id}`);
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <div className="border-b border-gray-100 p-3 bg-gray-50 flex items-center">
          <FileText size={20} className="text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Documentação</span>
        </div>
        <div className="p-4 flex-grow cursor-pointer" onClick={handleViewDetails}>
          <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{material.description}</p>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="mr-3">{material.author}</span>
            {material.pages && <span className="mr-3">{material.pages} páginas</span>}
            <div className="flex items-center">
              <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
              <span>{material.rating || 0}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {material.tags && material.tags.map(tag => (
              <span key={typeof tag === 'string' ? tag : tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Atualizado: {new Date(material.publish_date || material.date).toLocaleDateString()}
            </span>
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleViewDetails}
              disabled={isLoading}
            >
              {isLoading ? 
                <Loader size={12} className="animate-spin mr-1" /> : 
                <ExternalLink size={12} className="mr-1" />
              }
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCourseCard = (material) => {
    const isLoading = actionLoading[material.id] || false;
    
    const handleViewDetails = async () => {
      await trackUsage(material.id, 'view');
      navigate(`/testing/training/material/${material.id}`);
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <div className="border-b border-gray-100 p-3 bg-blue-50 flex items-center">
          <BookOpenCheck size={18} className="text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-700">Curso</span>
        </div>
        <div className="p-4 flex-grow cursor-pointer" onClick={handleViewDetails}>
          <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {material.lessons && (
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="text-blue-700 font-medium">{material.lessons}</div>
                <div className="text-xs text-gray-500">Lições</div>
              </div>
            )}
            {material.duration && (
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="text-blue-700 font-medium">{material.duration}</div>
                <div className="text-xs text-gray-500">Duração</div>
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="mr-3">Por: {material.author}</span>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
              <span>{material.rating || 0}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {material.tags && material.tags.map(tag => (
              <span key={typeof tag === 'string' ? tag : tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Nível: {material.level}</span>
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleViewDetails}
              disabled={isLoading}
            >
              {isLoading ? 
                <Loader size={12} className="animate-spin mr-1" /> : 
                <ExternalLink size={12} className="mr-1" />
              }
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Função para renderizar o card correto com base no tipo
  const renderMaterialCard = (material) => {
    if (!material) return null;
    
    switch (material.type) {
      case 'VIDEO':
      case 'video':
        return renderVideoCard(material);
      case 'BOOK':
      case 'book':
        return renderBookCard(material);
      case 'DOCUMENT':
      case 'document':
        return renderDocumentCard(material);
      case 'COURSE':
      case 'course':
        return renderCourseCard(material);
      default:
        // Fallback para o tipo mais próximo se o tipo não for reconhecido
        console.warn(`Tipo de material não reconhecido: ${material.type}`);
        return renderDocumentCard(material);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Material de Treinamento</h3>
        <p className="text-gray-600">
          Acesse vídeos, documentos, livros e cursos para aprender mais sobre testes de modelos de machine learning.
        </p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar material de treinamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Filtros expandidos (opcional) */}
      {filterOpen && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3">Filtros Avançados</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="">Todos os níveis</option>
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="">Qualquer data</option>
                <option value="LAST_WEEK">Última semana</option>
                <option value="LAST_MONTH">Último mês</option>
                <option value="LAST_YEAR">Último ano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classificação</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Qualquer classificação</option>
                <option value="4">4+ estrelas</option>
                <option value="3">3+ estrelas</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-400"
              onClick={applyFilters}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={14} className="inline mr-2 animate-spin" />
                  Aplicando...
                </>
              ) : (
                'Aplicar Filtros'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tabs de categorias */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`pb-4 px-1 font-medium text-sm whitespace-nowrap flex items-center ${
                activeCategory === category.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Grid de materiais */}
      {!loading && !error && filteredMaterials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(material => (
              <div key={material.id}>
                {renderMaterialCard(material)}
              </div>
            ))}
          </div>
          
          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <nav className="flex items-center space-x-2">
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Anterior
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    // Mostrar: a primeira página, a última página, 
                    // a página atual e as duas páginas adjacentes
                    return p === 1 || 
                      p === pagination.totalPages ||
                      Math.abs(p - page) <= 1;
                  })
                  .map((p, index, array) => {
                    // Adicionar elipses quando necessário
                    if (index > 0 && array[index - 1] !== p - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${p}`}>
                          <span className="px-3 py-1 text-gray-500">...</span>
                          <button
                            onClick={() => setPage(p)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              page === p
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                
                <button 
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages || loading}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Próxima
                </button>
              </nav>
            </div>
          )}
        </>
      ) : !loading && !error ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum material encontrado</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Não encontramos materiais que correspondam aos seus critérios de busca. Tente ajustar os filtros ou a busca.
          </p>
        </div>
      ) : null}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader size={30} className="text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Carregando materiais de treinamento...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar materiais</h3>
          <p className="text-red-700 max-w-md mx-auto mb-4">
            {error}
          </p>
          <div className="space-x-3">
            <button 
              onClick={fetchData} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
            <button 
              onClick={() => {
                setFilters({
                  level: '',
                  dateRange: '',
                  minRating: ''
                });
                setActiveCategory('all');
                setSearchQuery('');
                setPage(1);
              }} 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-700">Estatísticas de Treinamento</h4>
          {loading && (
            <div className="text-sm text-gray-500 flex items-center">
              <Loader size={12} className="mr-2 animate-spin text-blue-500" />
              Atualizando estatísticas...
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center shadow-sm">
            <div className="text-xl font-bold text-blue-700">
              {statistics.total_materials !== undefined ? statistics.total_materials : '-'}
            </div>
            <div className="text-sm text-gray-600">Materiais Disponíveis</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center shadow-sm">
            <div className="text-xl font-bold text-green-600">
              {statistics.video_content_hours !== undefined ? 
                `${statistics.video_content_hours}h` : '-'}
            </div>
            <div className="text-sm text-gray-600">Conteúdo em Vídeo</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center shadow-sm">
            <div className="text-xl font-bold text-purple-600">
              {statistics.total_courses !== undefined ? statistics.total_courses : '-'}
            </div>
            <div className="text-sm text-gray-600">Cursos Completos</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center shadow-sm">
            <div className="text-xl font-bold text-yellow-600">
              {statistics.average_rating !== undefined ?
                parseFloat(statistics.average_rating).toFixed(1) : '-'}
            </div>
            <div className="text-sm text-gray-600">Classificação Média</div>
          </div>
        </div>
        
        {/* Estatísticas adicionais (opcional) */}
        {(statistics.total_views !== undefined || statistics.total_downloads !== undefined) && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
              <div className="text-xl font-bold text-indigo-600">
                {statistics.total_views !== undefined ? statistics.total_views : '-'}
              </div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg text-center shadow-sm">
              <div className="text-xl font-bold text-pink-600">
                {statistics.total_downloads !== undefined ? statistics.total_downloads : '-'}
              </div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingTab;