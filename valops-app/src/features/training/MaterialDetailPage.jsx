import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, Clock, Calendar, User, Star, Tag, 
  Download, PlaySquare, BookOpen, File, ExternalLink, 
  Bookmark, Share2, ThumbsUp, Eye, Award, AlertTriangle
} from 'lucide-react';
import trainingService from '../../services/trainingService';

const MaterialDetailPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await trainingService.getMaterialDetail(materialId);
        setMaterial(response);
        
        // Registrar visualização
        await trainingService.trackUsage(materialId, 'view');
        
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
      let downloadUrl = material.content_url;
      if (!downloadUrl && material.download_links) {
        // Pegar o primeiro link disponível
        const firstKey = Object.keys(material.download_links)[0];
        if (firstKey) {
          downloadUrl = material.download_links[firstKey];
        }
      }
      
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (err) {
      console.error("Erro ao registrar download:", err);
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
  
  // Componente de mídia específico por tipo
  const renderMedia = () => {
    if (!material || !material.content_url) return null;
    
    switch(material.type?.toLowerCase()) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              src={material.content_url} 
              controls 
              className="w-full h-full"
              poster={material.thumbnail ? `/api/training/thumbnails/${material.thumbnail}` : null}
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
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
                        <button className="text-blue-600 hover:text-blue-800 p-1">
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
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-800">Conteúdo não disponível para visualização direta.</p>
            {material.file_path && (
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
    if (!material?.related_materials?.length) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">Nenhum material relacionado encontrado.</p>
        </div>
      );
    }
    
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
            {material.content_url && (
              <button 
                onClick={() => window.open(material.content_url, '_blank')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {material.type === 'video' ? (
                  <>
                    <PlaySquare className="w-4 h-4 mr-2" />
                    Assistir
                  </>
                ) : material.type === 'course' ? (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar Curso
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar
                  </>
                )}
              </button>
            )}
            
            {(material.download_links && Object.keys(material.download_links).length > 0) || material.file_path ? (
              <button 
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            ) : null}
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              <Bookmark className="w-4 h-4 mr-2" />
              Salvar
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>
        
        {/* Estatísticas de uso */}
        <div className="flex flex-wrap bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="w-1/3 text-center p-2">
            <div className="flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-lg font-medium">{material.view_count || 0}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Visualizações</p>
          </div>
          <div className="w-1/3 text-center p-2 border-x border-gray-200">
            <div className="flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-lg font-medium">{material.download_count || 0}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Downloads</p>
          </div>
          <div className="w-1/3 text-center p-2">
            <div className="flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-lg font-medium">{material.rating || 0}/5</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Avaliação</p>
          </div>
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

export default MaterialDetailPage;