import React from 'react';
import ArticleList from '../../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de classificação
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Classificação"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre modelos de classificação, métricas de avaliação e técnicas específicas para 
      diferentes tipos de problemas de classificação."
      categoryFilter={1} // ID da categoria para modelos supervisionados
      subcategoryFilter={1} // ID da subcategoria para classificação
    />
  );
};

export default ArticlesList;