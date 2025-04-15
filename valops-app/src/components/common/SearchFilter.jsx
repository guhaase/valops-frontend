// src/components/common/SearchFilter.jsx
import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

/**
 * SearchFilter component for filtering by category, subcategory and tags
 * 
 * @param {Object} props
 * @param {Array} props.categories - List of available categories
 * @param {Array} props.subcategories - List of all subcategories
 * @param {Array} props.tags - List of all available tags
 * @param {Object} props.selectedFilters - Currently selected filters {category, subcategory, tags[]}
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {string} props.className - Additional CSS classes
 */
const SearchFilter = ({
  categories = [],
  subcategories = [],
  tags = [],
  selectedFilters = { category: null, subcategory: null, tags: [] },
  onFilterChange,
  onClearFilters,
  className = ""
}) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Update filtered subcategories when category changes
  useEffect(() => {
    if (selectedFilters.category) {
      const filtered = subcategories.filter(
        sub => sub.parent_category_id === parseInt(selectedFilters.category)
      );
      setFilteredSubcategories(filtered);
      
      // Reset subcategory if current selection is not valid for the new category
      if (selectedFilters.subcategory) {
        const stillValid = filtered.some(
          sub => sub.id === parseInt(selectedFilters.subcategory)
        );
        if (!stillValid) {
          handleFilterChange('subcategory', null);
        }
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedFilters.category, subcategories]);

  // Handle filter change for any filter type
  const handleFilterChange = (type, value) => {
    const newFilters = { ...selectedFilters };
    
    if (type === 'category') {
      newFilters.category = value === '' ? null : value;
      // Reset subcategory when category changes
      if (newFilters.category !== selectedFilters.category) {
        newFilters.subcategory = null;
      }
    } else if (type === 'subcategory') {
      newFilters.subcategory = value === '' ? null : value;
    } else if (type === 'tag') {
      // Add or remove tag
      if (value) {
        const tagId = parseInt(value);
        // Check if tag is already selected
        const existingTagIndex = newFilters.tags.findIndex(t => t.id === tagId);
        
        if (existingTagIndex === -1) {
          // Add tag if not already selected
          const tag = tags.find(t => t.id === tagId);
          if (tag) {
            newFilters.tags = [...newFilters.tags, tag];
          }
        }
      }
    }
    
    onFilterChange(newFilters);
  };

  // Remove a tag from selected tags
  const removeTag = (tagId) => {
    const newFilters = { 
      ...selectedFilters,
      tags: selectedFilters.tags.filter(tag => tag.id !== tagId)
    };
    onFilterChange(newFilters);
  };

  return (
    <div className={`search-filter ${className} bg-gray-50 p-4 rounded-lg`}>
      <div className="flex items-center mb-2">
        <Filter className="w-4 h-4 mr-2" />
        <h2 className="text-lg font-semibold">Filters</h2>
        
        {(selectedFilters.category || selectedFilters.subcategory || selectedFilters.tags.length > 0) && (
          <button 
            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
            onClick={onClearFilters}
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        {/* Subcategory filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedFilters.subcategory || ''}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
            disabled={!selectedFilters.category}
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
            ))}
          </select>
        </div>
        
        {/* Tag filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
          <select
            className="w-full p-2 border rounded"
            value=""
            onChange={(e) => handleFilterChange('tag', e.target.value)}
          >
            <option value="">Select a tag to add</option>
            {tags
              .filter(tag => !selectedFilters.tags.some(t => t.id === tag.id))
              .map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))
            }
          </select>
        </div>
      </div>
      
      {/* Display selected tags */}
      {selectedFilters.tags.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Selected Tags:</label>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.tags.map(tag => (
              <div key={tag.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                <span>{tag.name}</span>
                <button 
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;