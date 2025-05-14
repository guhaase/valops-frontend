// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageContainer from './components/layout/PageContainer';

// Auth components
import Login from './features/auth/Login';
import ProtectedRoute, { AdminRoute, ManagerRoute } from './features/auth/ProtectedRoute';
import LoginHandler from './features/auth/LoginHandler';
import AccessDenied from './features/auth/AccessDenied';
// Importe o AuthManager apenas se você já tiver criado o arquivo
// import AuthManager from './features/auth/AuthManager';

// Novo serviço API centralizado
import apiHelper from './services/apiService';

// Journey components
import ImprovedJourneyFlow from './features/journey/ImprovedJourneyFlow';

// Componentes de estágio
import DevelopmentStage from './components/stages/DevelopmentStage';
import CatalogationStage from './components/stages/CatalogationStage';
import ExtractionStage from './components/stages/ExtractionStage';
import TestingStage from './components/stages/TestingStage';
import ValidationStage from './components/stages/ValidationStage';
import EquipesTab from './components/stages/validation/EquipesTab';
import ImplementationStage from './components/stages/ImplementationStage';

// Training material components
import MaterialDetailPage from './features/training/MaterialDetailPage';
import MaterialDetailRobustez from './features/training/MaterialDetailRobustez';

// Componentes de funcionalidades
import NotebookList from './components/common/NotebookList';
import ApiDocs from './features/documentation/ApiDocs';
import AdminPanel from './features/admin/AdminPanel';

// Teste de notificações
import TestNotification from './components/common/TestNotification';

// Placeholder components when needed
const NotebookListFiltered = () => <NotebookList />;
const NotebookViewer = () => <div>Visualizador de Notebook</div>;
const ArticleListFiltered = () => <div>Lista de Artigos</div>;
const ArticleViewer = () => <div>Visualizador de Artigo</div>;

