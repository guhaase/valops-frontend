// src/models/supervised/clustering/components/tests/TestsDetails.jsx
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

  // Dados dos testes para tipos específicos de clustering
  const specificTests = [
    {
      id: 'partitional',
      name: 'Clustering Particionado (K-Means, K-Medoids)',
      description: 'Algoritmos que dividem os dados em clusters não sobrepostos, onde cada ponto pertence a exatamente um cluster.',
      tests: [
        { name: 'Inércia (WCSS)', importance: 'Alta', notes: 'Soma das distâncias quadradas ao centroide; método do cotovelo para escolha de k' },
        { name: 'Silhouette Score', importance: 'Alta', notes: 'Avalia coesão e separação; ideal para validar número de clusters' },
        { name: 'Davies-Bouldin', importance: 'Média', notes: 'Razão entre dispersão intra-cluster e distância entre centroides' },
        { name: 'Calinski-Harabasz', importance: 'Média', notes: 'Razão de variância; funciona bem para clusters convexos' },
        { name: 'Gap Statistic', importance: 'Alta', notes: 'Compara inércia com distribuição de referência; boa para determinar k' },
        { name: 'Estabilidade dos Clusters', importance: 'Média', notes: 'Verificar consistência com diferentes inicializações e subconjuntos de dados' },
        { name: 'Distância aos Centroides', importance: 'Média', notes: 'Distribuição das distâncias para identificar outliers' }
      ]
    },
    {
      id: 'hierarchical',
      name: 'Clustering Hierárquico',
      description: 'Algoritmos que constroem uma hierarquia de clusters, criando uma árvore de agrupamentos (dendrograma).',
      tests: [
        { name: 'Coeficiente de Correlação Cofenética', importance: 'Alta', notes: 'Correlação entre distâncias originais e distâncias produzidas pelo dendrograma' },
        { name: 'Inconsistência', importance: 'Média', notes: 'Identifica clusters naturais medindo inconsistências no dendrograma' },
        { name: 'Distância de Corte', importance: 'Alta', notes: 'Determinação visual ou automática da altura de corte do dendrograma' },
        { name: 'Silhouette para diferentes cortes', importance: 'Alta', notes: 'Avaliar qualidade de diferentes números de clusters' },
        { name: 'Comparação de Métodos de Linkage', importance: 'Média', notes: 'Testar single, complete, average e ward para escolher o mais adequado' },
        { name: 'Estabilidade com Perturbações', importance: 'Média', notes: 'Verificar estabilidade da árvore com pequenas mudanças nos dados' }
      ]
    },
    {
      id: 'density',
      name: 'Clustering Baseado em Densidade (DBSCAN, OPTICS)',
      description: 'Algoritmos que definem clusters como regiões densas de pontos separadas por regiões de baixa densidade.',
      tests: [
        { name: 'Análise de Parâmetros (eps, minPts)', importance: 'Muito Alta', notes: 'Fundamental testar diferentes valores e seus impactos' },
        { name: 'Gráfico k-distance', importance: 'Alta', notes: 'Plot das distâncias ordenadas para determinar eps' },
        { name: 'DBCV (Density-Based Clustering Validation)', importance: 'Alta', notes: 'Métrica específica para validação baseada em densidade' },
        { name: 'Proporção de Outliers', importance: 'Alta', notes: 'Verificar se proporção de pontos classificados como ruído é razoável' },
        { name: 'Visualização do Espaço de Alcançabilidade', importance: 'Média', notes: 'Para OPTICS, analisar o gráfico de alcançabilidade' },
        { name: 'Estabilidade com Permutação', importance: 'Média', notes: 'DBSCAN é sensível à ordem dos pontos; testar com permutações' },
        { name: 'Halo vs. Core Points', importance: 'Média', notes: 'Avaliar distribuição de pontos centrais vs. de borda' }
      ]
    },
    {
      id: 'model-based',
      name: 'Clustering Baseado em Modelos (GMM)',
      description: 'Algoritmos que assumem que os dados são gerados a partir de uma mistura de distribuições com parâmetros desconhecidos.',
      tests: [
        { name: 'BIC (Bayesian Information Criterion)', importance: 'Muito Alta', notes: 'Principal critério para selecionar número de componentes' },
        { name: 'AIC (Akaike Information Criterion)', importance: 'Alta', notes: 'Alternativa ao BIC, mais adequado para aproximar o modelo real' },
        { name: 'Log-Likelihood', importance: 'Alta', notes: 'Verossimilhança dos dados dado o modelo; maior é melhor' },
        { name: 'Convergência EM', importance: 'Média', notes: 'Verificar se o algoritmo convergiu adequadamente' },
        { name: 'Matriz de Covariância', importance: 'Alta', notes: 'Testar diferentes tipos (full, tied, diagonal, spherical)' },
        { name: 'Bootstrap para Estabilidade', importance: 'Média', notes: 'Estimar a variabilidade das estimativas com reamostragem' },
        { name: 'Análise de Probabilidades', importance: 'Alta', notes: 'Examinar distribuição das probabilidades de pertencimento' }
      ]
    }
  ];

  // Código para calcular métricas
  const codeSnippets = {
    calculation: `import numpy as np
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, cophenet
from scipy.spatial.distance import pdist

# Dados normalizados
X_scaled = scaler.fit_transform(X)

# 1. Métricas para K-Means
def evaluate_kmeans(X, k_range=range(2, 11)):
    results = {
        'inertia': [],
        'silhouette': [],
        'davies_bouldin': [],
        'calinski_harabasz': []
    }
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(X)
        
        # Inertia (WCSS - Within-Cluster Sum of Squares)
        results['inertia'].append(kmeans.inertia_)
        
        # Só podemos calcular estas métricas para k >= 2
        if k >= 2:
            # Silhouette Score
            sil_score = silhouette_score(X, clusters)
            results['silhouette'].append(sil_score)
            
            # Davies-Bouldin Index
            db_score = davies_bouldin_score(X, clusters)
            results['davies_bouldin'].append(db_score)
            
            # Calinski-Harabasz Index
            ch_score = calinski_harabasz_score(X, clusters)
            results['calinski_harabasz'].append(ch_score)
        else:
            results['silhouette'].append(np.nan)
            results['davies_bouldin'].append(np.nan)
            results['calinski_harabasz'].append(np.nan)
    
    return results

# Avaliar K-Means para diferentes valores de k
k_range = range(2, 11)
kmeans_results = evaluate_kmeans(X_scaled, k_range)

# 2. Coeficiente Cofenético para Clustering Hierárquico
def evaluate_hierarchical(X, methods=['ward', 'complete', 'average', 'single']):
    results = {}
    
    for method in methods:
        # Calcular o linkage
        Z = linkage(X, method=method)
        
        # Calcular a matriz de distâncias original
        original_dists = pdist(X)
        
        # Calcular distâncias cofenéticas (do dendrograma)
        coph_dists, coph_matrix = cophenet(Z, original_dists)
        
        # Correlação cofenética
        coph_corr = np.corrcoef(original_dists, coph_dists)[0, 1]
        
        results[method] = {
            'cophenet_correlation': coph_corr,
            'linkage_matrix': Z
        }
    
    return results

# Avaliar clustering hierárquico com diferentes métodos de linkage
hierarchical_results = evaluate_hierarchical(X_scaled)

# 3. Análise de parâmetros para DBSCAN
def evaluate_dbscan(X, eps_range=np.arange(0.1, 2.1, 0.1), min_samples_range=[2, 5, 10, 15, 20]):
    results = {}
    
    for min_samples in min_samples_range:
        results[f'min_samples_{min_samples}'] = {
            'eps_values': [],
            'n_clusters': [],
            'noise_ratio': [],
            'silhouette': []
        }
        
        for eps in eps_range:
            dbscan = DBSCAN(eps=eps, min_samples=min_samples)
            clusters = dbscan.fit_predict(X)
            
            # Número de clusters (excluindo ruído)
            n_clusters = len(set(clusters)) - (1 if -1 in clusters else 0)
            
            # Proporção de outliers
            noise_ratio = np.sum(clusters == -1) / len(clusters)
            
            # Armazenar resultados
            results[f'min_samples_{min_samples}']['eps_values'].append(eps)
            results[f'min_samples_{min_samples}']['n_clusters'].append(n_clusters)
            results[f'min_samples_{min_samples}']['noise_ratio'].append(noise_ratio)
            
            # Silhouette score (só pode ser calculado se houver pelo menos 2 clusters e não todos os pontos forem ruído)
            if n_clusters >= 2 and noise_ratio < 1.0:
                # Remover pontos de ruído para calcular o silhouette
                X_filtered = X[clusters != -1]
                clusters_filtered = clusters[clusters != -1]
                sil_score = silhouette_score(X_filtered, clusters_filtered)
                results[f'min_samples_{min_samples}']['silhouette'].append(sil_score)
            else:
                results[f'min_samples_{min_samples}']['silhouette'].append(np.nan)
    
    return results

# Avaliar DBSCAN para diferentes valores de eps e min_samples
dbscan_results = evaluate_dbscan(X_scaled)`,
    
    visualization: `import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import silhouette_samples
from scipy.cluster.hierarchy import dendrogram

# 1. Visualização do Método do Cotovelo para K-Means
def plot_elbow_method(k_range, inertia):
    plt.figure(figsize=(10, 6))
    plt.plot(k_range, inertia, 'bo-')
    plt.xlabel('Número de Clusters (k)')
    plt.ylabel('Inércia (WCSS)')
    plt.title('Método do Cotovelo para Determinar k Ideal')
    plt.grid(True, alpha=0.3)
    plt.show()

# Plotar método do cotovelo
plot_elbow_method(k_range, kmeans_results['inertia'])

# 2. Comparação de Métricas para K-Means
def plot_metrics_comparison(k_range, results):
    fig, axes = plt.subplots(3, 1, figsize=(12, 15))
    
    # Silhouette (maior é melhor)
    axes[0].plot(k_range, results['silhouette'], 'go-')
    axes[0].set_xlabel('Número de Clusters (k)')
    axes[0].set_ylabel('Silhouette Score')
    axes[0].set_title('Silhouette Score (maior é melhor)')
    axes[0].grid(True, alpha=0.3)
    
    # Davies-Bouldin (menor é melhor)
    axes[1].plot(k_range, results['davies_bouldin'], 'ro-')
    axes[1].set_xlabel('Número de Clusters (k)')
    axes[1].set_ylabel('Davies-Bouldin Index')
    axes[1].set_title('Davies-Bouldin Index (menor é melhor)')
    axes[1].grid(True, alpha=0.3)
    
    # Calinski-Harabasz (maior é melhor)
    axes[2].plot(k_range, results['calinski_harabasz'], 'bo-')
    axes[2].set_xlabel('Número de Clusters (k)')
    axes[2].set_ylabel('Calinski-Harabasz Index')
    axes[2].set_title('Calinski-Harabasz Index (maior é melhor)')
    axes[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()

# Plotar comparação de métricas
plot_metrics_comparison(k_range, kmeans_results)

# 3. Silhouette Plot para análise detalhada
def plot_silhouette_analysis(X, range_n_clusters=range(2, 6)):
    for n_clusters in range_n_clusters:
        # Criar um subplot com 1 linha e 2 colunas
        fig, (ax1, ax2) = plt.subplots(1, 2)
        fig.set_size_inches(18, 7)
        
        # O primeiro subplot mostra o silhouette plot
        ax1.set_xlim([-0.1, 1])
        ax1.set_ylim([0, len(X) + (n_clusters + 1) * 10])
        
        # Inicializar o clusterer com n_clusters valor
        clusterer = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        cluster_labels = clusterer.fit_predict(X)
        
        # Silhouette score médio para todos os clusters
        silhouette_avg = silhouette_score(X, cluster_labels)
        print(f"Para n_clusters = {n_clusters}, o silhouette score médio é: {silhouette_avg:.3f}")
        
        # Calcular o silhouette score para cada amostra
        sample_silhouette_values = silhouette_samples(X, cluster_labels)
        
        y_lower = 10
        for i in range(n_clusters):
            # Agregar os scores de silhouette para as amostras pertencentes a esse cluster
            ith_cluster_silhouette_values = sample_silhouette_values[cluster_labels == i]
            ith_cluster_silhouette_values.sort()
            
            size_cluster_i = ith_cluster_silhouette_values.shape[0]
            y_upper = y_lower + size_cluster_i
            
            color = plt.cm.nipy_spectral(float(i) / n_clusters)
            ax1.fill_betweenx(np.arange(y_lower, y_upper),
                             0, ith_cluster_silhouette_values,
                             facecolor=color, edgecolor=color, alpha=0.7)
            
            # Rotular os clusters
            ax1.text(-0.05, y_lower + 0.5 * size_cluster_i, str(i))
            
            # Calcular o próximo y_lower para o próximo cluster
            y_lower = y_upper + 10
        
        ax1.set_title("Silhouette plot para os vários clusters")
        ax1.set_xlabel("Valores de Silhouette")
        ax1.set_ylabel("Cluster")
        
        # Linha vertical para o silhouette score médio de todos os valores
        ax1.axvline(x=silhouette_avg, color="red", linestyle="--")
        ax1.set_yticks([])  # Clear the yaxis labels / ticks
        
        # Segundo subplot mostra os clusters
        colors = plt.cm.nipy_spectral(cluster_labels.astype(float) / n_clusters)
        ax2.scatter(X[:, 0], X[:, 1], marker='.', s=30, lw=0, alpha=0.7,
                   c=colors, edgecolor='k')
        
        # Centroides
        centers = clusterer.cluster_centers_
        ax2.scatter(centers[:, 0], centers[:, 1], marker='o',
                   c="white", alpha=1, s=200, edgecolor='k')
        
        for i, c in enumerate(centers):
            ax2.scatter(c[0], c[1], marker='$%d % i, alpha=1,
                       s=50, edgecolor='k')
        
        ax2.set_title("Visualização dos clusters")
        ax2.set_xlabel("Feature space for the 1st feature")
        ax2.set_ylabel("Feature space for the 2nd feature")
        
        plt.suptitle(("Análise de Silhouette para KMeans com n_clusters = %d" % n_clusters),
                    fontsize=14, fontweight='bold')
        
        plt.show()

# Fazer análise de silhouette detalhada
# (Apenas execute para conjunto de dados 2D)
if X.shape[1] == 2:
    plot_silhouette_analysis(X_scaled, range(2, 6))

# 4. Visualização de Dendrograma para Clustering Hierárquico
def plot_dendrogram(Z, labels=None, title='Dendrograma Hierárquico'):
    plt.figure(figsize=(12, 8))
    plt.title(title)
    plt.xlabel('Amostras')
    plt.ylabel('Distância')
    dendrogram(
        Z,
        leaf_rotation=90.,  # rotaciona os rótulos das folhas
        leaf_font_size=8.,  # tamanho da fonte dos rótulos
        labels=labels
    )
    plt.axhline(y=1.5, color='r', linestyle='--')  # linha de corte exemplo
    plt.show()

# Plotar dendrograma para o método ward
if 'ward' in hierarchical_results:
    plot_dendrogram(hierarchical_results['ward']['linkage_matrix'], title='Dendrograma Hierárquico (Ward)')

# 5. Visualização do gráfico k-distance para DBSCAN
def plot_kdistance(X, k=4):
    nbrs = NearestNeighbors(n_neighbors=k).fit(X)
    distances, indices = nbrs.kneighbors(X)
    distances = np.sort(distances[:, k-1], axis=0)
    
    plt.figure(figsize=(10, 6))
    plt.plot(distances)
    plt.xlabel('Pontos ordenados por distância')
    plt.ylabel(f'Distância do {k}º vizinho mais próximo')
    plt.title(f'Gráfico {k}-distance para escolha do parâmetro eps')
    plt.grid(True, alpha=0.3)
    plt.show()

# Plotar gráfico k-distance para DBSCAN
from sklearn.neighbors import NearestNeighbors
plot_kdistance(X_scaled, k=5)

# 6. Análise de parâmetros para DBSCAN
def plot_dbscan_params_analysis(results, min_samples=5):
    key = f'min_samples_{min_samples}'
    if key not in results:
        print(f"Resultados para min_samples={min_samples} não encontrados.")
        return
    
    fig, axes = plt.subplots(3, 1, figsize=(12, 15))
    
    # Número de clusters
    axes[0].plot(results[key]['eps_values'], results[key]['n_clusters'], 'bo-')
    axes[0].set_xlabel('Epsilon (eps)')
    axes[0].set_ylabel('Número de Clusters')
    axes[0].set_title(f'Número de Clusters vs Epsilon (min_samples={min_samples})')
    axes[0].grid(True, alpha=0.3)
    
    # Proporção de ruído
    axes[1].plot(results[key]['eps_values'], results[key]['noise_ratio'], 'ro-')
    axes[1].set_xlabel('Epsilon (eps)')
    axes[1].set_ylabel('Proporção de Ruído')
    axes[1].set_title(f'Proporção de Ruído vs Epsilon (min_samples={min_samples})')
    axes[1].grid(True, alpha=0.3)
    
    # Silhouette score
    valid_indices = ~np.isnan(results[key]['silhouette'])
    if np.any(valid_indices):
        eps_valid = np.array(results[key]['eps_values'])[valid_indices]
        silhouette_valid = np.array(results[key]['silhouette'])[valid_indices]
        axes[2].plot(eps_valid, silhouette_valid, 'go-')
        axes[2].set_xlabel('Epsilon (eps)')
        axes[2].set_ylabel('Silhouette Score')
        axes[2].set_title(f'Silhouette Score vs Epsilon (min_samples={min_samples})')
        axes[2].grid(True, alpha=0.3)
    else:
        axes[2].text(0.5, 0.5, 'Sem dados válidos para Silhouette Score', 
                     horizontalalignment='center', verticalalignment='center',
                     transform=axes[2].transAxes)
    
    plt.tight_layout()
    plt.show()

# Plotar análise de parâmetros para DBSCAN
plot_dbscan_params_analysis(dbscan_results, min_samples=5)`
  };

  // Checklist de avaliação para modelos de clustering
  const checklistItems = [
    'Verifique a necessidade de normalização/padronização dos dados antes do clustering',
    'Avalie diferentes algoritmos e parâmetros para o mesmo conjunto de dados',
    'Utilize validação visual para complementar métricas quantitativas',
    'Para K-Means e algoritmos similares, teste com diferentes inicializações para evitar mínimos locais',
    'Interprete os resultados no contexto do problema, não apenas por métricas numéricas',
    'Avalie a estabilidade dos clusters com subconjuntos ou perturbações dos dados',
    'Para grandes volumes de dados, considere clustering em amostras antes de aplicar ao conjunto completo',
    'Quando aplicável, valide os resultados com conhecimento de domínio ou dados rotulados'
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
      {/* Testes específicos por tipo de clustering */}
      <ExpandableSection
        title="Testes Específicos por Tipo de Clustering"
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
      
      {/* Checklist de Avaliação para Modelos de Clustering */}
      <ExpandableSection
        title="Checklist de Avaliação para Modelos de Clustering"
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
                A validação de modelos de clustering é inerentemente mais subjetiva que a validação 
                de modelos supervisionados, pois não há uma "resposta certa" predefinida. O clustering 
                bem-sucedido deve revelar estruturas significativas nos dados que sejam úteis para o 
                problema em questão, independentemente das métricas numéricas.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;