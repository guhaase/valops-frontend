// src/models/supervised/regression/components/tests/TestsDetails.jsx
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
    advancedTests: true,
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

  // Dados dos testes avançados para regressão
  const advancedTests = [
    {
      id: 'residuals-analysis',
      name: 'Análise de Resíduos',
      description: 'Estudo dos erros do modelo (diferença entre valores observados e previstos) para validar premissas e identificar problemas.',
      tests: [
        { name: 'Distribuição Normal', importance: 'Alta', notes: 'Resíduos devem seguir uma distribuição normal para inferência válida' },
        { name: 'Homocedasticidade', importance: 'Alta', notes: 'Variância constante dos resíduos ao longo das previsões' },
        { name: 'Independência', importance: 'Alta', notes: 'Resíduos não devem apresentar autocorrelação' },
        { name: 'Linearidade', importance: 'Média', notes: 'Resíduos vs. valores previstos deve mostrar padrão aleatório' },
        { name: 'Média Zero', importance: 'Alta', notes: 'A média dos resíduos deve ser aproximadamente zero' },
        { name: 'QQ-Plot', importance: 'Média', notes: 'Gráfico para verificar normalidade dos resíduos' },
        { name: 'Teste Durbin-Watson', importance: 'Alta', notes: 'Teste estatístico para autocorrelação' }
      ]
    },
    {
      id: 'cross-validation',
      name: 'Técnicas de Validação Cruzada',
      description: 'Métodos para avaliar a capacidade de generalização do modelo utilizando diferentes partições dos dados.',
      tests: [
        { name: 'K-Fold Cross Validation', importance: 'Alta', notes: 'Divide dados em k subconjuntos, treina em k-1 e valida no restante' },
        { name: 'Leave-One-Out', importance: 'Média', notes: 'Caso especial de k-fold onde k = número de amostras' },
        { name: 'Validação Estratificada', importance: 'Média', notes: 'Mantém distribuição de variáveis importantes em cada fold' },
        { name: 'Time Series Split', importance: 'Alta', notes: 'Para dados temporais, mantém ordem cronológica nas divisões' },
        { name: 'Nested Cross Validation', importance: 'Alta', notes: 'Para seleção de hiperparâmetros sem viés de validação' },
        { name: 'Rolling Window', importance: 'Alta', notes: 'Para séries temporais, desliza janela de treinamento' }
      ]
    },
    {
      id: 'feature-importance',
      name: 'Análise de Importância de Features',
      description: 'Técnicas para avaliar a relevância e o impacto de cada variável independente no modelo.',
      tests: [
        { name: 'Coeficientes Padronizados', importance: 'Média', notes: 'Para modelos lineares, compara impacto de diferentes features' },
        { name: 'Feature Importance', importance: 'Alta', notes: 'Para ensemble trees, mede redução média na impureza' },
        { name: 'Permutation Importance', importance: 'Alta', notes: 'Mede aumento no erro quando uma feature é embaralhada' },
        { name: 'SHAP Values', importance: 'Muito Alta', notes: 'Teoria dos jogos para explicar contribuição de cada feature' },
        { name: 'Partial Dependence Plots', importance: 'Alta', notes: 'Visualiza relação entre feature e target, mantendo outras constantes' },
        { name: 'Elimination Techniques', importance: 'Média', notes: 'Recursive Feature Elimination para selecionar features' }
      ]
    },
    {
      id: 'model-comparison',
      name: 'Comparação entre Modelos',
      description: 'Testes estatísticos e benchmarks para comparar o desempenho de diferentes modelos de regressão.',
      tests: [
        { name: 'Teste Estatístico', importance: 'Alta', notes: 'Testes para determinar se a diferença entre modelos é significativa' },
        { name: 'AIC/BIC', importance: 'Alta', notes: 'Critérios de informação que balanceiam fit e complexidade' },
        { name: 'Validação Cruzada', importance: 'Muito Alta', notes: 'Compara modelos com base em generalização em múltiplos folds' },
        { name: 'Nested Cross Validation', importance: 'Alta', notes: 'Para comparação justa quando há ajuste de hiperparâmetros' },
        { name: 'Benchmarking', importance: 'Média', notes: 'Comparação com modelos baseline e estado da arte' },
        { name: 'Teste de Wilcoxon', importance: 'Média', notes: 'Teste não paramétrico para comparar distribuições de erros' }
      ]
    }
  ];

  // Código para análise de regressão
  const codeSnippets = {
    metrics: `import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt

# Supondo que y_true são os valores verdadeiros e y_pred são as previsões do modelo

# Métricas básicas de regressão
mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

# Erro percentual absoluto médio (MAPE)
def mape(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    # Evitar divisão por zero
    mask = y_true != 0
    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

mape_value = mape(y_true, y_pred)

# Exibindo as métricas
print(f'MSE: {mse:.4f}')
print(f'RMSE: {rmse:.4f}')
print(f'MAE: {mae:.4f}')
print(f'R²: {r2:.4f}')
print(f'MAPE: {mape_value:.2f}%')

# Validação cruzada para avaliação robusta
cv_scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_squared_error')
cv_rmse = np.sqrt(-cv_scores)
print(f'RMSE CV (média): {cv_rmse.mean():.4f}')
print(f'RMSE CV (desvio padrão): {cv_rmse.std():.4f}')`,
    
    residualAnalysis: `import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats
from statsmodels.stats.stattools import durbin_watson

# Supondo que y_true são os valores verdadeiros e y_pred são as previsões do modelo

# Calculando resíduos
residuals = y_true - y_pred

# Análise gráfica dos resíduos
plt.figure(figsize=(15, 10))

# 1. Resíduos vs. Valores Previstos
plt.subplot(2, 2, 1)
plt.scatter(y_pred, residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='-')
plt.title('Resíduos vs. Valores Previstos')
plt.xlabel('Valores Previstos')
plt.ylabel('Resíduos')
plt.grid(True, alpha=0.3)

# 2. Histograma dos Resíduos
plt.subplot(2, 2, 2)
plt.hist(residuals, bins=30, edgecolor='black', alpha=0.7)
plt.title('Histograma dos Resíduos')
plt.xlabel('Resíduos')
plt.ylabel('Frequência')
plt.grid(True, alpha=0.3)

# 3. QQ-Plot para verificar Normalidade
plt.subplot(2, 2, 3)
stats.probplot(residuals, dist="norm", plot=plt)
plt.title('Q-Q Plot dos Resíduos')
plt.grid(True, alpha=0.3)

# 4. Resíduos Padronizados vs. Ordem
plt.subplot(2, 2, 4)
standardized_residuals = (residuals - np.mean(residuals)) / np.std(residuals)
plt.scatter(range(len(standardized_residuals)), standardized_residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='-')
plt.axhline(y=2, color='r', linestyle='--')
plt.axhline(y=-2, color='r', linestyle='--')
plt.title('Resíduos Padronizados vs. Ordem')
plt.xlabel('Ordem')
plt.ylabel('Resíduos Padronizados')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Teste estatístico para autocorrelação
dw_statistic = durbin_watson(residuals)
print(f'Estatística Durbin-Watson: {dw_statistic:.4f}')
print('Valores próximos a 2 indicam ausência de autocorrelação.')
print('Valores < 1 ou > 3 são motivo de preocupação.')`,

    featureImportance: `import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.inspection import permutation_importance
import shap

# Supondo que model é seu modelo treinado, X_train e X_test são seus dados

# 1. Para modelos lineares - coeficientes
if hasattr(model, 'coef_'):
    # Coeficientes padronizados
    coef = model.coef_
    # Se os dados foram escalonados, os coeficientes já são comparáveis
    
    # Plotar coeficientes
    plt.figure(figsize=(10, 6))
    features = X_train.columns if hasattr(X_train, 'columns') else [f'Feature {i}' for i in range(X_train.shape[1])]
    plt.barh(features, coef)
    plt.title('Coeficientes do Modelo')
    plt.xlabel('Magnitude')
    plt.ylabel('Feature')
    plt.grid(True, alpha=0.3)
    plt.show()

# 2. Para tree-based models - feature importance
if hasattr(model, 'feature_importances_'):
    importances = model.feature_importances_
    indices = np.argsort(importances)
    
    plt.figure(figsize=(10, 6))
    features = X_train.columns if hasattr(X_train, 'columns') else [f'Feature {i}' for i in range(X_train.shape[1])]
    plt.barh(np.array(features)[indices], importances[indices])
    plt.title('Feature Importances')
    plt.xlabel('Importância Relativa')
    plt.grid(True, alpha=0.3)
    plt.show()

# 3. Permutation Importance - funciona para qualquer modelo
result = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)
perm_importance = result.importances_mean
sorted_idx = perm_importance.argsort()

plt.figure(figsize=(10, 6))
features = X_test.columns if hasattr(X_test, 'columns') else [f'Feature {i}' for i in range(X_test.shape[1])]
plt.barh(np.array(features)[sorted_idx], perm_importance[sorted_idx])
plt.title('Permutation Importance')
plt.xlabel('Importância (aumento em MSE quando a feature é permutada)')
plt.grid(True, alpha=0.3)
plt.show()

# 4. SHAP Values para interpretabilidade avançada
explainer = shap.Explainer(model, X_train)
shap_values = explainer(X_test)

plt.figure(figsize=(10, 8))
shap.summary_plot(shap_values, X_test, plot_type="bar")
plt.title('SHAP Feature Importance')
plt.show()

# Análise detalhada com SHAP
shap.summary_plot(shap_values, X_test)  # Para visualizar o impacto de cada feature`
  };

  // Checklist de avaliação para modelos de regressão
  const checklistItems = [
    'Verifique a distribuição dos resíduos para normalidade e homocedasticidade',
    'Avalie o modelo com múltiplas métricas (RMSE, MAE, R²)',
    'Realize validação cruzada para estimar a capacidade de generalização',
    'Compare com modelos mais simples (baseline) para verificar a melhoria real',
    'Analise a importância das features para entender os drivers principais',
    'Verifique a existência de multicolinearidade entre variáveis independentes',
    'Examine outliers e seu impacto nas previsões do modelo',
    'Considere a interpretabilidade do modelo no contexto do problema',
    'Teste o modelo em diferentes subconjuntos dos dados para robustez',
    'Verifique a estabilidade das previsões com pequenas perturbações nos dados de entrada'
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
      {/* Testes avançados para regressão */}
      <ExpandableSection
        title="Testes Avançados para Modelos de Regressão"
        isExpanded={expandedSections.advancedTests}
        onToggle={() => toggleSection('advancedTests')}
      >
        <div className="space-y-6">
          {advancedTests.map(testGroup => (
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
                        Teste/Método
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
                            ${test.importance === 'Baixa' && 'bg-gray-100 text-gray-800'}
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
      
      {/* Exemplos práticos de código para testes */}
      <ExpandableSection
        title="Exemplos de Implementação"
        isExpanded={expandedSections.codeExamples}
        onToggle={() => toggleSection('codeExamples')}
      >
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Cálculo de Métricas de Regressão
          </h5>
          <CodeBlock code={codeSnippets.metrics} language="python" />
          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Análise de Resíduos
          </h5>
          <CodeBlock code={codeSnippets.residualAnalysis} language="python" />
          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Análise de Importância de Features
          </h5>
          <CodeBlock code={codeSnippets.featureImportance} language="python" />
        </div>
      </ExpandableSection>
      
      {/* Checklist de Avaliação para Modelos de Regressão */}
      <ExpandableSection
        title="Checklist de Avaliação para Modelos de Regressão"
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
                A validação de modelos de regressão deve ir além das métricas básicas. 
                A análise de resíduos e a verificação de premissas estatísticas são fundamentais 
                para garantir que o modelo seja confiável e generalizável para novos dados.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;