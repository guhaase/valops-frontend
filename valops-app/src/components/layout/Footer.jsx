// src/components/layout/Footer.jsx
import React from 'react';

/**
 * Componente de rodapé da aplicação
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} ValOps. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300">Termos</a>
            <a href="#" className="hover:text-blue-300">Privacidade</a>
            <a href="#" className="hover:text-blue-300">Ajuda</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;