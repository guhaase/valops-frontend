// src/features/admin/training/TrainingCategories.jsx
import React, { useState, useEffect } from 'react';
import trainingService from '../../../services/trainingService';
import { safeRender, safeRenderShort } from '../../../utils/safeRenderUtils';

const TrainingCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: ''
  });

  // Carregar categorias
  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Resposta simulada para depuração, caso a API real não esteja funcionando
      // Remova esta linha quando a API estiver pronta
      //setCategories([{id: 1, name: 'Categoria Teste', description: 'Descrição teste', icon: 'icon-test'}]);
      //setLoading(false);
      //return;
      
      const data = await trainingService.getAllCategories();
      console.log('Dados recebidos da API:', data);
      
      // Verificar se data é um array
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === 'object') {
        // Se for um objeto, tente extrair um array de propriedades conhecidas
        if (Array.isArray(data.items)) {
          setCategories(data.items);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          // Último recurso: converter o objeto em array se possível
          console.warn('Resposta inesperada da API de categorias:', data);
          const categoryArray = Object.values(data).filter(item => 
            item && typeof item === 'object' && item.name
          );
          setCategories(categoryArray.length > 0 ? categoryArray : []);
        }
      } else {
        // Caso não consiga obter dados válidos
        console.error('Formato de dados inválido para categorias:', data);
        setCategories([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError(`Erro ao carregar categorias: ${err.response?.data?.detail || err.message}`);
      setCategories([]); // Garantir que temos um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Manipulação do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      icon: ''
    });
    setEditingCategory(null);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category.id);
    setFormData({
      id: category.id || '',
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon
      };
      
      let result;
      
      if (editingCategory) {
        // Atualizar categoria existente
        result = await trainingService.updateCategory(editingCategory, categoryData);
        
        // Atualizar a lista de categorias
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory ? result : cat)
        );
      } else {
        // Criar nova categoria
        result = await trainingService.createCategory(categoryData);
        
        // Adicionar à lista de categorias
        setCategories(prev => [...prev, result]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError(`Erro ao salvar categoria: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário de categoria */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ícone (nome da classe ou código)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Salvando...' : editingCategory ? 'Atualizar' : 'Criar'}
            </button>
            
            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Lista de categorias */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Categorias Cadastradas</h2>
        
        {loading && !editingCategory ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Nome</th>
                  <th className="py-3 px-6 text-left">Descrição</th>
                  <th className="py-3 px-6 text-left">Ícone</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {categories.map((category, index) => (
                  <tr key={category.id || `category-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{safeRender(category.id)}</td>
                    <td className="py-3 px-6 font-medium">{safeRender(category.name)}</td>
                    <td className="py-3 px-6">
                      {safeRenderShort(category.description, 50)}
                    </td>
                    <td className="py-3 px-6">{safeRender(category.icon)}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        disabled={loading}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Debug - Remover em produção */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-sm font-bold mb-2">Debug - Raw Categories Data:</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(categories, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TrainingCategories;