import React, { useState, useEffect, useRef } from 'react';
import { Download, FileDown, Upload, X, Tag, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import config, { log } from '../../config'; // Importar configurações
import apiHelper from '../../services/apiService'; // Importar serviço de API

/**
 * ExamplesList - Componente para exibir e gerenciar notebooks de exemplo para modelos de classificação
 */
const ExamplesList = () => {
  // Estados principais
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: ''
  });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagSearchRef = useRef(null);
  
  // State para filtragem
  const [filterTags, setFilterTags] = useState([]);
  const [showFilterSuggestions, setShowFilterSuggestions] = useState(false);
  const [filterTagSearch, setFilterTagSearch] = useState('');
  const filterSearchRef = useRef(null);

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const notebooksPerPage = 5;

  // Função para obter matrícula do localStorage
  const getMatricula = () => {
    return localStorage.getItem(config.storage.matriculaKey);
  };

  // Função para buscar notebooks
  const fetchNotebooks = async () => {
    try {
      setLoading(true);
      
      // Construir os parâmetros de filtro
      const params = {
        // Adicionar filtro para categoria de Classificação
        category_id: 1,
        subcategory_id: 1
      };
      
      // Adicionar tags para filtrar, se houver
      if (filterTags.length > 0) {
        params.tag = filterTags[0].name;
      }
      
      log.debug("Buscando notebooks com parâmetros:", params);
      
      // Usar o serviço de API para buscar notebooks
      const data = await apiHelper.notebooks.getAll(params);
      setNotebooks(data);
      
      // Calcular total de páginas
      setTotalPages(Math.ceil(data.length / notebooksPerPage));
    } catch (error) {
      log.error("Erro ao buscar notebooks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar categorias
  const fetchCategories = async () => {
    try {
      const data = await apiHelper.categories.getAll();
      setCategories(data);
      log.debug("Categorias carregadas:", data);
      return data;
    } catch (error) {
      log.error("Erro ao buscar categorias:", error);
      return [];
    }
  };
    
  // Função para carregar subcategorias
  const fetchSubcategories = async (categoryId = null) => {
    try {
      const data = await apiHelper.subcategories.getAll(categoryId);
      setSubcategories(data);
      log.debug("Subcategorias carregadas:", data);
      return data;
    } catch (error) {
      log.error("Erro ao buscar subcategorias:", error);
      return [];
    }
  };
  
  // Função para carregar tags
  const fetchTags = async () => {
    try {
      const data = await apiHelper.tags.getAll();
      setAllTags(data);
      log.debug("Tags carregadas:", data.length);
      return data;
    } catch (error) {
      log.error("Erro ao buscar tags:", error);
      return [];
    }
  };
  
  useEffect(() => {
    // Função para buscar dados iniciais
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carregar todas as necessárias em paralelo
        await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchTags(),
          fetchNotebooks()
        ]);
        
      } catch (error) {
        log.error("Erro ao buscar dados:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efeito para filtrar quando os filtros mudam
  useEffect(() => {
    fetchNotebooks();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTags]);

  // Click outside handler para os dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagSearchRef.current && !tagSearchRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
      if (filterSearchRef.current && !filterSearchRef.current.contains(event.target)) {
        setShowFilterSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para download de notebook
  const downloadNotebook = async (notebookId) => {
    try {
      const mtrc = getMatricula();
      if (!mtrc) {
        alert('Você precisa estar autenticado para baixar notebooks.');
        return;
      }
      
      // Usar o serviço para baixar o notebook
      const blob = await apiHelper.notebooks.download(notebookId);
      
      // Criar objeto URL para o blob e iniciar download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notebook_${notebookId}.ipynb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      log.error("Erro ao baixar notebook:", error);
      alert(`Erro ao baixar: ${error.message}`);
    }
  };

  // Função para filtrar subcategorias
  const getFilteredSubcategories = () => {
    if (!formData.category_id) return [];
    return subcategories.filter(
      sub => sub.parent_category_id === parseInt(formData.category_id)
    );
  };
  
  // Função para preparar o modal de upload
  const prepareUploadModal = async () => {
    try {
      // Se não temos categorias ou subcategorias, carregá-las novamente
      if (categories.length === 0) {
        await fetchCategories();
      }
      
      if (subcategories.length === 0) {
        await fetchSubcategories();
      }
      
      if (allTags.length === 0) {
        await fetchTags();
      }
      
      // Abrir o modal
      setShowUploadModal(true);
    } catch (error) {
      log.error("Erro ao preparar modal de upload:", error);
      alert("Não foi possível carregar as categorias e subcategorias. Tente novamente.");
    }
  };

  // Função para filtrar tags para upload
  const getFilteredTags = () => {
    if (!searchTag.trim()) return [];
    
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
      !selectedTags.some(selectedTag => selectedTag.id === tag.id)
    ).slice(0, 10);
  };

  // Função para filtrar tags para o filtro de busca
  const getFilterTagSuggestions = () => {
    if (!filterTagSearch.trim()) return [];
    
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(filterTagSearch.toLowerCase()) &&
      !filterTags.some(selectedTag => selectedTag.id === tag.id)
    ).slice(0, 10);
  };

  // Função para adicionar tag ao filtro
  const addFilterTag = (tag) => {
    if (!filterTags.some(t => t.id === tag.id)) {
      setFilterTags([...filterTags, tag]);
    }
    setFilterTagSearch('');
    setShowFilterSuggestions(false);
  };

  // Função para remover tag do filtro
  const removeFilterTag = (tagId) => {
    setFilterTags(filterTags.filter(tag => tag.id !== tagId));
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterTags([]);
  };

  // Função para adicionar tag ao upload
  const addTag = (tag) => {
    if (selectedTags.length >= 4) {
      alert('Máximo de 4 tags permitidas');
      return;
    }
    
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    
    setSearchTag('');
    setShowTagSuggestions(false);
  };

  // Função para remover tag do upload
  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  // Função para tratar mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Se a categoria mudou, atualizar subcategorias
    if (name === 'category_id' && value) {
      fetchSubcategories(parseInt(value));
      // Limpar subcategoria selecionada quando categoria muda
      setFormData(prev => ({
        ...prev,
        subcategory_id: ''
      }));
    }
  };

  const checkNotebookNameExists = async (name) => {
    try {
      // Buscar todos os notebooks para verificar se o nome já existe
      const allNotebooks = await apiHelper.notebooks.getAll();
      
      // Verificar se existe algum notebook com o mesmo nome (case-insensitive)
      return allNotebooks.some(notebook => 
        notebook.name.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      log.error("Erro ao verificar nome do notebook:", error);
      // Em caso de erro, assumimos que o nome não existe para não bloquear o usuário
      return false;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFile || !formData.name) {
      alert('Por favor, selecione um arquivo e forneça um nome para o notebook.');
      return;
    }
    
    // Verificar se o nome já existe
    const nameExists = await checkNotebookNameExists(formData.name);
    if (nameExists) {
      alert('Já existe um notebook com este nome. Por favor, escolha um nome diferente.');
      return;
    }
    
    // Verificar matrícula
    const mtrc = getMatricula();
    if (!mtrc) {
      alert('Você precisa estar autenticado para enviar notebooks.');
      return;
    }
    
    setUploading(true);
    
    try {
      // Fazer upload do arquivo
      const fileData = await apiHelper.upload.file(uploadFile);
      
      // Preparar os dados do notebook
      const notebookData = {
        name: formData.name,
        path: fileData.filepath,
        description: formData.description || "",
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        tags: selectedTags.map(tag => tag.name)
      };
      
      // Criar notebook
      await apiHelper.notebooks.create(notebookData);
      
      // Resetar formulário
      setFormData({
        name: '',
        description: '',
        category_id: '',
        subcategory_id: ''
      });
      setUploadFile(null);
      setSelectedTags([]);
      setShowUploadModal(false);
      
      // Recarregar notebooks
      await fetchNotebooks();
      
      alert('Notebook adicionado com sucesso!');
    } catch (error) {
      log.error("Erro ao criar notebook:", error);
      
      // Verificar se é um erro de nome duplicado
      if (error.message && error.message.includes("Duplicate entry") && error.message.includes("notebooks.name")) {
        alert('Já existe um notebook com este nome. Por favor, escolha um nome diferente.');
      } else {
        alert(`Erro ao criar notebook: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderNotebooks = () => {
    if (notebooks.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-600">Nenhum notebook de exemplo encontrado.</p>
          
          {filterTags.length > 0 && (
            <p className="text-gray-500 mt-2">
              Tente remover alguns filtros ou selecionar tags diferentes.
            </p>
          )}
        </div>
      );
    }

    // Calcular notebooks para a página atual
    const indexOfLastNotebook = currentPage * notebooksPerPage;
    const indexOfFirstNotebook = indexOfLastNotebook - notebooksPerPage;
    const currentNotebooks = notebooks.slice(indexOfFirstNotebook, indexOfLastNotebook);

    return (
      <>
        {currentNotebooks.map(notebook => (
          <div key={notebook.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FileDown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-blue-800">{notebook.name}</h4>
                  {/* Mostrar informações do funcionário se estiverem disponíveis */}
                  {notebook.employee && (
                    <span className="text-xs text-green-600 italic">
                      {notebook.employee.mtrc} - {notebook.employee.nome || "Sem nome"}
                      {notebook.created_at && (
                        <> • {new Date(notebook.created_at).toLocaleString()}</>
                      )}
                    </span>
                  )}
                </div>
                
                <p className="mt-1 text-sm text-gray-700">
                  {notebook.description || "Sem descrição disponível"}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {notebook.tags && notebook.tags.length > 0 && notebook.tags.map(tag => (
                    <span key={tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                      <Tag size={12} className="mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {notebook.category && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {notebook.category.name}
                      </span>
                    )}
                    {notebook.subcategory && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        {notebook.subcategory.name}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => downloadNotebook(notebook.id)}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Paginação */}
        {notebooks.length > notebooksPerPage && (
          <div className="flex justify-between items-center mt-6 px-2">
            <div className="text-sm text-gray-600">
              Mostrando {indexOfFirstNotebook + 1}-{Math.min(indexOfLastNotebook, notebooks.length)} de {notebooks.length} notebooks
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Botões de página */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  let pageNum = currentPage;
                  if (currentPage < 3) {
                    pageNum = index + 1;
                  } else if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Exemplos de Notebooks para Validação</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileDown className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>
              Esta seção contém notebooks Jupyter com exemplos práticos para validação de modelos de classificação.
              Estes exemplos incluem casos de uso reais, métricas específicas para diferentes tipos de classificadores,
              e boas práticas para testes e validação. Os notebooks podem ser baixados e executados localmente para
              auxiliar no processo de validação de seus próprios modelos.
            </p>
          </div>
        </div>
      </div>
      
      {/* Seção de filtros por tags */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Filter className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-700">Filtrar por Tags</h4>
          
          {filterTags.length > 0 && (
            <button 
              onClick={clearFilters}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700"
            >
              Limpar filtros
            </button>
          )}
        </div>
        
        {/* Tags selecionadas para filtro */}
        <div className="flex flex-wrap gap-2 mb-3">
          {filterTags.map(tag => (
            <div key={tag.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
              <Tag size={14} className="mr-1" />
              <span>{tag.name}</span>
              <button 
                onClick={() => removeFilterTag(tag.id)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        {/* Input para pesquisar tags para filtro */}
        <div className="relative" ref={filterSearchRef}>
          <div className="flex items-center border rounded overflow-hidden bg-white">
            <div className="pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar tags para filtrar..."
              className="w-full py-2 px-1 focus:outline-none text-sm"
              value={filterTagSearch}
              onChange={(e) => {
                setFilterTagSearch(e.target.value);
                setShowFilterSuggestions(true);
              }}
              onFocus={() => setShowFilterSuggestions(true)}
            />
          </div>
          
          {/* Dropdown com sugestões de tags para filtro */}
          {showFilterSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {getFilterTagSuggestions().length > 0 ? (
                getFilterTagSuggestions().map(tag => (
                  <div
                    key={tag.id}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center"
                    onClick={() => addFilterTag(tag)}
                  >
                    <Tag size={14} className="mr-2 text-blue-600" />
                    <span>{tag.name}</span>
                  </div>
                ))
              ) : filterTagSearch ? (
                <div className="px-3 py-2 text-gray-500">Nenhuma tag encontrada</div>
              ) : (
                <div className="px-3 py-2 text-gray-500">Digite para buscar tags</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Carregando exemplos de notebooks...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-600">
          <p>Erro ao carregar notebooks: {error}</p>
          <p className="text-sm mt-2">Verifique se a API está funcionando corretamente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {renderNotebooks()}
        </div>
      )}
      
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Novos exemplos são adicionados regularmente com base nos casos de uso mais comuns.
          </p>
          <button 
            onClick={prepareUploadModal}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload de Notebook</h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Notebook</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  name="category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                <select
                  name="subcategory_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.subcategory_id}
                  onChange={handleInputChange}
                  disabled={!formData.category_id}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {getFilteredSubcategories().map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (máximo 4)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tag => (
                    <div key={tag.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                      <span>{tag.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag.id)}
                        className="ml-1 text-blue-400 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="relative" ref={tagSearchRef}>
                  <div className="flex items-center border rounded overflow-hidden">
                    <div className="pl-3">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border-0 focus:outline-none"
                      placeholder="Digite para buscar tags"
                      value={searchTag}
                      onChange={(e) => {
                        setSearchTag(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      disabled={selectedTags.length >= 4}
                    />
                  </div>
                  
                  {showTagSuggestions && searchTag.trim() && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {getFilteredTags().length > 0 ? (
                        getFilteredTags().map(tag => (
                          <div
                            key={tag.id}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                            onClick={() => addTag(tag)}
                          >
                            <div className="flex items-center">
                              <Tag size={14} className="mr-2 text-blue-600" />
                              <span>{tag.name}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">Nenhuma tag encontrada</div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedTags.length}/4 tags selecionadas
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo</label>
                <input
                  type="file"
                  accept=".ipynb,.py,.md"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formatos aceitos: .ipynb, .py, .md
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled={uploading}
                >
                  {uploading ? 'Enviando...' : 'Enviar Arquivo'}
                </button>
              </div>
              </form>
                        </div>
                      </div>
                    )}
                    </div>
                    );
};

export default ExamplesList;