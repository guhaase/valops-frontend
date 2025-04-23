import React from 'react';
import { BookOpen } from 'lucide-react';
import GenericExamplesList from '../../../components/common/ExamplesList';

/**
 * ExamplesList específico para modelos de visão computacional
 * Este componente utiliza o componente genérico e adiciona configurações
 * específicas para a exibição de exemplos de modelos de visão computacional
 */
const ComputerVisionExamplesList = () => {
  // Define as tags relacionadas à visão computacional para pré-filtrar
  const computerVisionTags = [
    // Você pode deixar vazio inicialmente ou adicionar tags específicas
    // que serão carregadas pelo componente genérico
  ];

  // Configurações específicas para os exemplos de visão computacional
  const title = "Exemplos de Notebooks para Validação";
  const description = `
    Esta seção contém notebooks Jupyter com exemplos práticos para validação de modelos de visão computacional.
    Inclui casos de uso para detecção de objetos, classificação de imagens, segmentação semântica,
    e técnicas de aumento de dados. Os notebooks demonstram métricas específicas de avaliação e
    podem ser baixados e executados localmente para auxiliar no desenvolvimento e validação de seus próprios modelos.
  `;
  const emptyMessage = "Nenhum notebook de visão computacional encontrado.";

  // Filtragem por categoria (2 = Visão Computacional) e subcategoria específica
  // Os IDs devem ser ajustados conforme seu banco de dados
  const categoryId = 2;
  const subcategoryId = 1;

  // Callback opcional para quando um novo exemplo for adicionado
  const handleUpload = (newExample) => {
    console.log("Novo exemplo de visão computacional adicionado:", newExample);
    // Você pode adicionar lógica adicional aqui se necessário
  };

  return (
    <GenericExamplesList
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      defaultTags={computerVisionTags}
      onUpload={handleUpload}
    />
  );
};

export default ComputerVisionExamplesList;