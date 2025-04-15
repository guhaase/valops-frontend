// src/components/common/FileUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

/**
 * FileUpload component for handling file uploads
 * 
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when a file is selected
 * @param {string} props.label - Label for the upload area
 * @param {string} props.accept - File types to accept (e.g., ".pdf,.doc,.ipynb")
 * @param {boolean} props.required - Whether file upload is required
 * @param {string} props.helpText - Help text to display below the upload area
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.selectedFile - Currently selected file object
 */
const FileUpload = ({
  onFileSelect,
  label = "Upload File",
  accept = "*",
  required = false,
  helpText = "Drag and drop a file or click to browse",
  className = "",
  selectedFile = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localFile, setLocalFile] = useState(selectedFile);
  const fileInputRef = useRef(null);

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFile(file);
      onFileSelect(file);
    }
  };

  // Handle clear file selection
  const handleClearFile = () => {
    setLocalFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      onFileSelect(file);
      
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
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {!localFile ? (
          <>
            <div className="flex flex-col items-center justify-center py-3">
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">{helpText}</p>
              <p className="text-xs text-gray-400 mt-1">
                {accept !== '*' ? `Accepted formats: ${accept.split(',').join(', ')}` : 'All file types accepted'}
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
        )}
      </div>
    </div>
  );
};

export default FileUpload;