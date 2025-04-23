import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, Clock, Calendar, User, Star, Tag, 
  Download, PlaySquare, BookOpen, File, ExternalLink, 
  Bookmark, Share2, ThumbsUp, Eye, Award, AlertTriangle,
  Image, Archive
} from 'lucide-react';
import trainingService from '../../services/trainingService';
import config from '../../config';

/**
 * Função auxiliar para construir a URL correta para conteúdo
 * @param {string} contentUrl - URL do conteúdo 
 * @param {string} type - Tipo de conteúdo (video, document, etc)
 * @returns {string} URL completa do conteúdo
 */
function buildContentUrl(contentUrl, type, materialId) {
  // Se já for uma URL completa (http/https), retorna como está
  if (contentUrl?.startsWith('http')) {
    return contentUrl;
  }
  
  // Se o path for undefined ou null, retorna null
  if (!contentUrl) return null;
  
  // Se for uma thumbnail para um curso, usar o caminho direto para a imagem
  if (materialId && (contentUrl === 'thumbnail' || contentUrl?.includes('thumbnail'))) {
    return `/api/training/media/${materialId}/imagem/thumbnail.png`;
  }
  
  // Remove prefixos duplicados
  let path = contentUrl;
  if (path.startsWith('/treinamentos/')) {
    path = path.substring('/treinamentos/'.length);
  } else if (path.startsWith('/treinamentos')) {
    path = path.substring('/treinamentos'.length);
  }
  
  // Se o caminho não começar com "/", adicione-o
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Constrói a URL final
  return `${config.api.baseUrl}/treinamentos${path}`;
}

const MaterialDetailPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [shareTooltip, setShareTooltip] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [detailedDesc, setDetailedDesc] = useState(null);
  const [simpleDesc, setSimpleDesc] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await trainingService.getMaterialById(materialId);
        setMaterial(response);
        
        // Registrar visualização
        await trainingService.trackUsage(materialId, 'view');
        
        // Verificar se o usuário já avaliou o material
        try {
          const userRatingData = await trainingService.getUserRating(materialId);
          if (userRatingData) {
            setUserRating(userRatingData.rating || 0);
            setRatingComment(userRatingData.comment || '');
          }
        } catch (err) {
          console.error("Erro ao verificar avaliação do usuário:", err);
          // Não exibir erro para o usuário, apenas logar
        }
        
        // Busca múltipla de dados complementares
        try {
          // 1. Buscar a descrição detalhada
          const descData = await trainingService.getMaterialDescription(materialId);
          if (descData && descData.detailed_content) {
            console.log("Descrição detalhada encontrada:", descData);
            setSimpleDesc(descData.detailed_content);
          } else {
            console.log("Tente usar o endpoint completo...");
            
            // Tente buscar usando o endpoint detail como fallback
            try {
              const detailData = await trainingService.getMaterialDetailedDescription(materialId);
              if (detailData && detailData.detailed_desc) {
                console.log("Descrição detalhada encontrada via endpoint detail:", detailData.detailed_desc);
                setDetailedDesc(detailData.detailed_desc);
                
                // Se tivermos apenas o detailed_content na detailed_desc, copie para simpleDesc também
                if (detailData.detailed_desc.detailed_content && !detailData.detailed_desc.learning_objectives) {
                  setSimpleDesc(detailData.detailed_desc.detailed_content);
                }
              } else {
                console.log("Nenhuma descrição detalhada encontrada para o material", materialId);
              }
            } catch (detailErr) {
              console.error("Erro ao buscar detalhes completos:", detailErr);
            }
          }
          
          // 2. Buscar anexos (materiais relacionados)
          try {
            const attachmentsData = await trainingService.getMaterialAttachments(materialId);
            if (attachmentsData && attachmentsData.length > 0) {
              console.log("Anexos encontrados:", attachmentsData);
              setAttachments(attachmentsData);
            } else {
              console.log("Nenhum anexo encontrado para o material", materialId);
            }
          } catch (attachErr) {
            console.error("Erro ao buscar anexos:", attachErr);
          }
        } catch (err) {
          console.error("Erro ao buscar dados complementares:", err);
          // Não exibir erro para o usuário, apenas logar
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar detalhes do material:", err);
        setError("Não foi possível carregar os detalhes do material. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };
    
    if (materialId) {
      fetchMaterialDetail();
    }
  }, [materialId]);
  
  const handleDownload = async () => {
    try {
      // Registrar download
      await trainingService.trackUsage(materialId, 'download');
      
      // Obter URL principal para download
      let downloadUrl = material.content_url || material.file_path;
      if (!downloadUrl && material.download_links) {
        // Pegar o primeiro link disponível
        const firstKey = Object.keys(material.download_links)[0];
        if (firstKey) {
          downloadUrl = material.download_links[firstKey];
        }
      }
      
      if (downloadUrl) {
        const fullUrl = buildContentUrl(downloadUrl, material.type, material.id);
        window.open(fullUrl, '_blank');
      }
    } catch (err) {
      console.error("Erro ao registrar download:", err);
    }
  };
  
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
        setMaterial(prev => ({
          ...prev,
          rating: response.rating.average || response.rating.value,
          rating_count: response.rating.count
        }));
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
  
  // Função simplificada para avaliar rapidamente
  const handleQuickRating = async (value) => {
    if (value === userRating) return; // Evitar requisições desnecessárias
    
    try {
      setLoading(true);
      // Enviar avaliação para a API com o valor selecionado
      const response = await trainingService.rateMaterial(materialId, {
        value: value,
        comment: ''
      });
      
      // Atualizar dados locais com a resposta
      if (response && response.rating) {
        setMaterial(prev => ({
          ...prev,
          rating: response.rating.average || response.rating.value,
          rating_count: response.rating.count
        }));
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
      case 'pdf':
        return <File className="w-6 h-6 text-red-500" />;
      case 'image':
        return <Image className="w-6 h-6 text-green-500" />;
      case 'archive':
        return <Archive className="w-6 h-6 text-purple-500" />;
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
  
  // Componente de mídia específico por tipo
  const renderMedia = () => {
    if (!material) return null;
    
    const contentUrl = material.content_url || material.file_path;
    if (!contentUrl) return null;
    
    const fullUrl = buildContentUrl(contentUrl, material.type, material.id);
    
    switch(material.type?.toLowerCase()) {
      case 'video':
        return (
          <div className="flex flex-col gap-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
              <video 
                id="video-player"
                controls 
                className="w-full h-full"
                preload="metadata"
                controlsList="nodownload"
                poster={material.thumbnail ? buildContentUrl(material.thumbnail, material.type, material.id) : null}
              >
                <source src={fullUrl} type="video/mp4" />
                <source src={fullUrl.replace('.mp4', '.webm')} type="video/webm" />
                <p>Seu navegador não suporta a reprodução de vídeos. <a href={fullUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar</a>.</p>
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
      case 'document':
        return (
          <div className="bg-gray-100 p-4 rounded-lg text-center flex flex-col items-center justify-center min-h-[300px]">
            <File className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-gray-800 font-medium mb-2">Documento PDF</p>
            <p className="text-gray-600 text-sm mb-4">
              Este documento está disponível para visualização e download.
            </p>
            <button 
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        );
      case 'book':
        return (
          <div className="bg-gray-100 p-4 rounded-lg text-center flex flex-col items-center justify-center min-h-[300px]">
            <BookOpen className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-gray-800 font-medium mb-2">E-book disponível</p>
            <p className="text-gray-600 text-sm mb-4">
              Este e-book está disponível para download.
            </p>
            <button 
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download E-book
            </button>
          </div>
        );
      case 'course':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Conteúdo do Curso</h3>
            </div>
            
            {material.chapters && material.chapters.length > 0 ? (
              <div className="space-y-4">
                {material.chapters.map((chapter, index) => (
                  <div key={chapter.id || index} className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm mr-3">
                          {chapter.id || index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{chapter.title}</h4>
                          <p className="text-sm text-gray-500">{chapter.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {chapter.duration && (
                          <span className="text-xs text-gray-500 mr-3 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {chapter.duration}
                          </span>
                        )}
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={() => window.open(chapter.url || fullUrl, '_blank')}
                        >
                          <PlaySquare className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">Conteúdo detalhado do curso não disponível</p>
                {fullUrl && (
                  <button 
                    onClick={() => window.open(fullUrl, '_blank')}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar Curso
                  </button>
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-800">Conteúdo não disponível para visualização direta.</p>
            {fullUrl && (
              <button 
                onClick={handleDownload}
                className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            )}
          </div>
        );
    }
  };
  
  const renderRelatedMaterials = () => {
    // Verificar se temos anexos do endpoint /attachments
    if (attachments.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map(attachment => {
            // Determinar o tipo do anexo a partir da extensão
            const fileExt = attachment.original_filename?.split('.').pop()?.toLowerCase();
            let fileType = 'document';
            
            if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(fileExt)) {
              fileType = 'video';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt)) {
              fileType = 'image';
            } else if (['pdf'].includes(fileExt)) {
              fileType = 'pdf';
            } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExt)) {
              fileType = 'archive';
            }
            
            return (
              <div 
                key={attachment.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  console.log(`Abrindo anexo ID: ${attachment.id}, caminho: ${attachment.file_path}`);
                  
                  // Verificar se temos o file_path e usar ele, ou cair no endpoint de anexos
                  if (attachment.file_path && attachment.material_id) {
                    // Construir o caminho usando o link simbólico
                    const directPath = `/treinamentos/${attachment.material_id}/anexos/${attachment.file_path.split('/').pop()}`;
                    console.log(`Tentando acessar anexo via caminho direto: ${directPath}`);
                    window.open(directPath, '_blank');
                  } else {
                    // Fallback para o endpoint da API
                    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
                    const apiPath = `${baseUrl}/training/attachments/${attachment.id}`;
                    console.log(`Tentando acessar anexo via API: ${apiPath}`);
                    window.open(apiPath, '_blank');
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getContentTypeIcon(fileType)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{attachment.original_filename}</h4>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {attachment.description || "Anexo do material"}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {fileExt?.toUpperCase() || "Documento"}
                      </span>
                      {attachment.file_size && (
                        <span className="ml-2">
                          {Math.round(attachment.file_size / 1024)} KB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    // Fallback para materiais relacionados do endpoint padrão
    if (material?.related_materials?.length) {
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
    }
    
    // Se não houver nenhum material relacionado ou anexo
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Nenhum material relacionado ou anexo encontrado.</p>
      </div>
    );
  };
  
  if (loading && !material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && !material) {
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
  
  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-800 mb-2">Material não encontrado</h2>
          <p className="text-gray-600 mb-4">Não foi possível encontrar o material solicitado.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Voltar
          </button>
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
            onClick={() => navigate('/testing/training')}
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
              {material.type === 'video' ? 'Vídeo' : 
               material.type === 'document' ? 'Documento' :
               material.type === 'book' ? 'E-book' :
               material.type === 'course' ? 'Curso' : 'Material'
              }
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
            {(material.content_url || material.file_path) && (
              material.type === 'video' ? (
                <button 
                  onClick={() => {
                    setActiveTab('overview');
                    setTimeout(() => {
                      const videoElement = document.getElementById('video-player');
                      if (videoElement) {
                        videoElement.scrollIntoView({ behavior: 'smooth' });
                        videoElement.load();
                        videoElement.play().catch(e => {
                          console.error('Erro ao reproduzir vídeo:', e);
                        });
                      }
                    }, 100);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlaySquare className="w-4 h-4 mr-2" />
                  Assistir
                </button>
              ) : (
                <button 
                  onClick={() => {
                    const contentUrl = material.content_url || material.file_path;
                    const fullUrl = buildContentUrl(contentUrl, material.type, material.id);
                    if (fullUrl) window.open(fullUrl, '_blank');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {material.type === 'course' ? 'Acessar Curso' : 'Acessar'}
                </button>
              )
            )}
            
            {((material.content_url || material.file_path) && material.type !== 'video') && (
              <button 
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
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
              <span className="text-lg font-medium">{material.view_count || 0}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Visualizações</p>
          </div>
          <div className="w-1/2 text-center p-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <ThumbsUp className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-lg font-medium">{(material.rating || 0).toFixed(1)}/5</span>
                <span className="text-xs ml-1">({material.rating_count || 0})</span>
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
          
{/* Modal de avaliação */}
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
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 text-sm font-medium flex items-center ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`py-4 px-1 text-sm font-medium flex items-center ${
                activeTab === 'related'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Anexos
            </button>
          </nav>
        </div>
        
        {/* Conteúdo baseado na aba ativa */}
        <div>
          {activeTab === 'overview' && (
            <div>
              {renderMedia()}
              
              {material.preview_content ? (
                <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sobre este conteúdo</h3>
                  <p className="text-gray-700">{material.preview_content}</p>
                  
                  <button
                    onClick={() => setActiveTab('details')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver detalhes completos
                  </button>
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActiveTab('details')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver detalhes do material
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações Detalhadas</h3>
              
              {/* Verificar se temos a versão completa ou simplificada */}
              {detailedDesc && Object.keys(detailedDesc).length > 1 && detailedDesc.learning_objectives ? (
                // Versão completa (legado - modelo anterior)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1: Conteúdo principal */}
                  <div className="space-y-6">
                    {detailedDesc.detailed_content && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Conteúdo Detalhado</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.detailed_content}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.learning_objectives && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Objetivos de Aprendizagem</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.learning_objectives}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.table_of_contents && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Sumário</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.table_of_contents}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Coluna 2: Informações adicionais */}
                  <div className="space-y-6">
                    {detailedDesc.prerequisites && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Pré-requisitos</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.prerequisites}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.target_audience && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Público-Alvo</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.target_audience}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.keywords && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Palavras-chave</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedDesc.keywords.split(',').map((keyword, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.evaluation_criteria && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Critérios de Avaliação</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.evaluation_criteria}
                        </div>
                      </div>
                    )}
                    
                    {detailedDesc.certification_info && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Informações de Certificação</h4>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {detailedDesc.certification_info}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : simpleDesc ? (
                // Versão simplificada (novo modelo)
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Conteúdo Detalhado</h4>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {simpleDesc}
                  </div>
                </div>
              ) : (
                // Nenhuma descrição disponível
                <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">Informações detalhadas não disponíveis para este material.</p>
                </div>
              )}
              
              {/* Seção para capítulos detalhados, se disponível */}
              {detailedDesc?.chapter_descriptions && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Capítulos</h4>
                  <div className="space-y-4">
                    {(() => {
                      // Verificar se é um objeto JSON ou uma string JSON
                      let chaptersObj = detailedDesc.chapter_descriptions;
                      
                      // Se for uma string, tentar converter para objeto
                      if (typeof chaptersObj === 'string') {
                        try {
                          chaptersObj = JSON.parse(chaptersObj);
                        } catch (e) {
                          console.error("Erro ao parsear capítulos:", e);
                          chaptersObj = {};
                        }
                      }
                      
                      // Se não for um objeto ou estiver vazio, mostrar mensagem
                      if (typeof chaptersObj !== 'object' || Object.keys(chaptersObj).length === 0) {
                        return (
                          <div className="text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Informações de capítulos não disponíveis</p>
                          </div>
                        );
                      }
                      
                      // Renderizar capítulos
                      return Object.entries(chaptersObj).map(([key, value], index) => {
                        // Verificar se o valor é um objeto completo ou apenas uma string de descrição
                        const isObjectValue = typeof value === 'object';
                        const title = isObjectValue ? (value.title || key) : key;
                        const description = isObjectValue ? value.description : value;
                        const topics = isObjectValue && Array.isArray(value.topics) ? value.topics : [];
                        
                        return (
                          <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-2">
                              <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3">
                                {index + 1}
                              </div>
                              <h5 className="text-md font-medium text-gray-800">{title}</h5>
                            </div>
                            {description && (
                              <p className="mt-2 text-gray-600 whitespace-pre-line">{description}</p>
                            )}
                            {topics.length > 0 && (
                              <div className="mt-3">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">Tópicos:</h6>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                  {topics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'related' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {attachments.length > 0 ? "Anexos e Materiais Complementares" : "Materiais Relacionados"}
              </h3>
              {renderRelatedMaterials()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailPage;