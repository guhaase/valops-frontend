import React from 'react';
import ArticleList from '../../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de clustering
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Clustering"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre modelos de clustering, métricas de avaliação e técnicas específicas para 
      diferentes tipos de problemas de agrupamento de dados."
      categoryFilter={2} // ID da categoria para modelos não-supervisionados
      subcategoryFilter={1} // ID da subcategoria para clustering
    />
  );
};

export default ArticlesList;