import React from 'react';
import ArticleList from '../../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de regressão
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Regressão"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre modelos de regressão, métricas de avaliação e técnicas específicas para 
      diferentes tipos de problemas de predição numérica."
      categoryFilter={1} // ID da categoria para modelos supervisionados
      subcategoryFilter={2} // ID da subcategoria para regressão
    />
  );
};

export default ArticlesList;