// src/components/common/FileUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import useFileUpload from '../../hooks/useFileUpload';

/**
 * FileUpload component for handling file uploads
 * 
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when a file is selected
 * @param {Function} props.onUploadComplete - Callback when upload is complete
 * @param {string} props.type - Type of upload ('article' or 'notebook')
 * @param {string} props.label - Label for the upload area
 * @param {string} props.accept - File types to accept (e.g., ".pdf,.doc,.ipynb")
 * @param {boolean} props.required - Whether file upload is required
 * @param {string} props.helpText - Help text to display below the upload area
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.selectedFile - Currently selected file object
 * @param {Object} props.metadata - Additional metadata for the file
 */
const FileUpload = ({
  onFileSelect,
  onUploadComplete,
  type = 'article',
  label = "Upload File",
  accept = "*",
  required = false,
  helpText = "Arraste e solte um arquivo ou clique para navegar",
  className = "",
  selectedFile = null,
  metadata = {}
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localFile, setLocalFile] = useState(selectedFile);
  const fileInputRef = useRef(null);
  const { isUploading, progress, error, uploadArticle, uploadNotebook } = useFileUpload();

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFile(file);
      onFileSelect && onFileSelect(file);
    }
  };

  // Handle clear file selection
  const handleClearFile = () => {
    setLocalFile(null);
    onFileSelect && onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!localFile) return;
    
    try {
      let result;
      if (type === 'article') {
        result = await uploadArticle(localFile, metadata);
      } else if (type === 'notebook') {
        result = await uploadNotebook(localFile, metadata);
      }
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      console.error('Erro durante o upload:', err);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setLocalFile(file);
      onFileSelect && onFileSelect(file);
      
      // Update the file input for consistency
      if (fileInputRef.current) {
        // Create a DataTransfer object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  // Get file icon based on extension
  const getFileIcon = () => {
    if (!localFile) return <Upload size={24} className="text-gray-400" />;
    
    // Could be extended with more file type icons
    return <File size={24} className="text-blue-500" />;
  };

  return (
    <div className={`file-upload ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${localFile ? 'bg-gray-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !localFile && fileInputRef.current && fileInputRef.current.click()}
      >
        {!localFile ? (
          <>
            <div className="flex flex-col items-center justify-center py-3">
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">{helpText}</p>
              <p className="text-xs text-gray-400 mt-1">
                {accept !== '*' ? `Formatos aceitos: ${accept.split(',').join(', ')}` : 'Todos os tipos de arquivo aceitos'}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={accept}
              required={required}
            />
          </>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getFileIcon()}
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-gray-700 truncate">{localFile.name}</p>
                  <p className="text-xs text-gray-500">{(localFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFile();
                }}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Progress bar durante o upload */}
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}% concluído</p>
              </div>
            )}
            
            {/* Botões de upload */}
            {!isUploading && (
              <div className="mt-3 grid grid-cols-1 gap-2">
                {/* Trocamos para apenas simulação de upload */}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      let result;
                      if (type === 'article') {
                        result = await uploadArticle(localFile, metadata);
                      } else {
                        result = await uploadNotebook(localFile, metadata);
                      }
                      if (onUploadComplete) {
                        onUploadComplete(result);
                      }
                    } catch (err) {
                      console.error('Erro ao realizar upload:', err);
                    }
                  }}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enviar {type === 'article' ? 'artigo' : 'notebook'}
                </button>
              </div>
            )}
            
            {/* Mensagem de erro */}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;