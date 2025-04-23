// src/hooks/useFileUpload.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import articleService from '../services/articleService';
import notebookService from '../services/notebookService';

/**
 * Hook customizado para gerenciar uploads de arquivos
 * Fornece funcionalidades para upload de artigos e notebooks
 */
const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Função para fazer upload de um arquivo de artigo
   * @param {File} file - Arquivo a ser enviado
   * @param {Object} metadata - Metadados do arquivo
   * @returns {Promise} Resultado da operação
   */
  const uploadArticle = async (file, metadata = {}) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await articleService.uploadArticle(file, metadata, (progressPercent) => {
        setProgress(progressPercent);
      });
      
      setIsUploading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao enviar arquivo');
      setIsUploading(false);
      throw err;
    }
  };

  /**
   * Função para fazer upload de um arquivo de notebook
   * @param {File} file - Arquivo a ser enviado
   * @param {Object} metadata - Metadados do arquivo
   * @returns {Promise} Resultado da operação
   */
  const uploadNotebook = async (file, metadata = {}) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await notebookService.uploadNotebook(file, metadata, (progressPercent) => {
        setProgress(progressPercent);
      });
      
      setIsUploading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao enviar arquivo');
      setIsUploading(false);
      throw err;
    }
  };

  return {
    isUploading,
    progress,
    error,
    uploadArticle,
    uploadNotebook
  };
};

export default useFileUpload;