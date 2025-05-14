// /src/services/login-helper.js
import axios from 'axios';
import config from '../config';

/**
 * Função para realizar login diretamente no backend
 * Esta função usa um endpoint direto para evitar problemas de CORS e prefixos de rota
 */
export const directLogin = async (matricula) => {
  try {
    console.log('Tentando login direto com matrícula:', matricula);
    
    // Usar URL configurada do backend via environment variables
    const response = await axios.post(`${config.api.baseUrl}/api/login/`, {
      mtrc: matricula
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resposta do login direto:', response.data);
    
    if (response.data && response.data.mtrc) {
      // Armazenar dados do usuário no localStorage
      localStorage.setItem('valops_mtrc', response.data.mtrc);
      const userData = {
        mtrc: response.data.mtrc,
        nome: response.data.nome || '',
        uor: response.data.uor || '',
        role: response.data.role || 'user'
      };
      localStorage.setItem('valops_user', JSON.stringify(userData));
      
      // Disparar evento de alteração do estado de autenticação
      const authEvent = new CustomEvent('auth-state-changed', { 
        detail: { isLoggedIn: true, userData } 
      });
      window.dispatchEvent(authEvent);
      
      // Definir headers para futuras requisições
      axios.defaults.headers.common['X-Employee-MTRC'] = response.data.mtrc;
      
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    console.error('Erro no login direto:', error);
    
    // Feedback mais detalhado sobre o erro
    let errorMessage = 'Falha na autenticação';
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      
      if (error.response.status === 401) {
        errorMessage = 'Matrícula inválida ou não autorizada';
      } else if (error.response.status === 404) {
        errorMessage = 'Endpoint de login não encontrado. Verifique a configuração do servidor.';
      } else if (error.response.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor');
      errorMessage = 'Servidor indisponível. Verifique sua conexão.';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: error.message
    };
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  return localStorage.getItem('valops_mtrc') !== null;
};

/**
 * Obtém os dados do usuário atual
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('valops_user');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Função para logout
 */
export const logout = () => {
  localStorage.removeItem('valops_mtrc');
  localStorage.removeItem('valops_user');
  delete axios.defaults.headers.common['X-Employee-MTRC'];
  
  // Redirecionar para página de login
  window.location.href = '/login';
};