import React from 'react';
import ArticleList from '../../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de redução de dimensionalidade
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Redução de Dimensionalidade"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre técnicas de redução de dimensionalidade, visualização de dados multidimensionais e 
      aplicações em diferentes áreas do aprendizado de máquina."
      categoryFilter={2} // ID da categoria para redução de dimensionalidade
      subcategoryFilter={1} // ID da subcategoria adequada
    />
  );
};

export default ArticlesList;