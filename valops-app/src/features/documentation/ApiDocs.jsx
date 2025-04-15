// src/components/ApiDocs.jsx
import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink } from 'lucide-react';

const ApiDocs = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('notebooks');
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const endpoints = [
    {
      id: 'notebooks',
      name: 'Notebooks',
      description: 'Endpoints para gerenciar notebooks',
      routes: [
        {
          id: 'get-notebooks',
          method: 'GET',
          path: '/notebooks/',
          description: 'Listar todos os notebooks',
          parameters: [
            { name: 'skip', type: 'int', required: false, description: 'Quantidade de notebooks para pular' },
            { name: 'limit', type: 'int', required: false, description: 'Limite de notebooks para retornar' },
            { name: 'category_id', type: 'int', required: false, description: 'Filtrar por categoria' },
            { name: 'subcategory_id', type: 'int', required: false, description: 'Filtrar por subcategoria' }
          ],
          example: `fetch('${API_BASE_URL}/notebooks/')
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
          id: 'get-notebook',
          method: 'GET',
          path: '/notebooks/{notebook_id}',
          description: 'Obter um notebook específico',
          parameters: [
            { name: 'notebook_id', type: 'int', required: true, description: 'ID do notebook' }
          ],
          example: `fetch('${API_BASE_URL}/notebooks/1')
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
          id: 'download-notebook',
          method: 'GET',
          path: '/notebooks/{notebook_id}/download',
          description: 'Baixar um notebook',
          parameters: [
            { name: 'notebook_id', type: 'int', required: true, description: 'ID do notebook' }
          ],
          example: `// Open in new tab to download
window.open('${API_BASE_URL}/notebooks/1/download', '_blank');`
        },
        {
          id: 'create-notebook',
          method: 'POST',
          path: '/notebooks/',
          description: 'Criar um novo notebook',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Nome do notebook' },
            { name: 'path', type: 'string', required: true, description: 'Caminho do arquivo' },
            { name: 'description', type: 'string', required: false, description: 'Descrição do notebook' },
            { name: 'category_id', type: 'int', required: false, description: 'ID da categoria' },
            { name: 'subcategory_id', type: 'int', required: false, description: 'ID da subcategoria' }
          ],
          example: `fetch('${API_BASE_URL}/notebooks/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Novo Notebook',
    path: '/path/to/notebook.ipynb',
    description: 'Descrição do notebook',
    category_id: 1,
    subcategory_id: 2
  }),
})
  .then(response => response.json())
  .then(data => console.log(data));`
        }
      ]
    },
    {
      id: 'model-types',
      name: 'Tipos de Modelos',
      description: 'Endpoints para gerenciar tipos de modelos e testes',
      routes: [
        {
          id: 'get-categories',
          method: 'GET',
          path: '/model-types/categories/',
          description: 'Listar todas as categorias de modelos',
          parameters: [],
          example: `fetch('${API_BASE_URL}/model-types/categories/')
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
          id: 'get-tree',
          method: 'GET',
          path: '/model-types/tree/',
          description: 'Obter a árvore completa de categorias, subcategorias e tipos de modelos',
          parameters: [],
          example: `fetch('${API_BASE_URL}/model-types/tree/')
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
          id: 'get-model-types',
          method: 'GET',
          path: '/model-types/model-types/',
          description: 'Listar todos os tipos de modelos',
          parameters: [
            { name: 'category_id', type: 'int', required: false, description: 'Filtrar por categoria' },
            { name: 'subcategory_id', type: 'int', required: false, description: 'Filtrar por subcategoria' }
          ],
          example: `fetch('${API_BASE_URL}/model-types/model-types/?category_id=1')
  .then(response => response.json())
  .then(data => console.log(data));`
        }
      ]
    },
    {
      id: 'upload',
      name: 'Upload',
      description: 'Endpoints para upload de arquivos',
      routes: [
        {
          id: 'upload-file',
          method: 'POST',
          path: '/upload/',
          description: 'Upload de um arquivo',
          parameters: [
            { name: 'file', type: 'file', required: true, description: 'Arquivo a ser enviado' }
          ],
          example: `const formData = new FormData();
formData.append('file', fileObject);

fetch('${API_BASE_URL}/upload/', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
          id: 'upload-info',
          method: 'GET',
          path: '/upload/info',
          description: 'Obter informações sobre o serviço de upload',
          parameters: [],
          example: `fetch('${API_BASE_URL}/upload/info')
  .then(response => response.json())
  .then(data => console.log(data));`
        }
      ]
    }
  ];

  const renderParameters = (parameters) => {
    if (parameters.length === 0) {
      return <p className="text-gray-500 italic">Nenhum parâmetro</p>;
    }

    return (
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatório</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {parameters.map((param, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm">{param.name}</td>
              <td className="px-4 py-2 text-sm">{param.type}</td>
              <td className="px-4 py-2 text-sm">{param.required ? 'Sim' : 'Não'}</td>
              <td className="px-4 py-2 text-sm">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderEndpoint = (endpoint) => {
    const activeGroup = endpoints.find(e => e.id === activeEndpoint);
    
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">{activeGroup.name}</h3>
          <p className="text-gray-700">{activeGroup.description}</p>
        </div>

        {activeGroup.routes.map(route => (
          <div key={route.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs font-medium rounded mr-3 ${
                  route.method === 'GET' ? 'bg-green-100 text-green-800' :
                  route.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  route.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {route.method}
                </span>
                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{route.path}</code>
              </div>
              <a 
                href={`${API_BASE_URL}/docs#/${activeGroup.id}/${route.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <ExternalLink size={14} className="mr-1" />
                API Docs
              </a>
            </div>
            
            <p className="text-gray-700 mb-4">{route.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Parâmetros</h4>
              {renderParameters(route.parameters)}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Exemplo</h4>
              <div className="relative bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <button 
                  onClick={() => copyToClipboard(route.example, route.id)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                  title="Copiar código"
                >
                  {copied === route.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <pre className="text-sm">{route.example}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-800">Documentação da API</h2>
        <a 
          href={`${API_BASE_URL}/docs`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
        >
          <Code size={16} className="mr-2" />
          Swagger UI
        </a>
      </div>

      <div className="flex mb-6">
        <div className="flex space-x-2 border-b border-gray-200 w-full">
          {endpoints.map(endpoint => (
            <button
              key={endpoint.id}
              onClick={() => setActiveEndpoint(endpoint.id)}
              className={`py-2 px-4 font-medium text-sm ${
                activeEndpoint === endpoint.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {endpoint.name}
            </button>
          ))}
        </div>
      </div>

      {renderEndpoint(activeEndpoint)}
    </div>
  );
};

export default ApiDocs;