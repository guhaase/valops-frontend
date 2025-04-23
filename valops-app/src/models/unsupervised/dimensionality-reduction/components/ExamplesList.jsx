import React from 'react';
import { BookOpen } from 'lucide-react';
import GenericExamplesList from '../../../../components/common/ExamplesList';

/**
 * ExamplesList específico para técnicas de redução de dimensionalidade
 * Este componente utiliza o componente genérico e adiciona configurações
 * específicas para a exibição de exemplos de redução de dimensionalidade
 */
const DimensionalityReductionExamplesList = () => {
  // Define as tags relacionadas à redução de dimensionalidade para pré-filtrar
  const dimensionalityReductionTags = [
    // Você pode deixar vazio inicialmente ou adicionar tags específicas
    // que serão carregadas pelo componente genérico
  ];

  // Configurações específicas para os exemplos de redução de dimensionalidade
  const title = "Exemplos de Notebooks para Redução de Dimensionalidade";
  const description = `
    Esta seção contém notebooks Jupyter com implementações práticas de técnicas de redução de dimensionalidade.
    Os exemplos incluem visualizações de dados multidimensionais, comparações entre diferentes algoritmos,
    e casos de uso aplicados a problemas reais. Os notebooks podem ser baixados e executados localmente para
    auxiliar na implementação de suas próprias técnicas de redução de dimensionalidade.
  `;
  const emptyMessage = "Nenhum notebook de redução de dimensionalidade encontrado.";

  // Filtragem por categoria (2 = Redução de Dimensionalidade) e subcategoria apropriada
  // Os IDs devem ser ajustados conforme seu banco de dados
  const categoryId = 2;
  const subcategoryId = 1;

  // Callback opcional para quando um novo exemplo for adicionado
  const handleUpload = (newExample) => {
    console.log("Novo exemplo de redução de dimensionalidade adicionado:", newExample);
    // Você pode adicionar lógica adicional aqui se necessário
  };

  return (
    <GenericExamplesList
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      defaultTags={dimensionalityReductionTags}
      onUpload={handleUpload}
    />
  );
};

export default DimensionalityReductionExamplesList;