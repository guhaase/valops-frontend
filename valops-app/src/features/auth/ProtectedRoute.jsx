// src/features/auth/ProtectedRoute.jsx - Com verificação de papel/role
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiHelper from '../../services/apiService';
import authService from '../../services/authService';

/**
 * Componente que protege rotas que exigem autenticação e controla acesso baseado em papéis/roles
 * Redireciona para a página de login se o usuário não estiver autenticado
 * Redireciona para a página inicial se o usuário não tiver o papel necessário
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const isAuthenticated = apiHelper.auth.isAuthenticated();
  
  // Atualizar o header de autenticação sempre que o componente for renderizado
  useEffect(() => {
    if (isAuthenticated) {
      apiHelper.auth.refreshAuthHeaders();
    }
  }, [isAuthenticated]);
  
  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Se houver um papel/role necessário, verifica se o usuário tem permissão
  if (requiredRole) {
    const hasPermission = authService.hasRole(requiredRole);
    
    if (!hasPermission) {
      // Redireciona para a página de acesso negado se não tiver permissão
      return <Navigate to="/access-denied" replace />;
    }
  }
  
  return children;
};

// Componente para proteger rotas que exigem papel de administrador (ADM ou SUPER)
export const AdminRoute = ({ children }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = user?.role;
  
  // Verifica papéis de administrador (mais flexível)
  const isAdmin = (
    role === 'ADM' || 
    role === 'SUPER' || 
    role === 'SUPERADM' || 
    role === 'super_admin'
  );
  
  console.log('[AdminRoute] Verificando acesso admin:', { 
    nome: user?.nome,
    mtrc: user?.mtrc,
    role: role,
    isAdmin: isAdmin 
  });
  
  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }
  
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

// Componente para proteger rotas que exigem papel de gerente (GER, ADM, ou SUPER)
export const ManagerRoute = ({ children }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = user?.role;
  
  // Verifica papéis de gerente ou superior (mais flexível)
  const hasAccess = (
    role === 'GER' || 
    role === 'ADM' || 
    role === 'SUPER' || 
    role === 'SUPERADM' ||
    role === 'super_admin'
  );
  
  console.log('[ManagerRoute] Verificando acesso gerencial:', { 
    nome: user?.nome,
    mtrc: user?.mtrc,
    role: role,
    hasAccess: hasAccess 
  });
  
  if (!hasAccess) {
    return <Navigate to="/access-denied" replace />;
  }
  
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default ProtectedRoute;