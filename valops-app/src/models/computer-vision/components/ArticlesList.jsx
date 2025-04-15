import React from 'react';
import ArticleList from '../../../components/common/ArticleList';

/**
 * ArticlesList - Componente específico para exibir artigos relacionados a modelos de visão computacional
 */
const ArticlesList = () => {
  return (
    <ArticleList 
      title="Artigos Relevantes sobre Visão Computacional"
      description="Esta seção contém uma curadoria de artigos acadêmicos, papers e publicações relevantes 
      sobre modelos de visão computacional, técnicas de processamento de imagem, 
      redes neurais convolucionais e aplicações práticas."
      categoryFilter={2} // ID da categoria para visão computacional
      subcategoryFilter={1} // ID da subcategoria específica, ajuste conforme necessário
    />
  );
};

export default ArticlesList;