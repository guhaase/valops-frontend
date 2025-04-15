import React from 'react';
import ArticleList from '../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de séries temporais
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Séries Temporais"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre modelos de séries temporais, técnicas de previsão, detecção de anomalias e 
      métodos de avaliação para dados sequenciais temporais."
      categoryFilter={1} // ID da categoria para modelos supervisionados
      subcategoryFilter={3} // ID da subcategoria para séries temporais
    />
  );
};

export default ArticlesList;