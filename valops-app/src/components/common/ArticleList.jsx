import React, { useState, useEffect, useRef } from 'react';
import { FileText, ExternalLink, Clock, User, BookOpen, Upload, Download, X, Tag, Search, Filter, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import config, { log } from '../../config'; // Importar configurações
import apiHelper from '../../services/apiService'; // Importar serviço de API

/**
 * ArticleList - Componente para exibir e gerenciar artigos científicos
 */
const ArticleList = ({ 
  title = "Artigos Relevantes", 
  description = "Lista de artigos relevantes sobre este tema",
  initialFilterTags = [],
  categoryFilter = null,
  subcategoryFilter = null,
  onArticleDownload = null
}) => {
  // Estados principais
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    publisher: '',
    abstract: '',
    abstract_short: '', // Campo para resumo curto (opcional)
    url: '',
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
  
  // State para filtragem - garantir que initialFilterTags seja um array
  const [filterTags, setFilterTags] = useState(Array.isArray(initialFilterTags) ? initialFilterTags : []);
  const [showFilterSuggestions, setShowFilterSuggestions] = useState(false);
  const [filterTagSearch, setFilterTagSearch] = useState('');
  const filterSearchRef = useRef(null);

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 5;

  // Estados para a análise automática de PDFs
  const [analyzingPdf, setAnalyzingPdf] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [pdfAnalyzed, setPdfAnalyzed] = useState(false);

  // Função para obter matrícula do localStorage
  const getMatricula = () => {
    return localStorage.getItem(config.storage.matriculaKey);
  };

  // Função para buscar artigos
  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // Construir os parâmetros de filtro
      const params = {};
      
      // Adicionar filtros de categoria e subcategoria, se fornecidos
      if (categoryFilter) {
        params.category_id = categoryFilter;
      }
      
      if (subcategoryFilter) {
        params.subcategory_id = subcategoryFilter;
      }
      
      // Limitação atual da API: só aceita uma tag por vez
      // Usar apenas a primeira tag selecionada para filtrar
      if (Array.isArray(filterTags) && filterTags.length > 0) {
        params.tag = filterTags[0].name;
        
        // Aviso se houver mais tags selecionadas (opcional)
        if (filterTags.length > 1) {
          log.warn("API suporta apenas uma tag para filtro. Usando apenas:", filterTags[0].name);
        }
      }
      
      log.debug("Buscando artigos com parâmetros:", params);
      
      // Usar o serviço de API para buscar artigos
      const data = await apiHelper.articles.getAll(params);
      setArticles(data);
      
      // Calcular total de páginas
      setTotalPages(Math.ceil(data.length / articlesPerPage));
    } catch (error) {
      log.error("Erro ao buscar artigos:", error);
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
      // Garantir que data é um array antes de definir no estado
      if (Array.isArray(data)) {
        setAllTags(data);
        log.debug("Tags carregadas:", data.length);
      } else {
        log.error("Dados de tags recebidos não são um array:", data);
        setAllTags([]);
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      log.error("Erro ao buscar tags:", error);
      setAllTags([]);
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
          fetchArticles()
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
    fetchArticles();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTags, categoryFilter, subcategoryFilter]);

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

  // Função para download de artigo
  const downloadArticle = async (articleId) => {
    if (onArticleDownload) {
      onArticleDownload(articleId);
      return;
    }
    
    try {
      const mtrc = getMatricula();
      if (!mtrc) {
        alert('Você precisa estar autenticado para baixar artigos.');
        return;
      }
      
      // Usar o serviço para baixar o artigo
      const blob = await apiHelper.articles.download(articleId);
      
      // Criar objeto URL para o blob e iniciar download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `article_${articleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      log.error("Erro ao baixar artigo:", error);
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
      
      // Resetar estados relacionados à análise de PDF
      setAnalysisResult(null);
      setAnalysisError(null);
      setPdfAnalyzed(false);
      
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
    if (!Array.isArray(allTags)) return [];
    if (!Array.isArray(selectedTags)) return [];
    
    return allTags.filter(tag => 
      tag.name && tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
      !selectedTags.some(selectedTag => selectedTag.id === tag.id)
    ).slice(0, 10);
  };

  // Função para filtrar tags para o filtro de busca
  const getFilterTagSuggestions = () => {
    if (!filterTagSearch.trim()) return [];
    if (!Array.isArray(allTags)) return [];
    if (!Array.isArray(filterTags)) return [];
    
    return allTags.filter(tag => 
      tag.name && tag.name.toLowerCase().includes(filterTagSearch.toLowerCase()) &&
      !filterTags.some(selectedTag => selectedTag.id === tag.id)
    ).slice(0, 10);
  };

  // Função para adicionar tag ao filtro
  const addFilterTag = (tag) => {
    if (!Array.isArray(filterTags)) {
      setFilterTags([tag]);
    } else if (!filterTags.some(t => t.id === tag.id)) {
      setFilterTags([...filterTags, tag]);
    }
    setFilterTagSearch('');
    setShowFilterSuggestions(false);
  };

  // Função para remover tag do filtro
  const removeFilterTag = (tagId) => {
    if (!Array.isArray(filterTags)) {
      setFilterTags([]);
      return;
    }
    setFilterTags(filterTags.filter(tag => tag.id !== tagId));
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterTags([]);
  };

  // Função para adicionar tag ao upload
  const addTag = (tag) => {
    if (!Array.isArray(selectedTags)) {
      setSelectedTags([tag]);
      setSearchTag('');
      setShowTagSuggestions(false);
      return;
    }
    
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
    if (!Array.isArray(selectedTags)) {
      setSelectedTags([]);
      return;
    }
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  // Função para encontrar ou criar tags a partir de nomes
  const findOrCreateTagsFromNames = async (tagNames) => {
    // Verificar se tagNames existe e garantir que seja um array
    if (!tagNames) return [];
    
    // Converter para array se não for um
    const tagNamesArray = Array.isArray(tagNames) ? tagNames : [tagNames];
    
    if (tagNamesArray.length === 0) return [];
    
    // Verificar se allTags é um array antes de usar filter
    if (!Array.isArray(allTags)) {
      console.error("allTags não é um array:", allTags);
      return [];
    }
    
    // Primeiro, verificar quais tags já existem
    const existingTags = allTags.filter(tag => 
      tagNamesArray.some(name => name.toLowerCase() === tag.name.toLowerCase())
    );
    
    // Para as tags que não existem, criar temporariamente
    const newTagNames = tagNamesArray.filter(name => 
      !existingTags.some(tag => tag.name.toLowerCase() === name.toLowerCase())
    );
    
    // Retornar todas as tags (existentes e novas)
    return [...existingTags, ...newTagNames.map(name => ({ 
      id: `temp-${Date.now()}-${name}`, 
      name 
    }))];
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
  
  // Nova função para analisar o PDF automaticamente
  const analyzePdf = async () => {
    if (!uploadFile) {
      alert('Por favor, selecione um arquivo PDF primeiro.');
      return;
    }
    
    if (!uploadFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Por favor, selecione um arquivo PDF para análise.');
      return;
    }
    
    setAnalyzingPdf(true);
    setAnalysisError(null);
    
    try {
      // Usar o serviço para analisar o PDF
      const result = await apiHelper.articles.analyzePdf(uploadFile);
      log.debug("Resultado da análise:", result);
      
      // Verificar se o resultado está em formato de string JSON
      let parsedResult = result;
      
      // Se temos raw_analysis, precisamos extrair o JSON de dentro
      if (result && typeof result === 'object' && result.raw_analysis) {
        try {
          // Primeiro verificar se é um JSON string contendo código markdown
          const jsonMatch = result.raw_analysis.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            // Extrair o JSON de dentro do bloco de código markdown
            parsedResult = JSON.parse(jsonMatch[1]);
            log.debug("JSON extraído de markdown:", parsedResult);
          } else {
            // Tentar parsear diretamente como JSON
            parsedResult = JSON.parse(result.raw_analysis);
            log.debug("JSON extraído diretamente:", parsedResult);
          }
        } catch (e) {
          log.error("Erro ao parsear resultado da análise:", e);
          parsedResult = result; // Manter o resultado original em caso de erro
        }
      }
      
      setAnalysisResult(parsedResult);
      
      // Preencher o formulário com os dados extraídos
      const extractedData = {
        title: parsedResult.title || '',
        authors: parsedResult.authors || '',
        year: parsedResult.year || new Date().getFullYear(),
        publisher: parsedResult.publisher || '',
        abstract: parsedResult.abstract || '',
        abstract_short: parsedResult.abstract_short || '',
        url: parsedResult.url || '',
        category_id: parsedResult.category_id?.toString() || '',
        subcategory_id: parsedResult.subcategory_id?.toString() || ''
      };
      
      setFormData(extractedData);
      
      // Se houver keywords/tags, processar e adicionar
      if (parsedResult.keywords) {
        // Garantir que temos um array de keywords
        let keywordsArray = [];
        
        if (Array.isArray(parsedResult.keywords)) {
          // Se já for um array, usar diretamente
          keywordsArray = parsedResult.keywords;
        } else if (typeof parsedResult.keywords === 'string') {
          // Se for string, dividir por vírgulas
          keywordsArray = parsedResult.keywords.split(',').map(k => k.trim());
        } else {
          // Para outros casos, tentar converter para string e depois para array
          try {
            const keywordStr = String(parsedResult.keywords);
            keywordsArray = keywordStr.split(',').map(k => k.trim());
          } catch (e) {
            log.error("Erro ao processar keywords:", e);
            keywordsArray = [];
          }
        }
        
        // Remover valores vazios e limitar a 4 tags
        keywordsArray = keywordsArray.filter(k => k && k.trim().length > 0).slice(0, 4);
        
        if (keywordsArray.length > 0) {
          const processedTags = await findOrCreateTagsFromNames(keywordsArray);
          setSelectedTags(processedTags);
        }
      }
      
      setPdfAnalyzed(true);
    } catch (error) {
      log.error("Erro ao analisar PDF:", error);
      setAnalysisError(error.message);
    } finally {
      setAnalyzingPdf(false);
    }
  };

  const checkArticleTitleExists = async (title) => {
    try {
      // Buscar todos os artigos para verificar se o título já existe
      const allArticles = await apiHelper.articles.getAll();
      
      // Verificar se existe algum artigo com o mesmo título (case-insensitive)
      return allArticles.some(article => 
        article.title.toLowerCase() === title.toLowerCase()
      );
    } catch (error) {
      log.error("Erro ao verificar título do artigo:", error);
      // Em caso de erro, assumimos que o título não existe para não bloquear o usuário
      return false;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.year || !formData.category_id || !formData.subcategory_id) {
      alert('Por favor, preencha os campos obrigatórios: título, ano, categoria e subcategoria.');
      return;
    }
    
    // Verificar se o título já existe
    const titleExists = await checkArticleTitleExists(formData.title);
    if (titleExists) {
      alert('Já existe um artigo com este título. Por favor, escolha um título diferente.');
      return;
    }
    
    // Verificar matrícula
    const mtrc = getMatricula();
    if (!mtrc) {
      alert('Você precisa estar autenticado para enviar artigos.');
      return;
    }
    
    setUploading(true);
    
    try {
      // Criar FormData para upload do arquivo
      const formDataObj = new FormData();
      
      // Adicionar campos do formulário
      formDataObj.append('title', formData.title);
      formDataObj.append('authors', formData.authors);
      formDataObj.append('year', formData.year);
      formDataObj.append('publisher', formData.publisher);
      
      if (formData.abstract) {
        formDataObj.append('abstract', formData.abstract);
      }
      
      if (formData.abstract_short) {
        formDataObj.append('abstract_short', formData.abstract_short);
      }
      
      if (formData.url) {
        formDataObj.append('url', formData.url);
      }
      
      if (formData.category_id) {
        formDataObj.append('category_id', formData.category_id);
      }
      
      if (formData.subcategory_id) {
        formDataObj.append('subcategory_id', formData.subcategory_id);
      }
      
      // Adicionar tags
      if (selectedTags.length > 0) {
        // Converter tags para JSON string
        const tagsJson = JSON.stringify(selectedTags.map(tag => tag.name));
        formDataObj.append('tags', tagsJson);
      }
      
      // Adicionar arquivo se houver
      if (uploadFile) {
        formDataObj.append('file', uploadFile);
      }
      
      // Garantir que a matrícula está nos headers
      const mtrc = getMatricula();
      if (!mtrc) {
        alert('Você precisa estar autenticado para enviar artigos.');
        return;
      }
      
      // Configurar os headers corretos
      const headers = {
        'Content-Type': 'multipart/form-data',
        'X-Employee-MTRC': mtrc
      };
      
      // Usar o serviço para criar o artigo
      await apiHelper.articles.create(formDataObj);
      
      // Resetar formulário
      setFormData({
        title: '',
        authors: '',
        year: new Date().getFullYear(),
        publisher: '',
        abstract: '',
        abstract_short: '',
        url: '',
        category_id: '',
        subcategory_id: ''
      });
      setUploadFile(null);
      setSelectedTags([]);
      setPdfAnalyzed(false);
      setAnalysisResult(null);
      setShowUploadModal(false);
      
      // Recarregar artigos
      await fetchArticles();
      
      // Mostrar mensagem de sucesso com a matrícula
      const date = new Date();
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      alert(`Artigo adicionado com sucesso!\nMatrícula: ${mtrc}\nData: ${formattedDate}`);
    } catch (error) {
      log.error("Erro ao criar artigo:", error);
      
      // Verificar se é um erro de título duplicado
      if (error.message && error.message.includes("Duplicate entry") && error.message.includes("title")) {
        alert('Já existe um artigo com este título. Por favor, escolha um título diferente.');
      } else {
        alert(`Erro ao criar artigo: ${error.message}`);
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

  const renderArticles = () => {
    if (articles.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-600">Nenhum artigo encontrado.</p>
          
          {Array.isArray(filterTags) && filterTags.length > 0 && (
            <p className="text-gray-500 mt-2">
              Tente remover alguns filtros ou selecionar tags diferentes.
            </p>
          )}
        </div>
      );
    }

    // Calcular artigos para a página atual
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    return (
      <>
        {Array.isArray(currentArticles) && currentArticles.map(article => (
          <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-blue-800">{article.title}</h4>
                  {/* Mostrar informações do funcionário se estiverem disponíveis */}
                  {article.employee && (
                    <span className="text-xs text-green-600 font-medium ml-2">
                      {article.employee.mtrc} - {article.employee.nome?.toUpperCase() || "Sem nome"} - {new Date(article.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600">
                  <div className="flex items-center mr-4 mb-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>{article.authors}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{article.year}</span>
                  </div>
                  <div className="mb-2">
                    <span className="italic">{article.publisher}</span>
                  </div>
                </div>
                
                {article.abstract_short ? (
                  <p className="mt-2 text-sm text-gray-700">
                    {article.abstract_short}
                  </p>
                ) : article.abstract && (
                  <p className="mt-2 text-sm text-gray-700">
                    {article.abstract.length > 200 
                      ? `${article.abstract.substring(0, 200)}...` 
                      : article.abstract}
                  </p>
                )}
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && article.tags.map(tag => (
                    <span key={tag.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                      <Tag size={12} className="mr-1" />
                      <span>{tag.name}</span>
                    </span>
                  ))}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {article.category && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {article.category.name}
                      </span>
                    )}
                    {article.subcategory && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        {article.subcategory.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {article.url && (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span>Ver artigo</span>
                      </a>
                    )}
                    
                    {article.file_path && (
                      <button 
                        onClick={() => downloadArticle(article.id)}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {(!Array.isArray(currentArticles) || currentArticles.length === 0) && (
          <div className="text-center p-8">
            <p className="text-gray-600">Nenhum artigo encontrado ou erro ao processar dados.</p>
            <p className="text-sm text-gray-500 mt-2">Tente novamente mais tarde.</p>
          </div>
        )}

        {/* Paginação */}
        {articles.length > articlesPerPage && (
          <div className="flex justify-between items-center mt-6 px-2">
            <div className="text-sm text-gray-600">
              Mostrando {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, articles.length)} de {articles.length} artigos
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
      <h3 className="text-xl font-semibold text-blue-800 mb-4">{title}</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p>{description}</p>
          </div>
        </div>
      </div>
      
      {/* Seção de filtros por tags */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Filter className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-700">Filtrar por Tags</h4>
          
          {Array.isArray(filterTags) && filterTags.length > 0 && (
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
          {Array.isArray(filterTags) && filterTags.map(tag => (
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
    <p className="mt-2 text-gray-600">Carregando artigos...</p>
</div>
) : error ? (
<div className="text-center p-8 text-red-600">
    <p>Erro ao carregar artigos: {error}</p>
    <p className="text-sm mt-2">Verifique se a API está funcionando corretamente.</p>
</div>
) : (
<div className="space-y-4">
    {renderArticles()}
</div>
)}

<div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
<div className="flex justify-between items-center">
    <p className="text-sm text-gray-600">
    Contribua compartilhando artigos relevantes sobre este tema.
    </p>
    <button 
    onClick={prepareUploadModal}
    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
    >
    <Upload className="h-4 w-4 mr-1" />
    <span>Adicionar artigo</span>
    </button>
</div>
</div>

{/* Modal de Upload - Versão otimizada espacialmente */}
{showUploadModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Adicionar Novo Artigo</h3>
        <button
        className="text-gray-500 hover:text-gray-700"
        onClick={() => setShowUploadModal(false)}
        >
        <X className="w-5 h-5" />
        </button>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
        {/* Coluna esquerda: Upload e análise */}
        <div className="col-span-1">
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo PDF</label>
            <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            onChange={(e) => {
                setUploadFile(e.target.files[0]);
                setAnalysisResult(null);
                setAnalysisError(null);
                setPdfAnalyzed(false);
            }}
            />
            <p className="mt-1 text-xs text-gray-500">Formatos: PDF, DOC, DOCX, TXT</p>

            {uploadFile && uploadFile.name.toLowerCase().endsWith('.pdf') && !pdfAnalyzed && (
            <button
                type="button"
                onClick={analyzePdf}
                disabled={analyzingPdf}
                className="mt-3 flex w-full justify-center items-center px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
                <Sparkles className="w-3 h-3 mr-1" />
                {analyzingPdf ? 'Analisando...' : 'Analisar PDF com IA'}
            </button>
            )}

            {analyzingPdf && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
                <div className="flex items-center">
                <div className="mr-2 animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-blue-600 text-xs">Analisando com IA...</p>
                </div>
            </div>
            )}
            
            {analysisError && (
            <div className="mt-3 p-2 bg-red-50 rounded-md">
                <p className="text-red-600 text-xs">Erro: {analysisError}</p>
            </div>
            )}
            
            {pdfAnalyzed && !analysisError && (
            <div className="mt-3 p-2 bg-green-50 rounded-md">
                <p className="text-green-600 text-xs">Análise concluída com sucesso!</p>
            </div>
            )}
            
            {/* Tags */}
            <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (máximo 4)
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
                {Array.isArray(selectedTags) && selectedTags.map(tag => (
                <div key={tag.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>{tag.name}</span>
                    <button 
                    type="button" 
                    onClick={() => removeTag(tag.id)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                    >
                    <X size={12} />
                    </button>
                </div>
                ))}
            </div>
            
            <div className="relative" ref={tagSearchRef}>
                <div className="flex items-center border rounded overflow-hidden">
                <div className="pl-2">
                    <Search size={14} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="w-full px-2 py-1 border-0 focus:outline-none text-sm"
                    placeholder="Buscar tags..."
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-auto">
                    {getFilteredTags().length > 0 ? (
                    getFilteredTags().map(tag => (
                        <div
                        key={tag.id}
                        className="px-2 py-1 cursor-pointer hover:bg-blue-50 text-sm"
                        onClick={() => addTag(tag)}
                        >
                        <div className="flex items-center">
                            <Tag size={12} className="mr-1 text-blue-600" />
                            <span>{tag.name}</span>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="px-2 py-1 text-gray-500 text-sm">Nenhuma tag encontrada</div>
                    )}
                </div>
                )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
                {selectedTags.length}/4 tags selecionadas
            </p>
            </div>
        </div>
        </div>

        {/* Coluna direita: Formulário principal */}
        <div className="col-span-2">
        <form onSubmit={handleUpload}>
            <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                type="text"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.title}
                onChange={handleInputChange}
                required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autores</label>
                <input
                type="text"
                name="authors"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.authors}
                onChange={handleInputChange}
                placeholder="Ex: Silva, J.; Santos, M."
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Editora/Conferência</label>
                <input
                type="text"
                name="publisher"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.publisher}
                onChange={handleInputChange}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
                <input
                type="number"
                name="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Artigo</label>
                <input
                type="url"
                name="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                name="category_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                >
                <option value="">Selecione uma categoria</option>
                {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria *</label>
                <select
                name="subcategory_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.subcategory_id}
                onChange={handleInputChange}
                disabled={!formData.category_id}
                required
                >
                <option value="">Selecione uma subcategoria</option>
                {Array.isArray(getFilteredSubcategories()) && getFilteredSubcategories().map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
                </select>
            </div>
            
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
                <textarea
                name="abstract"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                value={formData.abstract}
                onChange={handleInputChange}
                ></textarea>
            </div>
            
            {formData.abstract_short && (
                <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo Condensado</label>
                <textarea
                    name="abstract_short"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="2"
                    value={formData.abstract_short}
                    onChange={handleInputChange}
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                    Versão condensada do resumo (gerada automaticamente)
                </p>
                </div>
            )}
            
            <div className="col-span-2 flex justify-end space-x-3 mt-4">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
                disabled={uploading}
                >
                {uploading ? 'Enviando...' : 'Adicionar Artigo'}
                </button>
            </div>
            </div>
        </form>
        </div>
    </div>
    </div>
</div>
)}
</div>
);
};

export default ArticleList;