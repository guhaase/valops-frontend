// src/features/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAdminMtrc, setNewAdminMtrc] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Verificar se o usuário é administrador e carregar a lista
  useEffect(() => {
    const checkAdminAndLoad = async () => {
      try {
        setLoading(true);
        
        // Primeiramente, verificar o papel do usuário no localStorage
        const user = localStorage.getItem('valops_user');
        let userData = null;
        
        try {
          userData = user ? JSON.parse(user) : null;
        } catch (e) {
          console.error('[AdminPanel] Erro ao processar dados do usuário:', e);
        }
        
        // Verificar se o usuário tem papel de admin a partir dos dados locais
        const role = userData?.role;
        const isAdminRole = role === 'ADM' || role === 'SUPER' || role === 'SUPERADM' || role === 'super_admin';
        
        console.log('[AdminPanel] Verificando dados do usuário:', {
          nome: userData?.nome,
          mtrc: userData?.mtrc,
          role: role,
          isAdminRole: isAdminRole
        });
        
        if (isAdminRole) {
          setIsAdmin(true);
          
          // Carrega a lista de administradores
          try {
            const adminsList = await adminService.getAllAdmins();
            setAdmins(adminsList);
          } catch (listError) {
            console.error('[AdminPanel] Erro ao carregar lista:', listError);
            setAdmins([]); // Lista vazia em caso de erro
          }
        } else {
          // Tenta verificar via API como fallback
          try {
            const adminStatus = await adminService.isCurrentUserAdmin();
            setIsAdmin(adminStatus);
            
            if (adminStatus) {
              // Carrega a lista de administradores
              const adminsList = await adminService.getAllAdmins();
              setAdmins(adminsList);
            } else {
              setError('Você não tem permissão para acessar esta página');
              // Redirecionar após 3 segundos
              setTimeout(() => navigate('/'), 3000);
            }
          } catch (apiError) {
            console.error('[AdminPanel] Erro na verificação da API:', apiError);
            // Assumir que o usuário não é admin se a API falhar
            setIsAdmin(false);
            setError('Não foi possível verificar suas permissões. Tente novamente mais tarde.');
            setTimeout(() => navigate('/'), 3000);
          }
        }
      } catch (err) {
        console.error('[AdminPanel] Erro geral:', err);
        setError(`Erro ao carregar dados: ${err.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAndLoad();
  }, [navigate]);

  // Adicionar novo administrador
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminMtrc.trim()) {
      setError('Por favor, informe uma matrícula válida');
      return;
    }
    
    try {
      setLoading(true);
      const newAdmin = await adminService.addAdmin(newAdminMtrc);
      setAdmins([...admins, newAdmin]);
      setNewAdminMtrc('');
      setError(null);
    } catch (err) {
      setError(`Erro ao adicionar administrador: ${err.response?.data?.detail || err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Remover administrador
  const handleRemoveAdmin = async (mtrc) => {
    if (window.confirm(`Tem certeza que deseja remover o administrador com matrícula ${mtrc}?`)) {
      try {
        setLoading(true);
        await adminService.removeAdmin(mtrc);
        setAdmins(admins.filter(admin => admin.mtrc !== mtrc));
      } catch (err) {
        setError(`Erro ao remover administrador: ${err.response?.data?.detail || err.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Renderização condicional com base no estado de carregamento e permissões
  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold">Acesso Negado</h2>
            <p className="mt-2">{error || 'Você não tem permissão para acessar esta página'}</p>
            <p className="mt-4 text-sm">Redirecionando para a página inicial...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Painel de Administradores</h1>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Formulário para adicionar novo administrador */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Administrador</h2>
        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newAdminMtrc}
            onChange={(e) => setNewAdminMtrc(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Matrícula do funcionário"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Adicionar'}
          </button>
        </form>
      </div>
      
      {/* Lista de administradores */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Administradores Cadastrados</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : admins.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum administrador cadastrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Matrícula</th>
                  <th className="py-3 px-6 text-left">Função</th>
                  <th className="py-3 px-6 text-left">Criado Em</th>
                  <th className="py-3 px-6 text-left">Criado Por</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{admin.id}</td>
                    <td className="py-3 px-6 font-medium">{admin.mtrc}</td>
                    <td className="py-3 px-6">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        admin.role === 'SUPER' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3 px-6">{new Date(admin.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-6">{admin.created_by || '-'}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleRemoveAdmin(admin.mtrc)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;