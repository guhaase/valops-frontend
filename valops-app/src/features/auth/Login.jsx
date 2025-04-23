// src/features/auth/Login.jsx - Versão atualizada
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config, { log } from '../../config';
import apiHelper from '../../services/apiService';

const Login = () => {
  const [mtrc, setMtrc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtém o caminho de redirecionamento, ou vai para o dashboard
  const from = location.state?.from?.pathname || '/';
  
  // Em ambiente de produção, não mostramos a tela de login
  // e tentamos fazer auto-login
  useEffect(() => {
    const checkEnvironment = async () => {
      // Verificar se estamos em ambiente de produção
      const appEnv = config.app.environment;
      log.debug('Ambiente detectado no Login:', appEnv);
      console.log('Login - Ambiente detectado:', appEnv);
      
      if (appEnv === 'production') {
        log.debug('Ambiente de produção detectado, tentando auto-login');
        console.log('Ambiente de produção detectado, tentando auto-login');
        try {
          // Tentar auto-login
          await apiHelper.auth.autoLogin();
          log.debug('Auto-login bem-sucedido, redirecionando');
          navigate(from, { replace: true });
        } catch (error) {
          log.error('Falha no auto-login:', error);
          // Redirecionar para página de problema de autenticação
          navigate('/access-denied', { replace: true });
        }
      } else {
        console.log('Ambiente não é produção, mostrando formulário de login');
      }
    };
    
    checkEnvironment();
  }, [navigate, from]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mtrc.trim()) {
      setError('Por favor, informe sua matrícula');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      log.debug('Tentando login com matrícula:', mtrc);
      
      // Usar o serviço de autenticação para fazer login
      const userData = await apiHelper.auth.login(mtrc);
      log.debug('Resposta do login:', userData);
      
      // Redirecionar para a página inicial
      navigate(from, { replace: true });
    } catch (error) {
      log.error('Erro no login:', error);
      
      let errorMessage = 'Matrícula inválida ou não cadastrada';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Em produção, não mostrar o formulário de login
  console.log('Login render - Ambiente:', config.app.environment);
  const isProd = config.app.environment === 'production';
  console.log('Login render - É produção?', isProd ? 'Sim' : 'Não');
  
  if (isProd) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="w-8 h-8 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{config.app.name}</h1>
          <p className="text-gray-600">Autenticando automaticamente...</p>
          <p className="text-sm text-gray-500 mt-4">Você será redirecionado automaticamente.</p>
        </div>
      </div>
    );
  }

  // Versão para o ambiente de desenvolvimento conforme solicitado
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ValOps</h1>
          <p className="text-gray-600 mt-2">Faça login para acessar o sistema</p>
        </div>
        
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
              placeholder="Digite sua matrícula"
              disabled={loading}
            />
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Para acesso, utilize sua matrícula do sistema</p>
        </div>
        
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>Ambiente: development</p>
          <p>API: http://10.2.98.165:8000</p>
        </div>
      </div>
    </div>
  );
};

export default Login;