function App() {
  const [currentStage, setCurrentStage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNotebooks, setShowNotebooks] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Inicializar o sistema de autenticação quando o app carrega
  // Agora usando o apiHelper em vez do authService antigo
  useEffect(() => {
    // Se estiver autenticado, garantir que o token está aplicado
    if (apiHelper.auth && apiHelper.auth.isAuthenticated()) {
      // Verificar se a função existe antes de chamar
      if (apiHelper.auth && typeof apiHelper.auth.refreshAuthHeaders === 'function') {
        // Atualizar explicitamente os headers com o token
        apiHelper.auth.refreshAuthHeaders();
        console.log('Token de autenticação aplicado aos headers');
      } else {
        // Aplicação manual caso a função não exista ainda
        console.warn('função refreshAuthHeaders não encontrada, aplicando token manualmente');
        const token = localStorage.getItem('valops_auth_token');
        if (token) {
          // Verifique se apiService existe dentro de apiHelper
          if (apiHelper.apiService) {
            apiHelper.apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Token aplicado manualmente aos headers');
          } else {
            console.error('apiService não encontrado dentro de apiHelper');
          }
        }
      }
    } else {
      console.log('Nenhum token encontrado, usuário não autenticado');
    }
  }, []);

  const handleStageClick = (stage) => {
    setCurrentStage(stage);
    setShowDetails(true);
    setShowNotebooks(false);
    setShowApiDocs(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const toggleNotebooks = () => {
    setShowNotebooks(!showNotebooks);
    setShowDetails(false);
    setShowApiDocs(false);
  };

  const toggleApiDocs = () => {
    setShowApiDocs(!showApiDocs);
    setShowDetails(false);
    setShowNotebooks(false);
  };

  // Função para obter os estágios desativados da configuração
  const getDisabledStages = () => {
    try {
      const disabledStagesStr = localStorage.getItem('valops_disabled_stages');
      if (disabledStagesStr) {
        return JSON.parse(disabledStagesStr);
      }
    } catch (error) {
      console.error('Erro ao ler estágios desativados:', error);
    }
    return [];
  };
  
  const renderStageDetails = () => {
    // Obter estágios desativados da configuração
    const disabledStages = getDisabledStages();
    
    // Verificar se o estágio atual está desativado
    if (disabledStages.includes(currentStage)) {
      // Renderizar mensagem "Em Breve" em vez do componente
      return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-yellow-100">
            <svg className="w-8 h-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Funcionalidade em Desenvolvimento</h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade está em desenvolvimento e será disponibilizada em breve. Estamos trabalhando para entregar uma experiência completa e eficiente.
          </p>
          <button 
            onClick={handleCloseDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Voltar para o Fluxo
          </button>
        </div>
      );
    }
    
    // Renderizar normalmente para estágios disponíveis
    switch (currentStage) {
      case 'development':
        return <DevelopmentStage onClose={handleCloseDetails} />;
      case 'catalogation':
        return <CatalogationStage onClose={handleCloseDetails} />;
      case 'extraction':
        return <ExtractionStage onClose={handleCloseDetails} />;
      case 'testing':
        return <TestingStage onClose={handleCloseDetails} />;
      case 'validation':
        return <ValidationStage onClose={handleCloseDetails} />;
      case 'implementation':
        return <ImplementationStage onClose={handleCloseDetails} />;
      default:
        return null;
    }
  };

  // Main content component that combines the previous App functionality
  const MainContent = () => (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 border-b-2 border-blue-500 pb-4">
          ValOps - Operações de Validação
        </h1>



        {/* Renderização condicional do conteúdo principal */}
        {showApiDocs ? (
          <ApiDocs />
        ) : showNotebooks ? (
          <NotebookList />
        ) : showDetails ? (
          renderStageDetails()
        ) : (
          <ImprovedJourneyFlow onStageClick={handleStageClick} />
        )}
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      {/* Adicione o LoginHandler aqui */}
      <LoginHandler />
      {/* Se você adicionar o AuthManager, descomente a linha abaixo */}
      {/* <AuthManager /> */}
      
      <div className="min-h-screen flex flex-col">
        {/* Configure o ToastContainer com tema verde para notificações de upload */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Rota principal protegida */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            } />
            
            {/* Rota de Equipes - acessível para ADM, SUPERADM e GER */}
            <Route path="/equipes" element={
              <ManagerRoute>
                <PageContainer>
                  <div className="p-2 md:p-4">
                    <h1 className="text-2xl font-bold mb-4 text-blue-800">Gestão de Equipes</h1>
                    {/* Adicionando key com data para forçar remontagem do componente */}
                    <EquipesTab key={`equipes-${Date.now()}`} />
                  </div>
                </PageContainer>
              </ManagerRoute>
            } />
            
            {/* Nova rota para Administrador - apenas ADM e SUPERADM */}
            <Route path="/admin" element={
              <AdminRoute>
                <PageContainer>
                  <AdminPanel />
                </PageContainer>
              </AdminRoute>
            } />
            
            {/* Rotas aninhadas para o painel administrativo */}
            <Route path="/admin/notebooks" element={
              <AdminRoute>
                <PageContainer>
                  <NotebookListFiltered />
                </PageContainer>
              </AdminRoute>
            } />
            
            <Route path="/admin/notebooks/:id" element={
              <AdminRoute>
                <PageContainer>
                  <NotebookViewer />
                </PageContainer>
              </AdminRoute>
            } />
            
            <Route path="/admin/articles" element={
              <AdminRoute>
                <PageContainer>
                  <ArticleListFiltered />
                </PageContainer>
              </AdminRoute>
            } />
            
            <Route path="/admin/articles/:id" element={
              <AdminRoute>
                <PageContainer>
                  <ArticleViewer />
                </PageContainer>
              </AdminRoute>
            } />
            
            <Route path="/admin/models" element={
              <AdminRoute>
                <PageContainer>
                  <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Gerenciamento de Modelos</h1>
                    <div className="bg-white rounded shadow p-4">
                      <p>Gestão de modelos em desenvolvimento...</p>
                    </div>
                  </div>
                </PageContainer>
              </AdminRoute>
            } />
            
            <Route path="/admin/users" element={
              <AdminRoute>
                <PageContainer>
                  <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
                    <div className="bg-white rounded shadow p-4">
                      <p>Gestão de usuários em desenvolvimento...</p>
                    </div>
                  </div>
                </PageContainer>
              </AdminRoute>
            } />
            
            {/* Rotas para materiais de treinamento */}
            <Route path="/testing/training/material/:materialId" element={
              <ProtectedRoute>
                <PageContainer>
                  <MaterialDetailPage />
                </PageContainer>
              </ProtectedRoute>
            } />
            
            <Route path="/testing/training/material/robustez" element={
              <ProtectedRoute>
                <PageContainer>
                  <MaterialDetailRobustez />
                </PageContainer>
              </ProtectedRoute>
            } />
            
            {/* Rota de perfil acessível para todos os usuários */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageContainer>
                  <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
                    <div className="bg-white rounded shadow p-4">
                      <p>Esta página está em desenvolvimento...</p>
                    </div>
                  </div>
                </PageContainer>
              </ProtectedRoute>
            } />
            
            {/* Rota de teste para notificações */}
            <Route path="/test-notification" element={
              <PageContainer>
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-4 text-blue-800">Teste de Notificações</h1>
                  <TestNotification />
                </div>
              </PageContainer>
            } />
            
            {/* Redireciona rotas desconhecidas para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;