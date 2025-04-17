// src/components/Tabs.jsx
import React from 'react';

// Função para verificar se é um valor renderizável seguro
const isSafeToRender = (value) => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value)
  );
};

// Função para converter valores não renderizáveis em strings seguras
const makeSafeForRender = (value) => {
  if (isSafeToRender(value)) {
    return value;
  }
  
  // Se for um objeto ou array, converte para string
  if (typeof value === 'object') {
    try {
      // Para renderização segura, apenas mencionamos que é um objeto
      return '[Objeto não renderizável]';
    } catch (e) {
      return '[Erro ao converter objeto]';
    }
  }
  
  // Para qualquer outro tipo, converte para string
  return String(value);
};

// Componente de Tab seguro
const SafeContent = ({ children }) => {
  // Se for um filho único e não for seguro, torna-o seguro
  if (React.Children.count(children) === 1 && !isSafeToRender(children)) {
    return <>{makeSafeForRender(children)}</>;
  }
  
  // Se for múltiplos filhos, verificar cada um
  return (
    <>
      {React.Children.map(children, child => {
        if (isSafeToRender(child)) {
          return child;
        }
        return makeSafeForRender(child);
      })}
    </>
  );
};

export const Tabs = ({ children, activeTab, onChange }) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                isActive: child.props.id === activeTab,
                onClick: () => onChange(child.props.id)
              });
            }
            return child;
          })}
        </nav>
      </div>
      <div className="mt-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.id === activeTab) {
            return (
              <SafeContent>
                {child.props.children}
              </SafeContent>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export const Tab = ({ id, label, isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 mr-4 font-medium text-sm border-b-2 focus:outline-none ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
};