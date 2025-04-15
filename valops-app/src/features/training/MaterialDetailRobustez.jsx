import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, Clock, Calendar, User, Star, Tag, 
  PlaySquare, BookOpen, File, ExternalLink, 
  Share2, ThumbsUp, Eye, Award, AlertTriangle
} from 'lucide-react';
import trainingService from '../../services/trainingService';
import config from '../../config';

const MaterialDetailRobustez = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [shareTooltip, setShareTooltip] = useState('');
  const [viewCount, setViewCount] = useState(0);
  const [rating, setRating] = useState({ value: 0, count: 0 });
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [materialData, setMaterialData] = useState(null);
  
  // ID do material
  const materialId = 1; // Para o vídeo de Robustez
  
  // Material padrão (enquanto carrega dados reais)
  const material = materialData || {
    id: materialId,
    title: "Robustez em Modelos de Machine Learning",
    type: "video",
    category: { id: "videos", name: "Vídeos" },
    description: "Você já treinou um modelo com alta acurácia, mas que falhou ao ser colocado em produção? Então você precisa entender o conceito de robustez em modelos preditivos.\n\nNeste vídeo, vamos explorar o que é robustez, por que ela é crítica para a confiabilidade de modelos de IA e como você pode avaliá-la com testes simples e eficazes.\n\nComo especialista em validação de modelos, compartilho uma visão prática e acessível para que você comece a aplicar testes de robustez hoje mesmo, evitando armadilhas comuns na modelagem de dados.",
    duration: "15 min",
    author: "Equipe ValOps",
    level: "intermediate",
    rating: 0,
    rating_count: 0,
    view_count: viewCount || 2, // Usar o estado viewCount como fonte de verdade
    publish_date: "2025-03-15",
    file_path: "/videos/robustez.mp4",
    content_url: "/treinamentos/videos/robustez.mp4",
    preview_content: "Este vídeo explica como testar a robustez de modelos preditivos e por que ela é essencial para sistemas de IA confiáveis em produção.",
    tags: [
      { id: 1, name: "Validação" },
      { id: 2, name: "Robustez" },
      { id: 3, name: "Produção" },
      { id: 4, name: "Testes" }
    ],
    related_materials: [
      {
        id: 2,
        title: "Metodologias de Teste para Classificadores",
        type: "document",
        description: "Um guia completo sobre metodologias de teste específicas para modelos de classificação, incluindo robustez, generalização e estabilidade.",
        level: "intermediate",
        rating: 4.5
      },
      {
        id: 3,
        title: "Testes Avançados para Modelos em Produção",
        type: "book",
        description: "Este e-book detalha técnicas avançadas para testar modelos já em ambiente de produção, com foco em monitoramento e garantia contínua de qualidade.",
        level: "advanced",
        rating: 4.7
      },
      {
        id: 4,
        title: "Curso: Validação de Modelos de ML",
        type: "course",
        description: "Um curso completo sobre todas as etapas de validação de modelos, desde os testes iniciais até o monitoramento em produção.",
        level: "beginner",
        rating: 4.9
      }
    ]
  };
  
  const handleTrackUsage = async (action) => {
    try {
      setLoading(true);
      // Registrar visualização na API
      await trainingService.trackUsage(materialId, action);
      
      // Obter dados atualizados após registrar visualização
      if (action === 'view') {
        // Aguardar um momento para o banco de dados processar a atualização
        setTimeout(() => {
          // Forçar recarga dos dados atualizados, incluindo contador de visualizações
          fetchMaterialData(true);
        }, 500);
      }
      console.log(`Registrando ${action} para material #${materialId}`);
    } catch (err) {
      console.error(`Erro ao registrar ${action}:`, err);
    } finally {
      setLoading(false);
    }
  };
  
  // Executa ao abrir a página para registrar visualização
  useEffect(() => {
    // Registrar visualização
    handleTrackUsage('view');
  }, []);
  
  // Buscar dados do material
  const fetchMaterialData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Buscar detalhes do material com opção para forçar atualização
      const materialDetail = await trainingService.getMaterialDetail(materialId, forceRefresh);
      
      if (materialDetail) {
        // Garantir que dados essenciais existam antes de atualizar o estado
        const safeDetail = {
          ...materialDetail,
          view_count: parseInt(materialDetail.view_count || 0, 10),
          rating: parseFloat(materialDetail.rating || 0),
          rating_count: parseInt(materialDetail.rating_count || 0, 10),
          // Converter campos que devem ser strings
          category_id: String(materialDetail.category_id || ""),
          duration: materialDetail.duration ? String(materialDetail.duration) : "15 min",
        };
        
        setMaterialData(safeDetail);
        
        // Atualizar estados com os dados recebidos
        setViewCount(safeDetail.view_count || 0);
        setRating({
          value: safeDetail.rating || 0,
          count: safeDetail.rating_count || 0
        });
        
        console.log("Dados atualizados do material:", safeDetail);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do material:', err);
      // Não mostrar erro para o usuário, apenas usar dados locais como fallback
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se o usuário já avaliou o material
  const checkUserRating = async () => {
    try {
      const userRatingData = await trainingService.getUserRating(materialId);
      if (userRatingData) {
        setUserRating(userRatingData.rating || userRatingData.value || 0);
        setRatingComment(userRatingData.comment || '');
      }
    } catch (err) {
      console.error('Erro ao verificar avaliação do usuário:', err);
      // Não exibir erro para o usuário, apenas logar
    }
  };
  
  // Carregar dados quando o componente montar
  useEffect(() => {
    // Forçar atualização para obter os dados mais recentes
    fetchMaterialData(true);
    checkUserRating();
  }, []);
  
  // Função para enviar avaliação
  const handleSubmitRating = async () => {
    if (userRating === 0) return;
    
    try {
      setLoading(true);
      // Enviar avaliação para a API
      const response = await trainingService.rateMaterial(materialId, {
        value: userRating,
        comment: ratingComment
      });
      
      // Atualizar dados locais com a resposta
      if (response && response.rating) {
        setRating({
          value: response.rating.average,
          count: response.rating.count
        });
      }
      
      // Fechar formulário
      setShowRatingForm(false);
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setError('Erro ao enviar avaliação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função simplificada para avaliar rapidamente (apenas com estrelas)
  const handleQuickRating = async (value) => {
    try {
      setLoading(true);
      // Enviar avaliação para a API com o valor selecionado
      const response = await trainingService.rateMaterial(materialId, {
        value: value,
        comment: ''  // Comentário vazio para avaliação rápida
      });
      
      // Atualizar dados locais com a resposta
      if (response && response.rating) {
        setRating({
          value: response.rating.average,
          count: response.rating.count
        });
        setUserRating(value);
      }
    } catch (err) {
      console.error('Erro ao enviar avaliação rápida:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const getContentTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'video':
        return <Video className="w-6 h-6 text-blue-500" />;
      case 'document':
        return <File className="w-6 h-6 text-blue-500" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'course':
        return <Award className="w-6 h-6 text-blue-500" />;
      default:
        return <File className="w-6 h-6 text-blue-500" />;
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
  
  // Componente de vídeo para robustez
  const renderMedia = () => {
    console.log("Renderizando vídeo com URL:", material.content_url);
    
    // Garantir que a URL está completa
    const videoUrl = material.content_url?.startsWith('http') 
      ? material.content_url 
      : `${config.api.baseUrl}${material.content_url}`;
      
    console.log("URL final do vídeo:", videoUrl);
    
    return (
      <div className="flex flex-col gap-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
          <video 
            id="video-player"
            controls 
            className="w-full h-full"
            preload="metadata"
            controlsList="nodownload"
            playsInline
            crossOrigin="anonymous"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
            <p>Seu navegador não suporta a reprodução de vídeos. <a href={videoUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar</a>.</p>
          </video>
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              const videoElement = document.getElementById('video-player');
              if (videoElement) {
                videoElement.scrollIntoView({ behavior: 'smooth' });
                videoElement.load();
                videoElement.play().catch(error => {
                  console.error("Erro ao reproduzir:", error);
                  alert("Para assistir ao vídeo, clique no player e depois no botão play.");
                });
              }
            }}
          >
            <PlaySquare className="mr-2 h-5 w-5" />
            Reproduzir
          </button>
        </div>
      </div>
    );
  };
  
  const renderRelatedMaterials = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {material.related_materials.map(related => (
          <div 
            key={related.id} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/testing/training/material/${related.id}`)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {getContentTypeIcon(related.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">{related.title}</h4>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{related.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  {related.level && getLevelBadge(related.level)}
                  <span className="ml-2 flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                    {related.rating || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md bg-red-50 p-6 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar material</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-600 text-white rounded-md"
            >
              Voltar
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Barra de navegação superior */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4">
          <button 
            className="inline-flex items-center text-gray-700 hover:text-blue-600"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para materiais de treinamento
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Cabeçalho do material */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            {getContentTypeIcon(material.type)}
            <span className="text-sm font-medium text-gray-600 ml-2">
              Vídeo
            </span>
            <div className="ml-auto">
              {getLevelBadge(material.level)}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{material.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
            {material.author && (
              <div className="mr-6 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {material.author}
              </div>
            )}
            
            {material.publish_date && (
              <div className="mr-6 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(material.publish_date).toLocaleDateString()}
              </div>
            )}
            
            {material.duration && (
              <div className="mr-6 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {material.duration}
              </div>
            )}
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
              {material.rating || 0} ({material.rating_count || 0} avaliações)
            </div>
          </div>
          
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {material.tags.map(tag => (
                <span 
                  key={typeof tag === 'string' ? tag : tag.id} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-gray-700 mb-6 whitespace-pre-line">{material.description}</p>
          
          <div className="flex flex-wrap gap-3">
            {material.content_url && (
              <button 
                onClick={() => {
                  // Definir activeTab para "overview" para garantir que o vídeo seja exibido
                  setActiveTab('overview');
                  
                  // Aguardar um momento para que a mudança de tab seja renderizada
                  setTimeout(() => {
                    // Rolar para a visualização do vídeo
                    const videoElement = document.getElementById('video-player');
                    if (videoElement) {
                      videoElement.scrollIntoView({ behavior: 'smooth' });
                      
                      // Primeiro recarregar o vídeo
                      try {
                        // Construir URL com timestamp para evitar cache
                        const timestamp = new Date().getTime();
                        const videoUrl = material.content_url?.startsWith('http') 
                          ? `${material.content_url}?t=${timestamp}` 
                          : `${config.api.baseUrl}${material.content_url}?t=${timestamp}`;
                          
                        videoElement.load();
                        
                        // Tentar iniciar a reprodução após um pequeno delay
                        setTimeout(() => {
                          videoElement.play().catch(e => {
                            console.error('Erro ao reproduzir vídeo:', e);
                            // Exibir mensagem para o usuário
                            alert('Para iniciar o vídeo, clique no player e pressione o botão play.');
                          });
                        }, 300);
                      } catch (error) {
                        console.error('Erro ao recarregar vídeo:', error);
                        // Tentar abrir em nova janela como fallback
                        const videoUrl = material.content_url?.startsWith('http') 
                          ? material.content_url 
                          : `${config.api.baseUrl}${material.content_url}`;
                        window.open(videoUrl, '_blank');
                      }
                    } else {
                      // Construir URL completa e abrir em nova janela se não encontrar o elemento de vídeo
                      const videoUrl = material.content_url?.startsWith('http') 
                        ? material.content_url 
                        : `${config.api.baseUrl}${material.content_url}`;
                      window.open(videoUrl, '_blank');
                    }
                  }, 100); // Esperar 100ms para garantir que o DOM foi atualizado
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                <PlaySquare className="w-4 h-4 mr-2" />
                Assistir
              </button>
            )}
            
            
            <button 
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  setShareTooltip('URL copiada!');
                  setTimeout(() => setShareTooltip(''), 2000);
                }).catch(() => {
                  setShareTooltip('Erro ao copiar');
                  setTimeout(() => setShareTooltip(''), 2000);
                });
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors relative"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
              {shareTooltip && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {shareTooltip}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Estatísticas de uso */}
        <div className="flex flex-wrap bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="w-1/2 text-center p-2">
            <div className="flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-lg font-medium">{viewCount}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Visualizações</p>
          </div>
          <div className="w-1/2 text-center p-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <ThumbsUp className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-lg font-medium">{rating.value.toFixed(1)}/5</span>
                <span className="text-xs ml-1">({rating.count})</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star}
                    className={`w-4 h-4 cursor-pointer ${userRating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    onClick={() => handleQuickRating(star)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-gray-600">Avaliação</p>
                <button 
                  className="text-xs text-blue-500 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRatingForm(true);
                  }}
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
          
          {/* Modal de avaliação (comentário opcional) */}
          {showRatingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Adicionar Comentário</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowRatingForm(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        className={`w-8 h-8 cursor-pointer ${userRating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600">Sua avaliação: {userRating}/5</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Comente sua experiência (opcional):</label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows="3"
                    placeholder="Compartilhe sua opinião sobre este material..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                  ></textarea>
                </div>
                
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
                  disabled={userRating === 0}
                  onClick={handleSubmitRating}
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          )}
          
        </div>
        
        {/* Abas para conteúdo e informações adicionais */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 text-sm font-medium flex items-center ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`py-4 px-1 text-sm font-medium flex items-center ${
                activeTab === 'related'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Materiais Relacionados
            </button>
          </nav>
        </div>
        
        {/* Conteúdo baseado na aba ativa */}
        <div>
          {activeTab === 'overview' && (
            <div>
              {renderMedia()}
              
              {material.preview_content && (
                <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sobre este conteúdo</h3>
                  <p className="text-gray-700">{material.preview_content}</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'related' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Materiais Relacionados</h3>
              {renderRelatedMaterials()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailRobustez;