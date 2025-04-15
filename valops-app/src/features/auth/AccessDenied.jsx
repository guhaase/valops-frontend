// src/features/auth/AccessDenied.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de página de acesso negado
 * Exibido quando um usuário tenta acessar uma página para a qual não tem permissão
 */
const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-100">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Restrito</h1>
        
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta área.
          As opções disponíveis no menu podem variar de acordo com seu perfil de acesso.
        </p>
        
        <p className="text-gray-500 mb-6 text-sm">
          Se você acredita que deveria ter acesso a esta área, entre em contato 
          com o administrador do sistema.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Voltar para a página inicial
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Voltar para a página anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;