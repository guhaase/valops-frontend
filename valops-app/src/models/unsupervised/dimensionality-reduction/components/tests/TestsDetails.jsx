// src/models/supervised/dimensionality-reduction/components/tests/TestsDetails.jsx
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

  // Dados dos testes para tipos específicos de redução de dimensionalidade
  const specificTests = [
    {
      id: 'linear',
      name: 'Métodos Lineares',
      description: 'Técnicas que preservam relações lineares entre os dados, como PCA, LDA e Factor Analysis.',
      tests: [
        { name: 'Variância Explicada', importance: 'Muito Alta', notes: 'Métrica fundamental para PCA' },
        { name: 'Erro de Reconstrução', importance: 'Alta', notes: 'Avalia a qualidade da representação compacta' },
        { name: 'Scree Plot', importance: 'Alta', notes: 'Para determinar número ideal de componentes' },
        { name: 'Biplot', importance: 'Média', notes: 'Para interpretar relações entre variáveis e componentes' },
        { name: 'Teste de Bartlett', importance: 'Média', notes: 'Verifica se dados são adequados para redução' },
        { name: 'Performance em Tarefas Downstream', importance: 'Alta', notes: 'Avalia utilidade prática da representação' }
      ]
    },
    {
      id: 'nonlinear',
      name: 'Métodos Não-Lineares',
      description: 'Técnicas que capturam relações complexas e não-lineares nos dados, como t-SNE, UMAP, Isomap, Kernel PCA.',
      tests: [
        { name: 'Preservação de Vizinhança', importance: 'Muito Alta', notes: 'Central para t-SNE e UMAP' },
        { name: 'Preservação de Distâncias', importance: 'Alta', notes: 'Especialmente para Isomap' },
        { name: 'Confiabilidade e Continuidade', importance: 'Alta', notes: 'Detecta falsos vizinhos e rupturas' },
        { name: 'Stress (MDS)', importance: 'Média', notes: 'Para métodos baseados em MDS' },
        { name: 'Análise Visual', importance: 'Alta', notes: 'Avaliação qualitativa crítica para visualização' },
        { name: 'Preservação de Clusters', importance: 'Alta', notes: 'Se clusters são importantes na aplicação' }
      ]
    },
    {
      id: 'visualization',
      name: 'Visualização de Dados',
      description: 'Técnicas focadas especificamente na visualização de dados multidimensionais em 2D ou 3D para interpretação humana.',
      tests: [
        { name: 'Separação Visual de Clusters', importance: 'Muito Alta', notes: 'Capacidade de distinguir grupos' },
        { name: 'Análise Qualitativa', importance: 'Alta', notes: 'Avaliação por especialistas do domínio' },
        { name: 'Confiabilidade', importance: 'Alta', notes: 'Ausência de falsos vizinhos próximos' },
        { name: 'Crowding Problem', importance: 'Média', notes: 'Evitar aglomeração excessiva de pontos' },
        { name: 'Tempo de Computação', importance: 'Média', notes: 'Importante para conjuntos grandes ou interativos' },
        { name: 'Preservação de Outliers', importance: 'Média', notes: 'Manter pontos anômalos visíveis' }
      ]
    },
    {
      id: 'autoencoder',
      name: 'Autoencoders',
      description: 'Redes neurais que aprendem a codificar os dados em uma representação de menor dimensão e depois reconstruí-los, úteis para aprendizado de representações complexas.',
      tests: [
        { name: 'Erro de Reconstrução', importance: 'Muito Alta', notes: 'Métrica primária para treinamento e avaliação' },
        { name: 'Visualização do Espaço Latente', importance: 'Alta', notes: 'Para interpretar a representação aprendida' },
        { name: 'Avaliação de Tarefas Downstream', importance: 'Alta', notes: 'Transfer learning para outras tarefas' },
        { name: 'Interpolação no Espaço Latente', importance: 'Média', notes: 'Verifica continuidade e suavidade' },
        { name: 'Compressão atingida', importance: 'Média', notes: 'Taxa de compressão vs. qualidade' },
        { name: 'Análise de Robustez a Ruído', importance: 'Média', notes: 'Especialmente para denoising autoencoders' }
      ]
    },
    {
      id: 'feature-selection',
      name: 'Seleção de Características',
      description: 'Técnicas que selecionam um subconjunto das características originais, eliminando aquelas redundantes ou irrelevantes.',
      tests: [
        { name: 'Performance em Tarefas Downstream', importance: 'Muito Alta', notes: 'Avalia se manteve informação relevante' },
        { name: 'Estabilidade da Seleção', importance: 'Alta', notes: 'Consistência entre diferentes amostras/execuções' },
        { name: 'Interpretabilidade das Features', importance: 'Alta', notes: 'Vantagem principal sobre outros métodos' },
        { name: 'Correlação entre Features Selecionadas', importance: 'Média', notes: 'Verifica redundância residual' },
        { name: 'Curva de Aprendizado', importance: 'Média', notes: 'Desempenho vs. número de features' },
        { name: 'Tempo de Treinamento/Inferência', importance: 'Média', notes: 'Melhorias de eficiência computacional' }
      ]
    }
  ];

  // Código para calcular métricas
  const codeSnippets = {
    calculation: `from sklearn.decomposition import PCA
from sklearn.manifold import TSNE, MDS, Isomap
from sklearn.metrics import pairwise_distances
import numpy as np
from sklearn.neighbors import NearestNeighbors
import umap

# Função para calcular a preservação de vizinhança
def neighborhood_preservation(X_high, X_low, k=10):
    """
    Calcula a taxa de preservação de vizinhança.
    
    Parameters:
    -----------
    X_high : array, shape (n_samples, n_features_high)
        Dados de alta dimensão
    X_low : array, shape (n_samples, n_features_low)
        Dados de baixa dimensão após redução
    k : int
        Número de vizinhos a considerar
        
    Returns:
    --------
    float
        Taxa de preservação de vizinhança entre 0 e 1
    """
    # Calcular os k vizinhos mais próximos nos dados originais
    knn_high = NearestNeighbors(n_neighbors=k+1)
    knn_high.fit(X_high)
    high_neighbors = knn_high.kneighbors(return_distance=False)
    
    # Calcular os k vizinhos mais próximos nos dados reduzidos
    knn_low = NearestNeighbors(n_neighbors=k+1)
    knn_low.fit(X_low)
    low_neighbors = knn_low.kneighbors(return_distance=False)
    
    # Remover o próprio ponto (primeiro vizinho)
    high_neighbors = high_neighbors[:, 1:]
    low_neighbors = low_neighbors[:, 1:]
    
    # Calcular a interseção de vizinhos
    preservation = 0
    for i in range(len(X_high)):
        # Calcular a interseção dos conjuntos de vizinhos
        common = np.intersect1d(high_neighbors[i], low_neighbors[i])
        # Adicionar a proporção de vizinhos preservados
        preservation += len(common) / k
    
    # Retornar média
    return preservation / len(X_high)

# Função para calcular o erro de reconstrução do PCA
def reconstruction_error(X, pca):
    """
    Calcula o erro médio de reconstrução para PCA.
    
    Parameters:
    -----------
    X : array, shape (n_samples, n_features)
        Dados originais
    pca : PCA object
        Modelo PCA já ajustado
    
    Returns:
    --------
    float
        Erro médio de reconstrução
    """
    X_transformed = pca.transform(X)
    X_reconstructed = pca.inverse_transform(X_transformed)
    mse = np.mean(np.sum((X - X_reconstructed) ** 2, axis=1))
    return mse

# Exemplo: Aplicar diferentes métodos e calcular métricas
# X é o conjunto de dados original de alta dimensão

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
explained_variance = pca.explained_variance_ratio_.sum()
rec_error = reconstruction_error(X, pca)
np_pca = neighborhood_preservation(X, X_pca)

print(f"PCA - Variância explicada: {explained_variance:.3f}")
print(f"PCA - Erro de reconstrução: {rec_error:.3f}")
print(f"PCA - Preservação de vizinhança: {np_pca:.3f}")

# t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X)
np_tsne = neighborhood_preservation(X, X_tsne)
print(f"t-SNE - Preservação de vizinhança: {np_tsne:.3f}")

# UMAP
reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42)
X_umap = reducer.fit_transform(X)
np_umap = neighborhood_preservation(X, X_umap)
print(f"UMAP - Preservação de vizinhança: {np_umap:.3f}")

# Isomap
isomap = Isomap(n_components=2, n_neighbors=15)
X_isomap = isomap.fit_transform(X)
np_isomap = neighborhood_preservation(X, X_isomap)
print(f"Isomap - Preservação de vizinhança: {np_isomap:.3f}")`,
    
    visualization: `import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler

# Carregar dados de exemplo (dígitos MNIST)
digits = load_digits()
X = digits.data
y = digits.target

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar diferentes métodos de redução de dimensionalidade
# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

# UMAP
reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42)
X_umap = reducer.fit_transform(X_scaled)

# Criar visualizações
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# PCA
scatter1 = axes[0].scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='tab10', alpha=0.8, s=40)
axes[0].set_title('PCA', fontsize=14)
axes[0].set_xlabel('Componente 1')
axes[0].set_ylabel('Componente 2')
axes[0].grid(True, alpha=0.3)

# t-SNE
scatter2 = axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.8, s=40)
axes[1].set_title('t-SNE', fontsize=14)
axes[1].set_xlabel('Dimensão 1')
axes[1].set_ylabel('Dimensão 2')
axes[1].grid(True, alpha=0.3)

# UMAP
scatter3 = axes[2].scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='tab10', alpha=0.8, s=40)
axes[2].set_title('UMAP', fontsize=14)
axes[2].set_xlabel('Dimensão 1')
axes[2].set_ylabel('Dimensão 2')
axes[2].grid(True, alpha=0.3)

# Adicionar legenda
legend = fig.legend(*scatter1.legend_elements(), title="Dígitos", loc="upper center", 
                    bbox_to_anchor=(0.5, 0.05), ncol=10)

plt.tight_layout()
plt.show()

# Visualização da variância explicada do PCA
pca_full = PCA().fit(X_scaled)
plt.figure(figsize=(10, 6))
plt.bar(range(1, 11), pca_full.explained_variance_ratio_[:10], alpha=0.8)
plt.step(range(1, 11), np.cumsum(pca_full.explained_variance_ratio_[:10]), where='mid', color='red')
plt.xlabel('Componente Principal')
plt.ylabel('Variância Explicada')
plt.title('Variância Explicada por Componente')
plt.grid(True, alpha=0.3)
plt.show()

# Comparação de preservação de vizinhança para diferentes métodos
# [Código para cálculo de preservação de vizinhança conforme snippet anterior]
# Resultados plotados como gráfico de barras
methods = ['PCA', 't-SNE', 'UMAP']
preservation_values = [np_pca, np_tsne, np_umap]  # usar valores calculados anteriormente

plt.figure(figsize=(10, 6))
bars = plt.bar(methods, preservation_values, color=['blue', 'green', 'purple'])
plt.ylim(0, 1)
plt.ylabel('Preservação de Vizinhança (k=10)')
plt.title('Comparação de Preservação de Vizinhança')
plt.grid(True, alpha=0.3, axis='y')

# Adicionar rótulos de valor nas barras
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
             f'{height:.3f}', ha='center', va='bottom')

plt.show()`
  };

  // Checklist de avaliação para redução de dimensionalidade
  const checklistItems = [
    'Defina claramente o objetivo da redução de dimensionalidade (visualização, compressão, pré-processamento)',
    'Utilize métodos adequados ao tipo de dados e relações entre variáveis (lineares ou não-lineares)',
    'Compare múltiplas técnicas e métricas para o mesmo conjunto de dados',
    'Avalie o impacto da redução em tarefas downstream (classificação, clustering)',
    'Para visualização, obtenha feedback de especialistas do domínio',
    'Teste diferentes configurações de hiperparâmetros (perplexidade em t-SNE, número de vizinhos em UMAP)',
    'Considere o custo computacional, especialmente para conjuntos grandes',
    'Avalie a estabilidade dos resultados com diferentes inicializações (para métodos não-determinísticos)',
    'Documente as transformações para reprodutibilidade'
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
      {/* Testes específicos por tipo de técnica de redução de dimensionalidade */}
      <ExpandableSection
        title="Testes Específicos por Tipo de Técnica"
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
            Cálculo de Métricas para Avaliação de Redução de Dimensionalidade
          </h5>
          <CodeBlock code={codeSnippets.calculation} language="python" />

          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Visualização Comparativa de Técnicas
          </h5>
          <CodeBlock code={codeSnippets.visualization} language="python" />
        </div>
      </ExpandableSection>
      
      {/* Checklist de Avaliação para Redução de Dimensionalidade */}
      <ExpandableSection
        title="Checklist de Avaliação para Técnicas de Redução de Dimensionalidade"
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
                A escolha da técnica de redução de dimensionalidade e suas métricas de avaliação deve ser 
                guiada pelo objetivo específico da redução. Diferentes técnicas são otimizadas para diferentes 
                propósitos (visualização, compressão, preservação de estrutura) e tipos de dados.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;