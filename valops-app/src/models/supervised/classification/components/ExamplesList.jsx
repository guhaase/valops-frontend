import React from 'react';
import { BookOpen } from 'lucide-react';
import GenericExamplesList from '../../../../components/common/ExamplesList';

/**
 * ExamplesList específico para modelos de classificação
 * Este componente utiliza o componente genérico e adiciona configurações
 * específicas para a exibição de exemplos de modelos de classificação
 */
const ClassificationExamplesList = () => {
  // Define as tags relacionadas à classificação para pré-filtrar
  const classificationTags = [
    // Você pode deixar vazio inicialmente ou adicionar tags específicas
    // que serão carregadas pelo componente genérico
  ];

  // Configurações específicas para os exemplos de classificação
  const title = "Exemplos de Notebooks para Validação";
  const description = `
    Esta seção contém notebooks Jupyter com exemplos práticos para validação de modelos de classificação.
    Estes exemplos incluem casos de uso reais, métricas específicas para diferentes tipos de classificadores,
    e boas práticas para testes e validação. Os notebooks podem ser baixados e executados localmente para
    auxiliar no processo de validação de seus próprios modelos.
  `;
  const emptyMessage = "Nenhum notebook de classificação encontrado.";

  // Filtragem por categoria (1 = Supervisionados) e subcategoria (1 = Classificação)
  // Os IDs devem ser ajustados conforme seu banco de dados
  const categoryId = 1;
  const subcategoryId = 1;

  // Callback opcional para quando um novo exemplo for adicionado
  const handleUpload = (newExample) => {
    console.log("Novo exemplo de classificação adicionado:", newExample);
    // Você pode adicionar lógica adicional aqui se necessário
  };

  return (
    <GenericExamplesList
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      defaultTags={classificationTags}
      onUpload={handleUpload}
    />
  );
};

export default ClassificationExamplesList;