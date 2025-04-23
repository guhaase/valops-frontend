// src/components/layout/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import authService from '../../services/authService';
import config from '../../config';

/**
 * Componente de cabeçalho da aplicação
 * Menu "Administrador" - visível apenas para usuários com role ADM ou SUPERADM
 * Menu "Equipes" - visível apenas para usuários com role ADM, SUPERADM ou GER
 * Link de Perfil é mostrado para todos os usuários autenticados
 * Exibe dropdown do usuário à direita quando autenticado, ou link de login quando não autenticado
 */
const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Função para atualizar o estado com os dados do usuário atual
  const updateUserData = () => {
    const isUserAuthenticated = authService.isAuthenticated();
    setIsAuthenticated(isUserAuthenticated);
    
    if (isUserAuthenticated) {
      const user = authService.getCurrentUser();
      setUserData(user);
      setUserRole(user?.role || null);
      
      console.log('[Header] Dados do usuário atualizados:', {
        nome: user?.nome,
        matricula: user?.mtrc,
        role: user?.role
      });
    } else {
      setUserData(null);
      setUserRole(null);
    }
  };
  
  // Efeito para verificar o papel do usuário quando o componente montar
  useEffect(() => {
    // Atualizar dados do usuário imediatamente
    updateUserData();
    
    // Escutar por eventos de mudança de autenticação
    const handleAuthChange = (event) => {
      console.log('[Header] Evento de mudança de autenticação detectado', event.detail);
      updateUserData();
    };
    
    // Registrar listener para eventos de autenticação
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    // Limpar ao desmontar
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);
  
  // Forçar a verificação de role quando o componente montar
  useEffect(() => {
    if (isAuthenticated && (!userData || !userData.role)) {
      // Se está autenticado mas sem role, tentar obter a role
      const checkUserRole = async () => {
        try {
          const mtrc = authService.getMatricula();
          if (!mtrc) return;
          
          // Construir URL para endpoint de role usando a URL base da API
          const baseUrl = config.api.baseUrl;
          const roleUrl = `http://localhost:8000/login/user-role?matricula=${mtrc}`;
          
          console.log('[Header] Buscando role do usuário:', roleUrl);
          // Adicionar headers necessários para autenticação
          const headers = {
            'X-Employee-MTRC': mtrc
          };
          const response = await fetch(roleUrl, { headers });
          const data = await response.json();
          
          if (data && data.role) {
            console.log('[Header] Role recebida do backend:', data.role);
            
            // Atualizar o userData com a role obtida
            const currentUser = authService.getCurrentUser() || {};
            const updatedUser = { ...currentUser, role: data.role };
            
            // Salvar no localStorage
            localStorage.setItem('valops_user', JSON.stringify(updatedUser));
            
            // Atualizar estado do componente
            setUserData(updatedUser);
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('[Header] Erro ao obter role:', error);
        }
      };
      
      checkUserRole();
    }
  }, [isAuthenticated, userData]);
  
  return (
    <header className="bg-white shadow-md">
      <div className="w-full max-w-none px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              ValOps {(userRole === 'ADM' || userRole === 'SUPER') && <span className="text-sm text-blue-600 ml-1">(ADM)</span>}
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              {/* Menu "Administrador" - sempre visível conforme solicitado */}
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-gray-900"
              >
                Administrador
              </Link>
              
              {/* Menu "Equipes" - sempre visível conforme solicitado */}
              <Link 
                to={`/equipes?t=${Date.now()}`} 
                className="text-gray-600 hover:text-gray-900"
              >
                Equipes
              </Link>
              
              {/* Menu de perfil para todos os usuários autenticados */}
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-gray-900"
              >
                Perfil
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;