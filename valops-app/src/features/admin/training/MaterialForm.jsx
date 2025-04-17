// src/features/admin/training/MaterialForm.jsx
import React, { useState, useEffect } from 'react';

const MaterialForm = ({ material, categories, tags, onSave, onCancel, loading }) => {
  const initialFormState = {
    title: '',
    type: 'COURSE',
    category_id: '',
    description: '',
    duration: '',
    pages: '',
    author: '',
    level: 'BASIC',
    url: '',
    publish_date: new Date().toISOString().split('T')[0],
    lessons: '',
    is_featured: false,
    is_active: true,
    tags: '',
    thumbnail: null,
    file: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [fileSelected, setFileSelected] = useState(false);
  const [errors, setErrors] = useState({});

  // Preencher o formulário com os dados do material existente
  useEffect(() => {
    if (material) {
      // Formatar as tags de array para string separada por ponto e vírgula
      let formattedTags = '';
      
      if (material.tags) {
        if (Array.isArray(material.tags)) {
          // Processar array de tags
          formattedTags = material.tags
            .map(tag => typeof tag === 'string' ? tag : (tag && typeof tag === 'object' && tag.name ? tag.name : ''))
            .filter(tag => tag) // Filtrar valores vazios
            .join(';');
        } else if (typeof material.tags === 'string') {
          // Já é uma string
          formattedTags = material.tags;
        } else {
          // Se for outro tipo, deixar em branco
          console.warn('Formato de tags não reconhecido:', material.tags);
          formattedTags = '';
        }
      }
        
      setFormData({
        title: material.title || '',
        type: material.type || 'COURSE',
        category_id: material.category_id || '',
        description: material.description || '',
        duration: material.duration || '',
        pages: material.pages || '',
        author: material.author || '',
        level: material.level || 'BASIC',
        url: material.url || '',
        publish_date: material.publish_date 
          ? new Date(material.publish_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        lessons: material.lessons || '',
        is_featured: material.is_featured || false,
        is_active: material.is_active !== undefined ? material.is_active : true,
        tags: formattedTags,
        thumbnail: null,
        file: null
      });
      
      // Configurar a visualização da miniatura se existir
      if (material.thumbnail_url) {
        setThumbnailPreview(material.thumbnail_url);
      }
    }
  }, [material]);

  // Manipulação de campos de texto e números
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Manipulação de arquivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      if (name === 'thumbnail') {
        // Criar URL para visualização da miniatura
        const fileUrl = URL.createObjectURL(files[0]);
        setThumbnailPreview(fileUrl);
      } else if (name === 'file') {
        setFileSelected(true);
      }
    }
  };

  // Validação básica do formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Selecione uma categoria';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'O autor é obrigatório';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'A URL é obrigatória';
    }
    
    // Validar formato de tags (máximo 4)
    if (formData.tags) {
      const tagsArray = formData.tags.split(';').filter(t => t.trim());
      if (tagsArray.length > 4) {
        newErrors.tags = 'Máximo de 4 tags permitidas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipulação do envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Preparar dados para envio
      const dataToSubmit = { ...formData };
      
      // Converter páginas e lições para número
      if (formData.pages !== '') {
        dataToSubmit.pages = Number(formData.pages);
      }
      
      if (formData.lessons !== '') {
        dataToSubmit.lessons = Number(formData.lessons);
      }
      
      onSave(dataToSubmit);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {material ? 'Editar Material' : 'Novo Material'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Título do material"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Tipo e Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="COURSE">Curso</option>
              <option value="VIDEO">Vídeo</option>
              <option value="ARTICLE">Artigo</option>
              <option value="BOOK">Livro</option>
              <option value="PRESENTATION">Apresentação</option>
              <option value="WEBINAR">Webinar</option>
              <option value="DOCUMENT">Documento</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
            )}
          </div>
          
          {/* Descrição */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="4"
              placeholder="Descrição do material"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Autor e Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nome do autor"
              required
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">{errors.author}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nível <span className="text-red-500">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="BASIC">Básico</option>
              <option value="INTERMEDIATE">Intermediário</option>
              <option value="ADVANCED">Avançado</option>
            </select>
          </div>
          
          {/* URL e Data de Publicação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="URL do material ou página externa"
              required
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-500">{errors.url}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Publicação <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Duração e Páginas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 2h 30min, 45min"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Páginas
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de páginas"
              min="0"
            />
          </div>
          
          {/* Lições */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lições/Módulos
            </label>
            <input
              type="number"
              name="lessons"
              value={formData.lessons}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de lições ou módulos"
              min="0"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (máx. 4, separadas por ponto e vírgula)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tags ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="tag1;tag2;tag3;tag4"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
            )}
            {tags.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Tags sugeridas: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.slice(0, 8).map((tag, index) => {
                    // Garantir que tag é uma string
                    const tagName = typeof tag === 'string' ? tag : 
                                  (tag && typeof tag === 'object' && tag.name ? tag.name : `Tag ${index+1}`);
                    
                    return (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          const currentTags = formData.tags ? formData.tags.split(';').filter(t => t.trim()) : [];
                          if (currentTags.length < 4 && !currentTags.includes(tagName)) {
                            const newTags = [...currentTags, tagName];
                            setFormData(prev => ({ ...prev, tags: newTags.join(';') }));
                          }
                        }}
                      >
                        {tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Opções de Destaque e Ativo */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Material em destaque
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Material ativo
              </label>
            </div>
          </div>
          
          {/* Upload de thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miniatura (Imagem)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                accept="image/*"
              />
              
              {thumbnailPreview && (
                <div className="h-12 w-12 relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Miniatura" 
                    className="h-full w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview('');
                      setFormData(prev => ({ ...prev, thumbnail: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Upload de arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arquivo (PDF, DOCX, etc)
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
            {fileSelected && (
              <p className="mt-1 text-xs text-gray-500">
                Arquivo selecionado. O arquivo atual será substituído ao salvar.
              </p>
            )}
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Salvando...' : material ? 'Atualizar Material' : 'Criar Material'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;