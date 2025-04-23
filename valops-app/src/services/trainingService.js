// src/services/trainingService.js
import axios from 'axios';
import api from './api';

// Usando a instância de API já configurada no projeto
// Isso garante que a URL base esteja correta e os headers necessários sejam aplicados
const trainingApi = api;

// Função auxiliar para obter o token de autenticação
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('valops_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Verificar conexão com API de treinamentos
const checkApiConnection = async () => {
  try {
    const response = await trainingApi.get('/training/health');
    return { status: response.status, message: 'Conexão estabelecida com sucesso' };
  } catch (error) {
    console.error('Erro ao verificar conexão com API de treinamentos:', error);
    return { 
      status: error.response?.status || 500, 
      message: error.response?.data?.detail || 'Erro ao conectar com API de treinamentos' 
    };
  }
};

// Serviços para categorias
const getAllCategories = async () => {
  try {
    const response = await trainingApi.get('/training/categories');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    
    // Se o erro for 404, retorna array vazio em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de categorias não encontrado, retornando array vazio');
      return [];
    }
    
    throw error;
  }
};

// Alias para getCategories para compatibilidade
const getCategories = getAllCategories;

const getCategoryById = async (categoryId) => {
  const response = await trainingApi.get(`/training/categories/${categoryId}`);
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await trainingApi.post('/training/categories', categoryData);
  return response.data;
};

const updateCategory = async (categoryId, categoryData) => {
  const response = await trainingApi.put(`/training/categories/${categoryId}`, categoryData);
  return response.data;
};

// Serviços para materiais
const getMaterials = async (params = {}) => {
  try {
    const response = await trainingApi.get('/training/materials', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    
    // Se o erro for 404, retorna objeto com array vazio em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de materiais não encontrado, retornando array vazio');
      return { items: [], total: 0 };
    }
    
    throw error;
  }
};

const getMaterialById = async (materialId, forceRefresh = false) => {
  try {
    // Adicionar timestamp para evitar cache quando forceRefresh for true
    const params = forceRefresh ? { t: new Date().getTime() } : {};
    const response = await trainingApi.get(`/training/materials/${materialId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar material com ID ${materialId}:`, error);
    throw error;
  }
};

// Para compatibilidade com código existente
const getMaterialDetail = getMaterialById;
const getMaterialDetails = getMaterialById;

// Função para buscar detalhes adicionais do material (incluindo descrição detalhada)
const getMaterialDetailedDescription = async (materialId) => {
  try {
    // Usamos o endpoint detail para obter informações completas com a descrição detalhada
    const response = await trainingApi.get(`/training/materials/${materialId}/detail`);
    
    // Para debug
    console.log("Resposta do endpoint detail:", response.data);
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar descrição detalhada do material ${materialId}:`, error);
    
    if (error.response?.status === 404) {
      console.warn('Endpoint de descrição detalhada não encontrado');
      return null;
    }
    
    throw error;
  }
};

// Função para buscar apenas a descrição detalhada de um material
const getMaterialDescription = async (materialId) => {
  try {
    const response = await trainingApi.get(`/training/materials/${materialId}/description`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar descrição do material ${materialId}:`, error);
    
    if (error.response?.status === 404) {
      console.warn('Descrição do material não encontrada');
      return null;
    }
    
    throw error;
  }
};

// Função para criar ou atualizar a descrição detalhada de um material
const createMaterialDescription = async (materialId, descriptionData) => {
  try {
    const response = await trainingApi.post(`/training/materials/${materialId}/description`, descriptionData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar descrição do material ${materialId}:`, error);
    throw error;
  }
};

// Função para atualizar a descrição detalhada de um material
const updateMaterialDescription = async (materialId, descriptionData) => {
  try {
    const response = await trainingApi.put(`/training/materials/${materialId}/description`, descriptionData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar descrição do material ${materialId}:`, error);
    throw error;
  }
};

