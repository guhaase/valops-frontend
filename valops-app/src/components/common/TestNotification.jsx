// TestNotification.jsx - Component to test notification system
import React, { useState } from 'react';
import articleService from '../../services/articleService';
import notebookService from '../../services/notebookService';
import { toast } from 'react-toastify';

const TestNotification = () => {
  const [matricula, setMatricula] = useState('F3876812');

  // Function to save matricula to localStorage
  const saveMatricula = () => {
    localStorage.setItem('valops_mtrc', matricula);
    localStorage.setItem('valops_user', JSON.stringify({ mtrc: matricula, nome: 'Usuário Teste' }));
    
    toast.success(
      <div>
        <strong>Matrícula salva com sucesso!</strong>
        <div>{matricula}</div>
      </div>,
      {
        className: "success-toast",
        style: { background: "#ecfdf5", borderLeft: "4px solid #10b981", color: "#065f46" }
      }
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Testar Sistema de Notificações</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matrícula para teste
        </label>
        <div className="flex">
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
            placeholder="Digite uma matrícula"
          />
          <button
            onClick={saveMatricula}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Esta matrícula será usada nas notificações de upload
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Testar upload de artigo</h3>
          <button
            onClick={() => articleService.simulateUpload()}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Simular Upload de Artigo
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Testar upload de notebook</h3>
          <button
            onClick={() => notebookService.simulateUpload()}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Simular Upload de Notebook
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Como usar</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Digite uma matrícula no campo acima e clique em "Salvar"</li>
          <li>Clique em um dos botões para simular o upload</li>
          <li>Uma notificação verde deve aparecer no canto superior direito</li>
          <li>A notificação deve mostrar a matrícula, data e hora atual</li>
        </ol>
      </div>
    </div>
  );
};

export default TestNotification;