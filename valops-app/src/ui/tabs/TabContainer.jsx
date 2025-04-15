// src/ui/tabs/TabContainer.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for managing tab state
const TabsContext = createContext({
  value: "",
  onValueChange: () => {}
});

export const Tabs = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue || "");
  
  useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);
  
  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setSelectedTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  return (
    <TabsContext.Provider value={{ value: selectedTab, onValueChange: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = "" }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (selectedValue !== value) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};