// Função para obter os anexos de um material
const getMaterialAttachments = async (materialId) => {
  try {
    const response = await trainingApi.get(`/training/materials/${materialId}/attachments`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar anexos do material ${materialId}:`, error);
    
    if (error.response?.status === 404) {
      console.warn('Material ou anexos não encontrados');
      return [];
    }
    
    throw error;
  }
};

const createMaterial = async (materialData) => {
  // Cria uma cópia para evitar modificar o original
  const cleanedData = { ...materialData };
  
  // Garante que o nível está no formato correto para o banco de dados
  if (cleanedData.level && typeof cleanedData.level === 'string') {
    // Normaliza para maiúsculas para comparação
    const levelUpper = cleanedData.level.toUpperCase();
    
    // Garante que estamos usando os valores do enum no banco
    if (levelUpper === 'BEGINNER' || levelUpper === 'INTERMEDIATE' || levelUpper === 'ADVANCED') {
      cleanedData.level = levelUpper; // Já está no formato correto, só garantir que está em maiúsculas
    } else if (levelUpper === 'INICIANTE') {
      cleanedData.level = 'BEGINNER';
    } else if (levelUpper === 'INTERMEDIÁRIO' || levelUpper === 'INTERMEDIARIO') {
      cleanedData.level = 'INTERMEDIATE';
    } else if (levelUpper === 'AVANÇADO' || levelUpper === 'AVANCADO') {
      cleanedData.level = 'ADVANCED';
    } else {
      console.warn(`Valor de nível inválido: ${cleanedData.level}, usando valor padrão INTERMEDIATE`);
      cleanedData.level = 'INTERMEDIATE';
    }
  } else {
    // Default fallback
    cleanedData.level = 'INTERMEDIATE';
  }
  
  // Garante que o tipo está no formato correto para o banco
  if (cleanedData.type && typeof cleanedData.type === 'string') {
    // Normaliza para maiúsculas
    cleanedData.type = cleanedData.type.toUpperCase();
  }
  
  // Se materialData contém arquivos, usamos FormData
  const isFormData = cleanedData.file || cleanedData.thumbnail;
  
  let data = cleanedData;
  if (isFormData) {
    data = new FormData();
    
    // Adiciona todos os campos ao FormData
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] !== undefined && cleanedData[key] !== null) {
        if (key === 'file' || key === 'thumbnail') {
          data.append(key, cleanedData[key]);
        } else if (key === 'tags') {
          // Processar tags de várias maneiras possíveis
          if (Array.isArray(cleanedData[key])) {
            // Converter array de tags para JSON string
            data.append(key, JSON.stringify(cleanedData[key]));
          } else if (typeof cleanedData[key] === 'string') {
            // Se já é string, fazer split e formatar como array JSON
            const tagArray = cleanedData[key].split(';')
              .map(tag => tag.trim())
              .filter(tag => tag);
            data.append(key, JSON.stringify(tagArray));
          } else {
            // Caso seja outro tipo ou nulo, passar array vazio
            data.append(key, JSON.stringify([]));
          }
        } else {
          data.append(key, cleanedData[key]);
        }
      }
    });
  }
  
  // Adicionar logs detalhados para diagnóstico
  console.log("Enviando dados para criação de material:", {
    title: cleanedData.title,
    type: cleanedData.type,
    category_id: cleanedData.category_id,
    level: cleanedData.level,
    tags: cleanedData.tags,
    isFormData
  });
  
  const config = {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  };
  
  try {
    const response = await trainingApi.post('/training/materials', data, config);
    return response.data;
  } catch (error) {
    // Log detalhado do erro
    console.error("Erro ao criar material:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Tente extrair mais detalhes se disponíveis
    if (error.response?.data?.detail) {
      console.error("Detalhe do erro:", error.response.data.detail);
    }
    
    throw error;
  }
};

const updateMaterial = async (materialId, materialData) => {
  // Cria uma cópia para evitar modificar o original
  const cleanedData = { ...materialData };
  
  // Garante que o nível está no formato correto para o banco de dados
  if (cleanedData.level && typeof cleanedData.level === 'string') {
    // Normaliza para maiúsculas para comparação
    const levelUpper = cleanedData.level.toUpperCase();
    
    // Garante que estamos usando os valores do enum no banco
    if (levelUpper === 'BEGINNER' || levelUpper === 'INTERMEDIATE' || levelUpper === 'ADVANCED') {
      cleanedData.level = levelUpper; // Já está no formato correto, só garantir que está em maiúsculas
    } else if (levelUpper === 'INICIANTE') {
      cleanedData.level = 'BEGINNER';
    } else if (levelUpper === 'INTERMEDIÁRIO' || levelUpper === 'INTERMEDIARIO') {
      cleanedData.level = 'INTERMEDIATE';
    } else if (levelUpper === 'AVANÇADO' || levelUpper === 'AVANCADO') {
      cleanedData.level = 'ADVANCED';
    } else {
      console.warn(`Valor de nível inválido: ${cleanedData.level}, usando valor padrão INTERMEDIATE`);
      cleanedData.level = 'INTERMEDIATE';
    }
  }
  
  // Garante que o tipo está no formato correto para o banco
  if (cleanedData.type && typeof cleanedData.type === 'string') {
    // Normaliza para maiúsculas
    cleanedData.type = cleanedData.type.toUpperCase();
  }
  
  // Se materialData contém arquivos, usamos FormData
  const isFormData = cleanedData.file || cleanedData.thumbnail;
  
  let data = cleanedData;
  if (isFormData) {
    data = new FormData();
    
    // Adiciona todos os campos ao FormData
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] !== undefined && cleanedData[key] !== null) {
        if (key === 'file' || key === 'thumbnail') {
          data.append(key, cleanedData[key]);
        } else if (key === 'tags') {
          // Processar tags de várias maneiras possíveis
          if (Array.isArray(cleanedData[key])) {
            // Converter array de tags para JSON string
            data.append(key, JSON.stringify(cleanedData[key]));
          } else if (typeof cleanedData[key] === 'string') {
            // Se já é string, fazer split e formatar como array JSON
            const tagArray = cleanedData[key].split(';')
              .map(tag => tag.trim())
              .filter(tag => tag);
            data.append(key, JSON.stringify(tagArray));
          } else {
            // Caso seja outro tipo ou nulo, passar array vazio
            data.append(key, JSON.stringify([]));
          }
        } else {
          data.append(key, cleanedData[key]);
        }
      }
    });
  }
  
  // Adicionar logs detalhados para diagnóstico
  console.log("Enviando dados para atualização de material:", {
    id: materialId,
    title: cleanedData.title,
    type: cleanedData.type,
    category_id: cleanedData.category_id,
    level: cleanedData.level,
    tags: cleanedData.tags,
    isFormData
  });
  
  const config = {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  };
  
  try {
    const response = await trainingApi.put(`/training/materials/${materialId}`, data, config);
    return response.data;
  } catch (error) {
    // Log detalhado do erro
    console.error("Erro ao atualizar material:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Tente extrair mais detalhes se disponíveis
    if (error.response?.data?.detail) {
      console.error("Detalhe do erro:", error.response.data.detail);
    }
    
    throw error;
  }
};

const deleteMaterial = async (materialId, permanently = false) => {
  const response = await trainingApi.delete(`/training/materials/${materialId}`, {
    params: { permanently }
  });
  return response.data;
};

// Estatísticas e outros dados
const getTrainingStatistics = async () => {
  try {
    const response = await trainingApi.get('/training/statistics');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    
    // Se o erro for 404, retorna objeto com dados simulados em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de estatísticas não encontrado, retornando dados simulados');
      return {
        total_materials: 0,
        active_materials: 0,
        total_views: 0,
        total_downloads: 0,
        by_category: [],
        by_type: [],
        by_level: [],
        most_viewed: []
      };
    }
    
    throw error;
  }
};

// Alias para getStatistics para compatibilidade
const getStatistics = getTrainingStatistics;

const getTrainingTags = async () => {
  try {
    const response = await trainingApi.get('/training/tags');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    
    // Se o erro for 404, retorna array vazio em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de tags não encontrado, retornando array vazio');
      return [];
    }
    
    throw error;
  }
};

const getFeaturedMaterials = async (limit = 4) => {
  try {
    const response = await trainingApi.get('/training/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar materiais em destaque:', error);
    
    // Se o erro for 404, retorna array vazio em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de materiais em destaque não encontrado, retornando array vazio');
      return [];
    }
    
    throw error;
  }
};

const getMaterialRatings = async (materialId, page = 1, limit = 10) => {
  try {
    const response = await trainingApi.get(`/training/materials/${materialId}/ratings`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliações do material:', error);
    
    // Se o erro for 404, retorna objeto vazio em vez de lançar erro
    if (error.response?.status === 404) {
      console.warn('Endpoint de avaliações não encontrado, retornando objeto vazio');
      return { items: [], total: 0 };
    }
    
    throw error;
  }
};

const getUserRating = async (materialId) => {
  try {
    const response = await trainingApi.get(`/training/materials/${materialId}/user-rating`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliação do usuário:', error);
    
    // Se o erro for 404 ou outro erro, retorna null (usuário não avaliou ainda)
    return null;
  }
};

const rateMaterial = async (materialId, ratingData) => {
  try {
    const response = await trainingApi.post(`/training/materials/${materialId}/rate`, ratingData);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error);
    throw error;
  }
};

const deleteRating = async (ratingId) => {
  try {
    const response = await trainingApi.delete(`/training/ratings/${ratingId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error);
    throw error;
  }
};

// Função para registrar uma visualização ou download
const trackUsage = async (materialId, action) => {
  try {
    const response = await trainingApi.post(`/training/materials/${materialId}/track`, {
      action: action // 'view' ou 'download'
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao registrar ${action}:`, error);
    // Não propagar o erro para garantir que a UI continue funcionando mesmo com falhas no tracking
    return { success: false, message: `Erro ao registrar ${action}` };
  }
};

// Função para obter o progresso do usuário em um material
const getUserProgress = async (materialId) => {
  try {
    const response = await trainingApi.get(`/training/materials/${materialId}/progress`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar progresso do usuário:', error);
    // Se o erro for 404 ou 401, retorna null (usuário não tem progresso ou não está autenticado)
    return null;
  }
};

// Função para atualizar o progresso do usuário em um material
const updateUserProgress = async (materialId, progressData) => {
  try {
    const response = await trainingApi.post(`/training/materials/${materialId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    throw error;
  }
};

const trainingService = {
  // Verificação de API
  checkApiConnection,
  
  // Categorias
  getAllCategories,
  getCategories, // Alias para compatibilidade
  getCategoryById,
  createCategory,
  updateCategory,
  
  // Materiais
  getMaterials,
  getTrainingMaterials: getMaterials, // Alias para compatibilidade
  getMaterialById,
  getMaterialDetail, // Alias para compatibilidade
  getMaterialDetails, // Alias para compatibilidade
  getMaterialDetailedDescription,
  getMaterialDescription,
  createMaterialDescription,
  updateMaterialDescription,
  getMaterialAttachments,
  addAttachment: async (materialId, formData) => {
    try {
      const response = await trainingApi.post(`/training/materials/${materialId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar anexo ao material ${materialId}:`, error);
      throw error;
    }
  },
  deleteAttachment: async (attachmentId) => {
    try {
      const response = await trainingApi.delete(`/training/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir anexo ${attachmentId}:`, error);
      throw error;
    }
  },
  createMaterial,
  updateMaterial,
  deleteMaterial,
  
  // Estatísticas e outros
  getTrainingStatistics,
  getStatistics, // Alias para compatibilidade
  getTrainingTags,
  getFeaturedMaterials,
  getTagCloudData: async () => {
    try {
      const response = await trainingApi.get('/training/statistics/tag-cloud');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados da nuvem de tags:', error);
      // Se o erro for 404, retorna um objeto vazio em vez de lançar erro
      if (error.response?.status === 404) {
        console.warn('Endpoint de nuvem de tags não encontrado, retornando objeto vazio');
        return { tags: [], total_count: 0 };
      }
      throw error;
    }
  },
  
  // Avaliações
  getMaterialRatings,
  getUserRating,
  rateMaterial,
  deleteRating,
  
  // Tracking
  trackUsage,
  
  // Progresso do usuário
  getUserProgress,
  updateUserProgress
};

export default trainingService;