// testing/models/classification/ClassificationTestsDetails.js
import React, { useState } from 'react';
import { Info, CheckCircle, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset após 2 segundos
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        title="Copiar código"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};


const TestsDetails = () => {
  // Estado para controlar quais seções estão expandidas
  const [expandedSections, setExpandedSections] = useState({
    specificTests: true,
    codeExamples: false,
    checklist: true
  });

  // Função para alternar a expansão de uma seção
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dados dos testes para tipos específicos de classificação
  const specificTests = [
    {
      id: 'binary',
      name: 'Classificação Binária',
      description: 'Modelos que distinguem entre duas classes (ex: spam/não-spam, fraude/legítimo).',
      tests: [
        { name: 'Acurácia', importance: 'Média', notes: 'Cuidado com dados desbalanceados' },
        { name: 'Precisão & Recall', importance: 'Alta', notes: 'Especialmente importantes para classes desbalanceadas' },
        { name: 'F1-Score', importance: 'Alta', notes: 'Balanço entre precisão e recall' },
        { name: 'AUC-ROC', importance: 'Alta', notes: 'Avaliação independente de threshold' },
        { name: 'Matriz de Confusão', importance: 'Alta', notes: 'Visão completa dos erros' },
        { name: 'Curva Precision-Recall', importance: 'Alta', notes: 'Melhor que ROC para dados desbalanceados' },
        { name: 'Log Loss', importance: 'Média', notes: 'Para modelos que fornecem probabilidades' },
        { name: 'Especificidade', importance: 'Variável', notes: 'Importante quando negativos verdadeiros são cruciais' }
      ]
    },
    {
      id: 'multiclass',
      name: 'Classificação Multiclasse',
      description: 'Modelos que classificam em três ou mais categorias mutuamente exclusivas.',
      tests: [
        { name: 'Acurácia', importance: 'Média', notes: 'Útil para classes balanceadas' },
        { name: 'Precisão & Recall por Classe', importance: 'Alta', notes: 'Analisar desempenho em cada classe' },
        { name: 'Macro/Micro/Weighted F1', importance: 'Alta', notes: 'Diferentes formas de média entre classes' },
        { name: 'Matriz de Confusão', importance: 'Muito Alta', notes: 'Identifica confusões entre classes específicas' },
        { name: 'Log Loss', importance: 'Alta', notes: 'Avalia qualidade das probabilidades' },
        { name: 'AUC-ROC One vs All', importance: 'Média', notes: 'Abordagem uma classe contra todas as outras' },
        { name: 'Kappa de Cohen', importance: 'Média', notes: 'Concordância ajustada para o acaso' }
      ]
    },
    {
      id: 'multilabel',
      name: 'Classificação Multirrótulo',
      description: 'Modelos onde cada exemplo pode pertencer a múltiplas classes simultaneamente.',
      tests: [
        { name: 'Hamming Loss', importance: 'Alta', notes: 'Fração de rótulos incorretamente previstos' },
        { name: 'Jaccard Score', importance: 'Alta', notes: 'Similaridade entre conjuntos de rótulos' },
        { name: 'Subset Accuracy', importance: 'Média', notes: 'Previsão exata de todos os rótulos' },
        { name: 'Precisão & Recall por Rótulo', importance: 'Alta', notes: 'Análise individual de cada rótulo' },
        { name: 'Micro/Macro Average F1', importance: 'Alta', notes: 'Diferentes agregações entre rótulos' },
        { name: 'Ranking Loss', importance: 'Média', notes: 'Avalia ordenação de rótulos por confiança' },
        { name: 'Coverage Error', importance: 'Média', notes: 'Quantos rótulos preciso considerar para incluir todos verdadeiros' }
      ]
    },
    {
      id: 'anomaly',
      name: 'Detecção de Anomalias',
      description: 'Modelos que identificam padrões incomuns ou outliers (frequentemente tratado como classificação).',
      tests: [
        { name: 'Precisão & Recall', importance: 'Muito Alta', notes: 'Críticos, pois anomalias são raras' },
        { name: 'F1-Score', importance: 'Alta', notes: 'Equilibra detecção vs falsos alarmes' },
        { name: 'AUC-PR', importance: 'Muito Alta', notes: 'Melhor que ROC para dados extremamente desbalanceados' },
        { name: 'Matriz de Confusão', importance: 'Alta', notes: 'Análise do padrão de erros' },
        { name: 'Tempo Médio até Detecção', importance: 'Variável', notes: 'Para detecção em tempo real' },
        { name: 'Taxa de Falsos Alarmes', importance: 'Alta', notes: 'Crítico para sistemas práticos' },
        { name: 'Pontuação de Anomalia', importance: 'Média', notes: 'Distribuição dos scores para threshold otimizado' }
      ]
    }
  ];

  // Código para calcular métricas
  const codeSnippets = {
    calculation: `from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix, roc_auc_score, log_loss
from sklearn.metrics import classification_report

# Suponha que y_true são os rótulos verdadeiros e y_pred são as previsões do modelo
# y_proba são as probabilidades previstas pelo modelo (para classe positiva, em classificação binária)

# Métricas básicas
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred, average='binary')  # ou 'micro', 'macro', 'weighted' para multiclasse
recall = recall_score(y_true, y_pred, average='binary')
f1 = f1_score(y_true, y_pred, average='binary')

# Matriz de confusão
conf_matrix = confusion_matrix(y_true, y_pred)
tn, fp, fn, tp = conf_matrix.ravel()  # para classificação binária

# AUC-ROC
auc_roc = roc_auc_score(y_true, y_proba)

# Log Loss
logloss = log_loss(y_true, y_proba)

# Relatório completo (inclui precision, recall, f1 para cada classe)
report = classification_report(y_true, y_pred)
print(report)

# Para classificação multirrótulo
from sklearn.metrics import hamming_loss, jaccard_score

hamming = hamming_loss(y_true_multilabel, y_pred_multilabel)
jaccard = jaccard_score(y_true_multilabel, y_pred_multilabel, average='samples')`,
    
    visualization: `import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import roc_curve, precision_recall_curve, confusion_matrix

# Visualização da Matriz de Confusão
plt.figure(figsize=(8, 6))
sns.heatmap(confusion_matrix(y_true, y_pred), 
            annot=True, 
            fmt='d', 
            cmap='Blues',
            xticklabels=['Classe Negativa', 'Classe Positiva'],
            yticklabels=['Classe Negativa', 'Classe Positiva'])
plt.xlabel('Predito')
plt.ylabel('Verdadeiro')
plt.title('Matriz de Confusão')
plt.tight_layout()
plt.show()

# Visualização da Curva ROC
fpr, tpr, thresholds = roc_curve(y_true, y_proba)
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'AUC = {roc_auc_score(y_true, y_proba):.3f}')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel('Taxa de Falsos Positivos')
plt.ylabel('Taxa de Verdadeiros Positivos')
plt.title('Curva ROC')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Visualização da Curva Precision-Recall
precision, recall, thresholds = precision_recall_curve(y_true, y_proba)
plt.figure(figsize=(8, 6))
plt.plot(recall, precision)
plt.xlabel('Recall')
plt.ylabel('Precisão')
plt.title('Curva Precision-Recall')
plt.grid(True, alpha=0.3)
plt.show()`
  };

  // Checklist de avaliação para modelos de classificação
  const checklistItems = [
    'Compreenda o contexto do problema e o custo relativo de diferentes tipos de erros',
    'Verifique o balanceamento das classes e adapte as métricas conforme necessário',
    'Utilize a matriz de confusão para identificar padrões específicos de erro',
    'Avalie o modelo usando múltiplas métricas complementares',
    'Para modelos probabilísticos, avalie a calibração das probabilidades',
    'Considere análises separadas para cada classe em problemas multiclasse',
    'Verifique a estabilidade das métricas usando validação cruzada',
    'Compare o desempenho com modelos de baseline para contextualizar os resultados'
  ];

  // Componente para seção expansível
  const ExpandableSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div
        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Testes específicos por tipo de classificação */}
      <ExpandableSection
        title="Testes Específicos por Tipo de Classificação"
        isExpanded={expandedSections.specificTests}
        onToggle={() => toggleSection('specificTests')}
      >
        <div className="space-y-6">
          {specificTests.map(testGroup => (
            <div key={testGroup.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-blue-800 mb-1">{testGroup.name}</h5>
                <p className="text-gray-700">{testGroup.description}</p>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teste/Métrica
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Importância
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testGroup.tests.map((test, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {test.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${test.importance === 'Muito Alta' && 'bg-green-100 text-green-800'}
                            ${test.importance === 'Alta' && 'bg-blue-100 text-blue-800'}
                            ${test.importance === 'Média' && 'bg-yellow-100 text-yellow-800'}
                            ${test.importance === 'Variável' && 'bg-purple-100 text-purple-800'}
                          `}>
                            {test.importance}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {test.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>
      
      {/* Exemplos práticos de código para cálculo de métricas */}
      <ExpandableSection
        title="Exemplos de Implementação"
        isExpanded={expandedSections.codeExamples}
        onToggle={() => toggleSection('codeExamples')}
      >
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Cálculo de Métricas com Scikit-learn
          </h5>
          <CodeBlock code={codeSnippets.calculation} language="python" />

          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Visualização de Resultados
          </h5>
          <CodeBlock code={codeSnippets.visualization} language="python" />
        </div>
      </ExpandableSection>
      
      {/* Checklist de Avaliação para Modelos de Classificação */}
      <ExpandableSection
        title="Checklist de Avaliação para Modelos de Classificação"
        isExpanded={expandedSections.checklist}
        onToggle={() => toggleSection('checklist')}
      >
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="space-y-2">
            {checklistItems.map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium text-yellow-800">Importante</h5>
              <p className="text-sm text-yellow-700 mt-1">
                As métricas devem ser selecionadas de acordo com o contexto específico do problema. 
                Não existe uma métrica "perfeita" que se aplique a todos os casos - sempre considere 
                o impacto dos diferentes tipos de erros no seu problema específico.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;