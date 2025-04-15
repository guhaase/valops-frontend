import { useState } from 'react';

/**
 * Hook personalizado para gerenciamento de upload de arquivos
 * @param {Array} allowedExtensions - Lista de extensões de arquivo permitidas
 * @returns {Object} Funções e estados para gerenciar upload de arquivos
 */
export const useFileUpload = (allowedExtensions = []) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  /**
   * Verifica se a extensão do arquivo é permitida
   * @param {string} filename - Nome do arquivo
   * @returns {boolean} Verdadeiro se a extensão for permitida
   */
  const isExtensionAllowed = (filename) => {
    if (!allowedExtensions || allowedExtensions.length === 0) return true;
    
    const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
  };

  /**
   * Manipula mudança de arquivo
   * @param {Event} e - Evento de mudança de input
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setFileName('');
      setFileError('');
      return;
    }
    
    if (!isExtensionAllowed(selectedFile.name)) {
      setFileError(`Tipo de arquivo não permitido. Extensões aceitas: ${allowedExtensions.join(', ')}`);
      setFile(null);
      setFileName('');
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileError('');
  };

  /**
   * Reseta o estado do arquivo
   */
  const resetFile = () => {
    setFile(null);
    setFileName('');
    setFileError('');
  };

  return {
    file,
    fileName,
    fileError,
    handleFileChange,
    resetFile,
    isExtensionAllowed
  };
};