import React from 'react';
import { BookOpen } from 'lucide-react';
import GenericExamplesList from '../../../components/common/ExamplesList';

/**
 * ExamplesList específico para modelos de séries temporais
 * Este componente utiliza o componente genérico e adiciona configurações
 * específicas para a exibição de exemplos de modelos de séries temporais
 */
const TimeSeriesExamplesList = () => {
  // Define as tags relacionadas à séries temporais para pré-filtrar
  const timeSeriesTags = [
    // Tags específicas para séries temporais
    // Podem ser carregadas Posteriormente pelo componente genérico
  ];

  // Configurações específicas para os exemplos de séries temporais
  const title = "Exemplos de Notebooks para Validação";
  const description = `
    Esta seção contém notebooks Jupyter com exemplos práticos para validação de modelos de séries temporais.
    Estes exemplos incluem técnicas de previsão, detecção de anomalias, análise de componentes e
    métodos adequados para validação temporal. Os notebooks podem ser baixados e executados localmente para
    auxiliar no processo de validação de seus próprios modelos de séries temporais.
  `;
  const emptyMessage = "Nenhum notebook de séries temporais encontrado.";

  // Filtragem por categoria (1 = Supervisionados) e subcategoria (3 = Séries Temporais)
  // Os IDs devem ser ajustados conforme seu banco de dados
  const categoryId = 1;
  const subcategoryId = 3;

  // Callback opcional para quando um novo exemplo for adicionado
  const handleUpload = (newExample) => {
    console.log("Novo exemplo de séries temporais adicionado:", newExample);
    // Você pode adicionar lógica adicional aqui se necessário
  };

  return (
    <GenericExamplesList
      title={title}
      description={description}
      emptyMessage={emptyMessage}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      defaultTags={timeSeriesTags}
      onUpload={handleUpload}
    />
  );
};

export default TimeSeriesExamplesList;