// src/components/layout/UserDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Componente de dropdown do usuário com opção de logout
 */
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Efeito para atualizar os dados do usuário quando mudar o estado de autenticação
  useEffect(() => {
    // Função para atualizar os dados do usuário
    const updateUserData = () => {
      const userData = authService.getCurrentUser();
      setUser(userData);
      console.log('[UserDropdown] Dados do usuário atualizados:', userData);
    };
    
    // Atualizar dados imediatamente
    updateUserData();
    
    // Registrar listener para eventos de autenticação
    const handleAuthChange = () => {
      console.log('[UserDropdown] Evento de mudança de autenticação detectado');
      updateUserData();
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    // Limpar ao desmontar
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);
  
  const handleLogout = () => {
    // Fazer logout
    authService.logout();
    
    // Disparar evento para notificar componentes sobre mudança de autenticação
    const authEvent = new CustomEvent('auth-state-changed', { 
      detail: { isLoggedIn: false, userData: null } 
    });
    window.dispatchEvent(authEvent);
    
    // Redirecionar para login
    navigate('/login');
  };
  
  // Fecha o dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
          user.role === 'ADM' || user.role === 'SUPER' 
            ? 'bg-blue-600' 
            : user.role 
              ? 'bg-green-600' 
              : 'bg-gray-500'
        }`}>
          {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="hidden md:block font-medium">
          {user.nome || user.mtrc}
          {user.role && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
              user.role === 'ADM' || user.role === 'SUPER' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          )}
        </span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.nome}</p>
            <p className="text-xs text-gray-500">Matrícula: {user.mtrc}</p>
            {user.uor && <p className="text-xs text-gray-500">UOR: {user.uor}</p>}
            {user.role && (
              <p className={`text-xs font-medium mt-1 rounded px-2 py-1 inline-block ${
                user.role === 'ADM' || user.role === 'SUPER' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </p>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;