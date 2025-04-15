// src/components/layout/PageContainer.jsx
import React from 'react';

/**
 * Componente de contêiner para as páginas
 * Fornece espaçamento e largura consistentes para o conteúdo
 */
const PageContainer = ({ children, className = "", fullWidth = false }) => {
  return (
    <div className={`${fullWidth ? 'w-full max-w-none' : 'container'} mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;