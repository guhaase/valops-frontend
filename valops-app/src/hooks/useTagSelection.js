import { useState, useRef, useEffect } from 'react';

/**
 * Hook personalizado para gerenciamento de seleção de tags
 * @param {number} initialMaxTags - Número máximo de tags permitido (opcional)
 * @returns {Object} Funções e estados para gerenciar tags
 */
export const useTagSelection = (initialMaxTags = Infinity) => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [maxTags] = useState(initialMaxTags);
  const tagSearchRef = useRef(null);

  // Adiciona listener para detectar cliques fora do componente de sugestões
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagSearchRef.current && !tagSearchRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Filtra as tags com base na pesquisa do usuário
   * @returns {Array} Array de tags filtradas
   */
  const getFilteredTags = () => {
    if (!searchTag.trim()) return [];
    
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
      !selectedTags.some(selectedTag => selectedTag.id === tag.id)
    ).slice(0, 10); // Limita a 10 resultados para melhor performance
  };

  /**
   * Adiciona uma tag à seleção
   * @param {Object} tag - A tag a ser adicionada
   */
  const addTag = (tag) => {
    if (selectedTags.length >= maxTags) {
      alert(`Máximo de ${maxTags} tags permitidas`);
      return;
    }
    
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    
    setSearchTag('');
    setShowTagSuggestions(false);
  };

  /**
   * Remove uma tag da seleção
   * @param {number} tagId - ID da tag a ser removida
   */
  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  /**
   * Limpa todas as tags selecionadas
   */
  const clearTags = () => {
    setSelectedTags([]);
  };

  /**
   * Define a lista completa de tags disponíveis
   * @param {Array} tags - Array com todas as tags
   */
  const setTags = (tags) => {
    setAllTags(tags);
  };

  return {
    allTags,
    selectedTags,
    searchTag,
    setSearchTag,
    showTagSuggestions,
    setShowTagSuggestions,
    addTag,
    removeTag,
    clearTags,
    getFilteredTags,
    tagSearchRef,
    setTags
  };
};