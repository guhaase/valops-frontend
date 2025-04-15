import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, Plus, Filter, Tag, X, Search } from 'lucide-react';
import { useTagSelection } from '../../hooks/useTagSelection';
import { useFileUpload } from '../../hooks/useFileUpload';
import config, { log } from '../../config'; // Importar configurações centralizadas
import apiHelper from '../../services/apiService';
import TagSelector from '../common/TagSelector';
import SearchFilter from '../common/SearchFilter';
import FileUpload from '../common/FileUpload';

/**
 * Componente genérico para listagem e gerenciamento de notebooks
 */
const NotebookList = () => {
  // Estados principais
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estados para filtros
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Hooks personalizados
  const { 
    tags: allTags,
    selectedTags: filterTags,
    addTag: addFilterTag,
    removeTag: removeFilterTag,
    clearTags: clearFilters
  } = useTagSelection();

  const {
    tags: selectedTags,
    addTag,
    removeTag,
    searchTag,
    setSearchTag,
    showTagSuggestions,
    setShowTagSuggestions,
    getFilteredTags,
    tagSearchRef
  } = useTagSelection();

  const {
    file: uploadFile,
    handleFileChange,
    resetFile
  } = useFileUpload(['.ipynb', '.py', '.md']);

  // Estado do formulário de novo notebook
  const [newNotebook, setNewNotebook] = useState({
    name: '',
    description: '',
    category_id: null,
    subcategory_id: null
  });

  // Estado de upload
  const [uploading, setUploading] = useState(false);

  // Função para obter matrícula do localStorage
  const getMatricula = () => {
    return localStorage.getItem(config.storage.matriculaKey);
  };

  // Carregamento inicial de dados
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Garantir que a matrícula está aplicada
        const mtrc = getMatricula();
        if (mtrc) {
          log.debug('Matrícula encontrada, garantindo headers atualizados');
          // Verificar se a função existe no apiHelper
          if (typeof apiHelper.auth.refreshAuthHeaders === 'function') {
            apiHelper.auth.refreshAuthHeaders();
          } else {
            // Fallback manual
            log.debug('Aplicando matrícula manualmente aos headers');
            apiHelper.apiService.defaults.headers.common['X-Employee-MTRC'] = mtrc;
          }
        }
        
        // Carregar categorias, subcategorias e tags
        const [catData, subData, tagsData] = await Promise.all([
          apiHelper.categories.getAll(),
          apiHelper.subcategories.getAll(),
          apiHelper.tags.getAll()
        ]);
        
        setCategories(catData);
        setSubcategories(subData);
        
        // Buscar notebooks
        await loadNotebooks();
      } catch (error) {
        log.error("Erro ao carregar dados iniciais:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Efeito para filtrar os notebooks quando os filtros mudam
  useEffect(() => {
    loadNotebooks();
    setCurrentPage(1); // Reset da página ao mudar filtros
  }, [selectedCategory, selectedSubcategory, filterTags]);

  // Efeito para atualizar subcategorias filtradas
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        sub => sub.parent_category_id === parseInt(selectedCategory)
      );
      setFilteredSubcategories(filtered);
      
      // Resetar subcategoria se não for válida
      if (selectedSubcategory) {
        const stillValid = filtered.some(
          sub => sub.id === parseInt(selectedSubcategory)
        );
        if (!stillValid) {
          setSelectedSubcategory(null);
        }
      }
    } else {
      setFilteredSubcategories([]);
      setSelectedSubcategory(null);
    }
  }, [selectedCategory, subcategories, selectedSubcategory]);

  // Função para carregar notebooks com filtros
  const loadNotebooks = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedSubcategory) params.subcategory_id = selectedSubcategory;
      
      if (filterTags.length > 0) {
        // A API suporta apenas uma tag por vez, então vamos usar a primeira
        params.tag = filterTags[0].name;
      }
      
      // Log para debug antes da chamada
      log.debug('Buscando notebooks com params:', params);
      
      const data = await apiHelper.notebooks.getAll(params);
      log.debug('Notebooks carregados:', data);
      setNotebooks(data);
      
      // Calcular total de páginas
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      log.error("Erro ao carregar notebooks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com mudanças de filtro
  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setSelectedCategory(value === '' ? null : value);
    } else if (type === 'subcategory') {
      setSelectedSubcategory(value === '' ? null : value);
    }
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      alert('Por favor, selecione um arquivo para upload.');
      return;
    }

    if (!newNotebook.category_id || newNotebook.category_id === '' || 
        !newNotebook.subcategory_id || newNotebook.subcategory_id === '') {
      alert('Por favor, preencha os campos obrigatórios: categoria e subcategoria.');
      return;
    }
  
    try {
      setUploading(true);
      
      // Verificar matrícula antes de enviar
      const mtrc = getMatricula();
      if (!mtrc) {
        throw new Error('Você não está autenticado. Faça login novamente.');
      }
      
      log.debug('Iniciando upload - Matrícula presente:', mtrc ? 'Sim' : 'Não');
      
      // PASSO 1: Fazer upload do arquivo primeiro
      const fileData = await apiHelper.upload.file(uploadFile);
      log.debug('Arquivo enviado com sucesso:', fileData);
      
      // PASSO 2: Agora que temos o caminho, criar o notebook
      const categoryId = newNotebook.category_id ? parseInt(newNotebook.category_id) : null;
      const subcategoryId = newNotebook.subcategory_id ? parseInt(newNotebook.subcategory_id) : null;
      
      // Verificação adicional antes de criar o notebook
      if (!categoryId || !subcategoryId || isNaN(categoryId) || isNaN(subcategoryId)) {
        throw new Error('Categoria e subcategoria são campos obrigatórios e devem ser valores válidos.');
      }
      
      const notebookData = {
        name: newNotebook.name,
        // IMPORTANTE: Usar o caminho que foi retornado pelo upload
        path: fileData.filepath,
        description: newNotebook.description,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        tags: selectedTags.map(tag => tag.name)
      };
      
      log.debug('Criando notebook com dados:', notebookData);
      
      const notebookResult = await apiHelper.notebooks.create(notebookData);
      log.debug('Notebook criado com sucesso:', notebookResult);
      
      // Resetar formulário e atualizar lista
      resetForm();
      await loadNotebooks();
      
      alert('Notebook criado com sucesso!');
    } catch (error) {
      log.error('Erro completo:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }; 

  // Função para resetar formulário
  const resetForm = () => {
    setNewNotebook({
      name: '',
      description: '',
      category_id: null,
      subcategory_id: null
    });
    
    // Limpar tags selecionadas
    if (selectedTags && Array.isArray(selectedTags)) {
      selectedTags.length = 0;
    }
    
    resetFile();
    setShowAddModal(false);
  };

  // Função para fazer download de notebook
  const handleDownload = async (notebookId) => {
    try {
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
      
      log.debug('Download concluído com sucesso');
    } catch (error) {
      log.error(`Erro ao baixar notebook ${notebookId}:`, error);
      alert("Erro ao baixar o notebook: " + error.message);
    }
  };

  // Função para mudar página
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotebook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calcular notebooks a exibir na página atual
  const displayedNotebooks = notebooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Renderização de mensagem de carregamento
  if (loading && notebooks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renderização de mensagem de erro
  if (error && notebooks.length === 0) {
    return <div className="bg-red-100 p-4 rounded text-red-700">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notebooks</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Notebook
        </button>
      </div>
  
      {/* Filtros */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <Filter className="w-4 h-4 mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          
          {(selectedCategory || selectedSubcategory || filterTags.length > 0) && (
            <button 
              className="ml-auto text-sm text-gray-500 hover:text-gray-700"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro de subcategoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubcategory || ''}
              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">Todas as Subcategorias</option>
              {filteredSubcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro de tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <TagSelector 
              selectedTags={filterTags}
              addTag={addFilterTag}
              removeTag={removeFilterTag}
              allTags={allTags}
            />
          </div>
        </div>
      </div>
  
      {/* Lista de notebooks */}
      {displayedNotebooks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum notebook encontrado</h3>
          <p className="text-gray-500">Tente alterar seus filtros ou adicionar um novo notebook.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotebooks.map(notebook => (
            <div key={notebook.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{notebook.name}</h3>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleDownload(notebook.id)}
                  aria-label="Download notebook"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
              
              {/* Mostrar informações do funcionário se estiverem disponíveis */}
              {notebook.employee && (
                <div className="flex justify-end mb-2">
                  <span className="text-xs text-green-600 italic">
                    {notebook.employee.mtrc} - {notebook.employee.nome || "Sem nome"}
                    {notebook.created_at && (
                      <> • {new Date(notebook.created_at).toLocaleString()}</>
                    )}
                  </span>
                </div>
              )}
              
              <p className="text-gray-600 mb-3 text-sm">{notebook.description}</p>
              
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 block mb-1">Categoria:</span>
                <span className="inline-block bg-gray-200 rounded px-2 py-1 text-xs">
                  {notebook.category ? notebook.category.name : 'Não especificada'}
                </span>
                {notebook.subcategory && (
                  <span className="inline-block bg-gray-200 rounded px-2 py-1 text-xs ml-2">
                    {notebook.subcategory.name}
                  </span>
                )}
              </div>
              
              {notebook.tags && notebook.tags.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500 block mb-1">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {notebook.tags.map(tag => (
                      <span key={tag.id} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mx-1 p-2 rounded ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'
              }`}
            >
              Anterior
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`mx-1 p-2 rounded ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'
              }`}
            >
              Próxima
            </button>
          </nav>
        </div>
      )}

      {/* Modal de adição de notebook */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adicionar Novo Notebook</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={newNotebook.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="description"
                  value={newNotebook.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  name="category_id"
                  value={newNotebook.category_id || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria *</label>
                <select
                  name="subcategory_id"
                  value={newNotebook.subcategory_id || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  disabled={!newNotebook.category_id}
                  required
                >
                  <option value="" disabled>Selecione uma subcategoria</option>
                  {subcategories
                    .filter(sub => sub.parent_category_id === parseInt(newNotebook.category_id))
                    .map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))
                  }
                </select>
              </div>
              
              {/* Seletor de tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (máximo 4)
                </label>
                
                <TagSelector 
                  selectedTags={selectedTags}
                  addTag={addTag}
                  removeTag={removeTag}
                  allTags={allTags}
                  maxTags={4}
                />
              </div>
              
              {/* Upload de arquivo */}
              <div className="mb-6">
                <FileUpload 
                  handleFileChange={handleFileChange}
                  allowedFileTypes={['.ipynb', '.py', '.md']}
                  label="Selecione um arquivo"
                  required={true}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddModal(false)}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={uploading}
                >
                  {uploading ? 'Enviando...' : 'Enviar Notebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookList;