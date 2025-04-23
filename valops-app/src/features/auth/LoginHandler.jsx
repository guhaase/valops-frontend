// src/features/auth/LoginHandler.jsx - Versão com suporte a debug de roles
import React, { useEffect } from 'react';
import apiHelper from '../../services/apiService';
import authService from '../../services/authService';

const LoginHandler = () => {
  // Esta função é chamada sempre que o componente monta
  useEffect(() => {
    // Verificar se há matrícula e aplicá-la explicitamente
    const mtrc = localStorage.getItem('valops_mtrc');
    
    if (mtrc) {
      console.log('[LoginHandler] Matrícula encontrada! Garantindo que está aplicada...');
      
      // Debug dos dados do usuário atual
      const userData = authService.getCurrentUser();
      console.log('[LoginHandler] Dados do usuário atual:', userData);
      console.log('[LoginHandler] Role do usuário:', userData?.role);
      console.log('[LoginHandler] É admin?', authService.isAdmin());
      
      // Aplicar a matrícula explicitamente
      if (apiHelper.auth && typeof apiHelper.auth.refreshAuthHeaders === 'function') {
        apiHelper.auth.refreshAuthHeaders();
      } else {
        // Fallback caso a função não esteja definida
        console.warn('[LoginHandler] refreshAuthHeaders não encontrado, aplicando manualmente');
        // Aplicação manual da matrícula
        if (window.axios) {
          window.axios.defaults.headers.common['X-Employee-MTRC'] = mtrc;
        }
      }
      
      // Verificar papel do usuário com endpoint específico
      // Apenas se o papel não estiver definido 
      if (!userData || !userData.role) {
        const checkUserRole = async () => {
          try {
            // Tentar obter o papel do usuário do backend
            const response = await fetch(`http://localhost:8000/login/user-role?matricula=${mtrc}`);
            const data = await response.json();
            
            if (data && data.role) {
              console.log('[LoginHandler] Papel obtido do backend:', data.role);
              
              // Atualizar dados do usuário com o papel recebido
              const updatedUserData = { ...userData, role: data.role };
              localStorage.setItem('valops_user', JSON.stringify(updatedUserData));
            }
          } catch (error) {
            console.error('[LoginHandler] Erro ao obter papel do usuário:', error);
          }
        };
        
        // Executar a verificação de papel
        checkUserRole();
      } else {
        console.log('[LoginHandler] Usuário já tem papel definido:', userData.role);
      }
    } else {
      console.log('[LoginHandler] Nenhuma matrícula encontrada.');
    }
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
};

export default LoginHandler;