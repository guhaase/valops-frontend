// src/features/auth/AuthManager.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiHelper from '../../services/apiService';
import config from '../../config';

/**
 * Componente que gerencia o estado global de autenticação
 * Verifica periodicamente a validade do token e o aplica corretamente
 */
const AuthManager = () => {
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());
  const navigate = useNavigate();

  // Verificar autenticação quando o componente montar
  useEffect(() => {
    const checkAuth = async () => {
      // Verificar se estamos em ambiente de produção
      const appEnv = apiHelper.config?.app?.environment;
      const isProd = appEnv === 'production';
      console.log(`[AuthManager] Ambiente definido como: "${appEnv}"`);
      console.log(`[AuthManager] É produção? ${isProd ? 'Sim' : 'Não'}`);
      
      // Acesso direto à configuração para debug
      console.log('[AuthManager] config.app:', apiHelper.config?.app);
      console.log('[AuthManager] Verificando config diretamente:', config.app.environment);
      
      const isAuthenticated = apiHelper.auth.isAuthenticated();
      console.log('[AuthManager] Estado de autenticação ao montar:', isAuthenticated);
      
      // Se o token existir, garantir que está aplicado
      if (isAuthenticated) {
        refreshToken();
      } else {
        // Em produção, tentar auto-login antes de redirecionar
        if (isProd) {
          try {
            console.log('[AuthManager] Tentando auto-login em ambiente de produção');
            await apiHelper.auth.autoLogin();
            refreshToken();
            return; // Sucesso no auto-login, não precisamos redirecionar
          } catch (error) {
            console.error('[AuthManager] Falha no auto-login:', error);
            // Continuar para o comportamento normal se o auto-login falhar
          }
        }
        
        // Se não estiver autenticado e não estiver na página de login, redirecionar
        if (window.location.pathname !== '/login') {
          console.log('[AuthManager] Redirecionando para login (não autenticado)');
          
          // Em produção, redirecionar para página de erro em vez de login
          if (isProd) {
            navigate('/access-denied');
          } else {
            navigate('/login');
          }
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Verificar o token periodicamente (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      const isAuthenticated = apiHelper.auth.isAuthenticated();
      if (isAuthenticated) {
        refreshToken();
      }
      setLastAuthCheck(Date.now());
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [navigate]);

  // Renovar explicitamente o token para garantir que está sendo aplicado corretamente
  const refreshToken = () => {
    console.log('[AuthManager] Renovando o token de autenticação');
    
    // Aplicar o token em todos os serviços
    const result = apiHelper.auth.refreshAuthHeaders();
    if (!result) {
      console.error('[AuthManager] Falha ao renovar token');
      navigate('/login');
      return;
    }
    
    // Verificar se os dados do usuário estão no localStorage e completos
    const userData = apiHelper.auth.getCurrentUser();
    if (!userData || !userData.role) {
      console.log('[AuthManager] Dados do usuário incompletos, buscando do servidor...');
      fetchUserRole();
    }
    
    // Para debug: testar uma chamada API
    testAuthWithRequest();
  };
  
  // Buscar o papel do usuário do servidor e atualizar localStorage
  const fetchUserRole = async () => {
    try {
      const mtrc = apiHelper.auth.getMatricula();
      if (!mtrc) return;
      
      console.log('[AuthManager] Buscando papel do usuário para matrícula:', mtrc);
      
      // Construir URL para endpoint de role
      const baseUrl = config.api.baseUrl;
      const roleUrl = `${baseUrl}/api/login/user-role?matricula=${mtrc}`;
      
      // Adicionar headers necessários
      const headers = {
        'X-Employee-MTRC': mtrc
      };
      
      const response = await fetch(roleUrl, { headers });
      const data = await response.json();
      
      if (data && data.role) {
        console.log('[AuthManager] Papel recebido do servidor:', data.role);
        
        // Obter dados atuais e atualizar com o papel
        const currentUser = apiHelper.auth.getCurrentUser() || {};
        const updatedUser = { 
          ...currentUser, 
          mtrc: mtrc,
          role: data.role 
        };
        
        // Salvar no localStorage
        localStorage.setItem('valops_user', JSON.stringify(updatedUser));
        
        // Notificar a aplicação sobre a mudança
        const authEvent = new CustomEvent('auth-state-changed', { 
          detail: { isLoggedIn: true, userData: updatedUser } 
        });
        window.dispatchEvent(authEvent);
      }
    } catch (error) {
      console.error('[AuthManager] Erro ao buscar papel do usuário:', error);
    }
  };

  // Fazer uma chamada simples para testar a autenticação
  const testAuthWithRequest = async () => {
    try {
      // Escolher um endpoint simples que exija autenticação
      console.log('[AuthManager] Testando autenticação com uma chamada API');
      await apiHelper.categories.getAll();
      console.log('[AuthManager] Teste de autenticação bem-sucedido');
    } catch (error) {
      console.error('[AuthManager] Erro no teste de autenticação:', error);
      
      // Se o erro for 401 ou 403, precisamos redirecionar para login
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn('[AuthManager] Problema de autenticação detectado, redirecionando para login');
        // Limpar dados de autenticação
        apiHelper.auth.logout();
        navigate('/login');
      }
    }
  };

  // Este componente não renderiza nada visualmente
  return null;
};

export default AuthManager;