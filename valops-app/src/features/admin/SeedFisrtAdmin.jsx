// src/features/admin/SeedFirstAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

/**
 * Componente para adicionar o primeiro administrador do sistema.
 * Esta página só deve ser acessível se não existirem administradores cadastrados.
 */
const SeedFirstAdmin = () => {
  const [mtrc, setMtrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkingAdmins, setCheckingAdmins] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(false);
  
  const navigate = useNavigate();
  
  // Verificar se já existem administradores
  useEffect(() => {
    const checkExistingAdmins = async () => {
      try {
        // Tentamos ver se existem administradores fazendo uma requisição para listar
        await adminService.getAllAdmins();
        // Se conseguir acessar, significa que já existem admins e o usuário atual é um deles
        setHasAdmins(true);
        // Redirecionar para o painel de admin após um pequeno delay
        setTimeout(() => navigate('/admin'), 2000);
      } catch (err) {
        if (err.response) {
          // Se receber erro 403, significa que existem admins mas o usuário não é um deles
          if (err.response.status === 403) {
            setHasAdmins(true);
            setTimeout(() => navigate('/'), 2000);
          } else {
            // Outros erros podem significar que não há admins ainda (404 por exemplo)
            setHasAdmins(false);
          }
        } else {
          // Em caso de erro de rede ou outro tipo de erro, vamos supor que não há admins
          setHasAdmins(false);
        }
      } finally {
        setCheckingAdmins(false);
        setLoading(false);
      }
    };
    
    checkExistingAdmins();
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mtrc.trim()) {
      setError('Por favor, informe uma matrícula válida');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Adiciona o primeiro administrador
      await adminService.seedFirstAdmin(mtrc);
      
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      console.error('Erro ao adicionar administrador:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Erro ao adicionar administrador. Verifique se a matrícula existe.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Exibe tela de carregamento enquanto verifica se existem admins
  if (checkingAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando configuração do sistema...</p>
        </div>
      </div>
    );
  }
  
  // Se já existem administradores, exibe mensagem e redireciona
  if (hasAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuração Já Realizada</h1>
          <p className="text-gray-600 mb-4">
            O sistema já possui administradores cadastrados.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando...
          </p>
        </div>
      </div>
    );
  }
  
  // Exibe o formulário para adicionar o primeiro administrador
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-blue-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Configuração Inicial do ValOps</h1>
          <p className="text-gray-600 mt-2">Defina o primeiro administrador do sistema</p>
        </div>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            <p className="font-medium">Administrador cadastrado com sucesso!</p>
            <p className="text-sm mt-2">Redirecionando para o painel administrativo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="mtrc"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Matrícula
              </label>
              <input
                type="text"
                id="mtrc"
                value={mtrc}
                onChange={(e) => setMtrc(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite a matrícula do primeiro administrador"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Insira uma matrícula válida existente no sistema
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Processando...
                </>
              ) : (
                'Configurar Administrador'
              )}
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Esta operação só pode ser realizada uma vez no sistema</p>
          <p className="mt-2">O primeiro administrador poderá adicionar outros posteriormente</p>
        </div>
      </div>
    </div>
  );
};

export default SeedFirstAdmin;