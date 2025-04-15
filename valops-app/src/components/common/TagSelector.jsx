// src/components/common/TagSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Tag, X, Search } from 'lucide-react';

/**
 * TagSelector component for selecting and displaying tags
 * 
 * @param {Object} props
 * @param {Array} props.allTags - All available tags to select from
 * @param {Array} props.selectedTags - Currently selected tags
 * @param {Function} props.onTagAdd - Callback when a tag is added
 * @param {Function} props.onTagRemove - Callback when a tag is removed
 * @param {number} props.maxTags - Maximum number of tags allowed (default: 4)
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {boolean} props.disabled - Whether the component is disabled
 * @param {string} props.className - Additional CSS classes
 */
const TagSelector = ({
  allTags = [],
  selectedTags = [],
  onTagAdd,
  onTagRemove,
  maxTags = 4,
  placeholder = "Search for tags...",
  disabled = false,
  className = ""
}) => {
  const [searchTag, setSearchTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagSearchRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Filter tags based on search query
  const getFilteredTags = () => {
    if (!searchTag.trim()) return [];
    
    return allTags
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
        !selectedTags.some(selectedTag => selectedTag.id === tag.id)
      )
      .slice(0, 10); // Limit to 10 results for better UX
  };

  // Handle adding a tag
  const handleAddTag = (tag) => {
    if (selectedTags.length >= maxTags) {
      alert(`Maximum of ${maxTags} tags allowed`);
      return;
    }
    
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagAdd(tag);
    }
    
    setSearchTag('');
    setShowTagSuggestions(false);
  };

  return (
    <div className={`tag-selector ${className}`}>
      {/* Selected tags display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <div key={tag.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
            <Tag size={14} className="mr-1" />
            <span>{tag.name}</span>
            <button 
              type="button" 
              onClick={() => onTagRemove(tag.id)}
              className="ml-1 text-blue-400 hover:text-blue-600"
              disabled={disabled}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Tag search input */}
      <div className="relative" ref={tagSearchRef}>
        <div className="flex items-center border rounded overflow-hidden">
          <div className="pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTag}
            onChange={(e) => {
              setSearchTag(e.target.value);
              setShowTagSuggestions(true);
            }}
            onFocus={() => setShowTagSuggestions(true)}
            className="w-full p-2 pl-1 border-0 focus:outline-none focus:ring-0"
            placeholder={placeholder}
            disabled={disabled || selectedTags.length >= maxTags}
          />
        </div>
        
        {/* Tag suggestions dropdown */}
        {showTagSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {getFilteredTags().length > 0 ? (
              getFilteredTags().map(tag => (
                <div
                  key={tag.id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center"
                  onClick={() => handleAddTag(tag)}
                >
                  <Tag size={14} className="mr-2 text-blue-600" />
                  <span>{tag.name}</span>
                </div>
              ))
            ) : searchTag ? (
              <div className="px-3 py-2 text-gray-500">No matching tags found</div>
            ) : (
              <div className="px-3 py-2 text-gray-500">Type to search tags</div>
            )}
          </div>
        )}
      </div>
      
      <p className="mt-1 text-xs text-gray-500">
        {selectedTags.length}/{maxTags} tags selected
      </p>
    </div>
  );
};

export default TagSelector;