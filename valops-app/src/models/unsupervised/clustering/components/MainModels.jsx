// src/models/clustering/components/MainModels.jsx
import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Code, Check, X, HelpCircle, Copy } from 'lucide-react';

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

const MainModels = () => {
  // Estado para controlar quais modelos estão expandidos
  const [expandedModels, setExpandedModels] = useState({});

  // Função para alternar a expansão de um modelo
  const toggleModel = (modelId) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  // Dados dos principais modelos de clustering
  const models = [
    {
      id: 'kmeans',
      name: 'K-Means',
      description: 'Algoritmo de particionamento que divide os dados em k clusters, onde cada ponto pertence ao cluster com o centroide mais próximo.',
      strengths: [
        'Simples e fácil de implementar',
        'Eficiente para grandes conjuntos de dados',
        'Clusters compactos e bem definidos',
        'Escalável e paralelizável',
        'Funciona bem com dados numéricos'
      ],
      weaknesses: [
        'Necessita definir o número k de clusters a priori',
        'Sensível à inicialização dos centroides',
        'Assume clusters esféricos e de tamanhos similares',
        'Sensível a outliers',
        'Não funciona bem com clusters de formas complexas'
      ],
      useCases: [
        'Segmentação de clientes',
        'Compressão de imagens',
        'Redução de cores',
        'Agrupamento de documentos',
        'Detecção de anomalias simples'
      ],
      hyperparameters: [
        { name: 'n_clusters (k)', description: 'Número de clusters a serem formados' },
        { name: 'init', description: 'Método de inicialização dos centroides (random, k-means++, etc.)' },
        { name: 'n_init', description: 'Número de vezes que o algoritmo será executado com diferentes inicializações' },
        { name: 'max_iter', description: 'Número máximo de iterações por execução' },
        { name: 'tol', description: 'Tolerância para declarar convergência' }
      ],
      code: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Normalizar os dados (importante para K-Means)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Determinar o número ideal de clusters usando o método do cotovelo
inertia = []
k_range = range(1, 11)
for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertia.append(kmeans.inertia_)

# Visualizar o gráfico do cotovelo
plt.figure(figsize=(8, 4))
plt.plot(k_range, inertia, 'bo-')
plt.xlabel('Número de Clusters (k)')
plt.ylabel('Inércia')
plt.title('Método do Cotovelo para Determinação do K Ideal')
plt.grid(True)
plt.show()

# Aplicar K-Means com o número escolhido de clusters
k_optimal = 4  # Substitua pelo valor determinado pelo método do cotovelo
kmeans = KMeans(n_clusters=k_optimal, init='k-means++', n_init=10, max_iter=300, random_state=42)
clusters = kmeans.fit_predict(X_scaled)

# Visualizar os resultados (para dados 2D)
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis', s=50, alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], 
            c='red', marker='X', s=200, label='Centroides')
plt.title('Clusters K-Means')
plt.legend()
plt.grid(True)
plt.show()`
    },
    {
      id: 'hierarchical',
      name: 'Clustering Hierárquico',
      description: 'Constrói uma hierarquia de clusters, criando uma estrutura em árvore que mostra as relações entre os objetos.',
      strengths: [
        'Não precisa de um número predefinido de clusters',
        'Cria uma árvore hierárquica (dendrograma) que é informativa',
        'Flexível: permite diferentes níveis de granularidade',
        'Não faz suposições sobre a forma dos clusters',
        'Permite visualização intuitiva do processo de agrupamento'
      ],
      weaknesses: [
        'Computacionalmente intensivo para grandes conjuntos de dados (O(n²) a O(n³))',
        'Requer armazenamento da matriz de distâncias completa',
        'Decisões de fusão são permanentes (não podem ser desfeitas)',
        'Sensível a ruído e outliers',
        'A escolha do método de linkage afeta significativamente os resultados'
      ],
      useCases: [
        'Taxonomias biológicas',
        'Análise de comunidades em redes sociais',
        'Classificação de documentos hierárquica',
        'Classificação de espécies',
        'Segmentação de mercado'
      ],
      hyperparameters: [
        { name: 'n_clusters', description: 'Número de clusters para cortar o dendrograma' },
        { name: 'affinity', description: 'Métrica de distância (euclidiana, manhattan, coseno, etc.)' },
        { name: 'linkage', description: 'Método para calcular distâncias entre clusters (ward, complete, average, single)' },
        { name: 'distance_threshold', description: 'Threshold para cortar o dendrograma' }
      ],
      code: `from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage
import matplotlib.pyplot as plt
import numpy as np

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Criar o linkage matrix para o dendrograma
linkage_matrix = linkage(X_scaled, method='ward')

# Plotar o dendrograma
plt.figure(figsize=(12, 6))
dendrogram(linkage_matrix)
plt.title('Dendrograma Hierárquico')
plt.xlabel('Amostras')
plt.ylabel('Distância')
plt.axhline(y=6, color='r', linestyle='--')  # Linha para corte do dendrograma
plt.show()

# Aplicar clustering hierárquico aglomerativo
n_clusters = 4  # Número de clusters escolhido com base no dendrograma
hierarchical = AgglomerativeClustering(n_clusters=n_clusters, affinity='euclidean', linkage='ward')
clusters = hierarchical.fit_predict(X_scaled)

# Visualizar os resultados (para dados 2D)
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis', s=50, alpha=0.7)
plt.title('Clusters Hierárquicos')
plt.grid(True)
plt.show()`
    },
    {
      id: 'dbscan',
      name: 'DBSCAN',
      description: 'Density-Based Spatial Clustering of Applications with Noise, um algoritmo baseado em densidade que agrupa pontos densamente agrupados e marca pontos em regiões de baixa densidade como outliers.',
      strengths: [
        'Não requer número predefinido de clusters',
        'Capaz de identificar clusters de formas arbitrárias',
        'Robusto a outliers (marcados como ruído)',
        'Pode encontrar clusters de diferentes tamanhos e densidades',
        'Baseado em conceitos intuitivos de densidade'
      ],
      weaknesses: [
        'Sensível aos parâmetros eps e min_samples',
        'Dificuldade com clusters de densidades muito variadas',
        'Problemas com dados de alta dimensionalidade',
        'Performance reduzida em datasets muito grandes',
        'Dificuldade na escolha automática de parâmetros'
      ],
      useCases: [
        'Detecção de anomalias',
        'Segmentação de imagens',
        'Agrupamento espacial',
        'Análise de redes sociais',
        'Identificação de áreas de interesse em dados geoespaciais'
      ],
      hyperparameters: [
        { name: 'eps', description: 'Raio máximo da vizinhança de um ponto' },
        { name: 'min_samples', description: 'Número mínimo de pontos em uma vizinhança para formar um núcleo' },
        { name: 'metric', description: 'Métrica de distância a ser usada' },
        { name: 'algorithm', description: 'Algoritmo para computar os vizinhos mais próximos' }
      ],
      code: `from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors
import numpy as np
import matplotlib.pyplot as plt

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Encontrar eps ideal usando o gráfico de distâncias k-vizinhos
k = 5  # Considerar k vizinhos
nbrs = NearestNeighbors(n_neighbors=k).fit(X_scaled)
distances, indices = nbrs.kneighbors(X_scaled)
distances = np.sort(distances[:, k-1])

# Plotar o gráfico de distâncias para determinar eps
plt.figure(figsize=(8, 4))
plt.plot(distances)
plt.axhline(y=0.5, color='r', linestyle='--')  # Linha para possível valor de eps
plt.title('Gráfico de Distâncias k-Vizinhos')
plt.xlabel('Pontos ordenados por distância')
plt.ylabel('Distância do k-ésimo vizinho')
plt.grid(True)
plt.show()

# Aplicar DBSCAN com os parâmetros selecionados
eps = 0.5  # Escolha baseada no gráfico de distâncias
min_samples = 5  # Quanto maior, mais restritivo para formar clusters densos
dbscan = DBSCAN(eps=eps, min_samples=min_samples)
clusters = dbscan.fit_predict(X_scaled)

# Visualizar os resultados
plt.figure(figsize=(10, 6))
# Pontos de ruído são rotulados como -1
noise = clusters == -1
plt.scatter(X[noise, 0], X[noise, 1], color='black', marker='x', s=30, label='Ruído')
# Plotar os clusters
for cluster_id in set(clusters[clusters != -1]):
    mask = clusters == cluster_id
    plt.scatter(X[mask, 0], X[mask, 1], s=50, alpha=0.7, label=f'Cluster {cluster_id}')
plt.title('Clusters DBSCAN')
plt.legend()
plt.grid(True)
plt.show()`
    },
    {
      id: 'gmm',
      name: 'Gaussian Mixture Models (GMM)',
      description: 'Modelo probabilístico que assume que os dados são gerados a partir de uma mistura de um número finito de distribuições Gaussianas com parâmetros desconhecidos.',
      strengths: [
        'Abordagem probabilística (fornece probabilidades de pertencimento)',
        'Flexível para capturar clusters elipsoidais',
        'Pode modelar complexidade variável nos clusters',
        'Permite clustering soft (um ponto pode pertencer parcialmente a múltiplos clusters)',
        'Base teórica sólida no campo estatístico'
      ],
      weaknesses: [
        'Sensível à inicialização',
        'Pode convergir para máximos locais',
        'Necessita do número de componentes a priori',
        'Assume que os clusters seguem distribuição Gaussiana',
        'Computacionalmente mais intensivo que K-Means'
      ],
      useCases: [
        'Segmentação de imagens',
        'Análise de dados financeiros',
        'Reconhecimento de padrões de fala',
        'Modelagem de distribuições complexas',
        'Aplicações com incerteza na atribuição de clusters'
      ],
      hyperparameters: [
        { name: 'n_components', description: 'Número de componentes Gaussianas (clusters)' },
        { name: 'covariance_type', description: 'Tipo de covariância das Gaussianas (full, tied, diag, spherical)' },
        { name: 'max_iter', description: 'Número máximo de iterações EM' },
        { name: 'init_params', description: 'Método de inicialização dos parâmetros' },
        { name: 'reg_covar', description: 'Regularização adicionada à covariância' }
      ],
      code: `from sklearn.mixture import GaussianMixture
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Selecionar número ideal de componentes usando BIC
n_components_range = range(1, 10)
bic = []
aic = []
for n_components in n_components_range:
    gmm = GaussianMixture(n_components=n_components, covariance_type='full', random_state=42)
    gmm.fit(X_scaled)
    bic.append(gmm.bic(X_scaled))
    aic.append(gmm.aic(X_scaled))

# Plotar BIC e AIC para determinar o número ideal de componentes
plt.figure(figsize=(10, 5))
plt.plot(n_components_range, bic, 'o-', label='BIC')
plt.plot(n_components_range, aic, 's-', label='AIC')
plt.xlabel('Número de Componentes')
plt.ylabel('Pontuação')
plt.title('Critérios BIC e AIC para Seleção de Componentes')
plt.legend()
plt.grid(True)
plt.show()

# Aplicar GMM com o número ideal de componentes
n_components = 4  # Baseado na análise BIC/AIC
gmm = GaussianMixture(n_components=n_components, covariance_type='full', random_state=42)
gmm.fit(X_scaled)
clusters = gmm.predict(X_scaled)
probs = gmm.predict_proba(X_scaled)

# Visualizar os resultados (para dados 2D)
plt.figure(figsize=(10, 6))

# Visualizar clusters
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis', s=50, alpha=0.7)

# Visualizar elipses que representam cada componente Gaussiana
from matplotlib.patches import Ellipse
for i in range(n_components):
    # Transformar os parâmetros de volta ao espaço original
    mean = scaler.inverse_transform(gmm.means_[i].reshape(1, -1)).ravel()
    covar = gmm.covariances_[i]
    v, w = np.linalg.eigh(covar)
    angle = 180. * np.arctan2(w[0][1], w[0][0]) / np.pi
    v = 2. * np.sqrt(2.) * np.sqrt(v)
    ellipse = Ellipse(xy=mean, width=v[0], height=v[1], angle=angle, 
                      edgecolor='red', facecolor='none', linewidth=2)
    plt.gca().add_patch(ellipse)

plt.title('Clustering com Gaussian Mixture Model')
plt.grid(True)
plt.show()`
    },
    {
      id: 'hdbscan',
      name: 'HDBSCAN',
      description: 'Hierarchical Density-Based Spatial Clustering of Applications with Noise, uma extensão do DBSCAN que varia a densidade para encontrar clusters de diferentes densidades.',
      strengths: [
        'Robusto na identificação de clusters de diferentes densidades',
        'Não requer número predefinido de clusters',
        'Mais estável na escolha de parâmetros que o DBSCAN',
        'Identifica outliers eficientemente',
        'Pode encontrar clusters de formas arbitrárias'
      ],
      weaknesses: [
        'Computacionalmente mais intensivo que DBSCAN',
        'Menos intuitivo em termos de parametrização',
        'Implementação mais complexa',
        'Pode ser sensível ao parâmetro min_cluster_size',
        'Pode ter dificuldades com dados de dimensionalidade muito alta'
      ],
      useCases: [
        'Agrupamento de séries temporais',
        'Detecção de anomalias complexas',
        'Análise de dados geoespaciais',
        'Segmentação de usuários com comportamentos variados',
        'Análise de redes sociais complexas'
      ],
      hyperparameters: [
        { name: 'min_cluster_size', description: 'Tamanho mínimo de um cluster' },
        { name: 'min_samples', description: 'Número de pontos numa vizinhança para considerar um ponto como core' },
        { name: 'cluster_selection_epsilon', description: 'Distância máxima para considerar pontos no mesmo cluster' },
        { name: 'metric', description: 'Métrica de distância a ser usada' },
        { name: 'alpha', description: 'Fator de escala para distâncias, afeta a formação de clusters' }
      ],
      code: `import hdbscan
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar HDBSCAN
clusterer = hdbscan.HDBSCAN(min_cluster_size=5, min_samples=3, gen_min_span_tree=True)
clusters = clusterer.fit_predict(X_scaled)

# Visualizar os resultados
plt.figure(figsize=(10, 6))
# Pontos de ruído são rotulados como -1
noise = clusters == -1
plt.scatter(X[noise, 0], X[noise, 1], color='black', marker='x', s=30, label='Ruído')
# Plotar os clusters
for cluster_id in set(clusters[clusters != -1]):
    mask = clusters == cluster_id
    plt.scatter(X[mask, 0], X[mask, 1], s=50, alpha=0.7, label=f'Cluster {cluster_id}')
plt.title('Clusters HDBSCAN')
plt.legend()
plt.grid(True)
plt.show()

# Visualizar a árvore de clusters
plt.figure(figsize=(10, 8))
clusterer.condensed_tree_.plot(select_clusters=True, selection_palette=None)
plt.title('Árvore Condensada HDBSCAN')
plt.show()

# Acessar probabilidades de pertencimento a clusters (se disponível)
if hasattr(clusterer, 'probabilities_'):
    print("Probabilidade média de pertencimento a clusters:", np.mean(clusterer.probabilities_))`
    },
    {
      id: 'spectral',
      name: 'Clustering Espectral',
      description: 'Utiliza os autovalores da matriz de similaridade dos dados para realizar redução de dimensionalidade antes de aplicar clustering no espaço reduzido, geralmente usando K-Means.',
      strengths: [
        'Eficaz para identificar clusters de formas não convexas',
        'Não faz suposições sobre a forma dos clusters',
        'Capaz de encontrar padrões sutis e complexos',
        'Baseado em conceitos matemáticos sólidos da teoria espectral de grafos',
        'Pode ser aplicado em diversos tipos de dados com medidas de similaridade apropriadas'
      ],
      weaknesses: [
        'Computacionalmente intensivo para grandes conjuntos de dados',
        'Sensível à escolha do parâmetro de escala (sigma) e do número de clusters',
        'Requer conhecimento prévio do número de clusters',
        'Construção da matriz de similaridade pode ser custosa',
        'Resultados podem variar com diferentes escolhas de kernel'
      ],
      useCases: [
        'Segmentação de imagens',
        'Reconhecimento de padrões complexos',
        'Análise de dados em redes',
        'Agrupamento de dados com estruturas internas não lineares',
        'Detecção de comunidades em grafos'
      ],
      hyperparameters: [
        { name: 'n_clusters', description: 'Número de clusters a serem formados' },
        { name: 'affinity', description: 'Tipo de kernel para calcular afinidade (rbf, nearest_neighbors, precomputed)' },
        { name: 'n_neighbors', description: 'Número de vizinhos para construir o grafo de afinidade' },
        { name: 'gamma', description: 'Parâmetro de escala para o kernel RBF' },
        { name: 'assign_labels', description: 'Método para atribuir rótulos finais (kmeans, discretize)' }
      ],
      code: `from sklearn.cluster import SpectralClustering
from sklearn.preprocessing import StandardScaler
import numpy as np
import matplotlib.pyplot as plt

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar Clustering Espectral
n_clusters = 4
spectral = SpectralClustering(n_clusters=n_clusters, 
                             affinity='rbf', 
                             gamma=1.0,
                             assign_labels='kmeans',
                             random_state=42)
clusters = spectral.fit_predict(X_scaled)

# Visualizar os resultados (para dados 2D)
plt.figure(figsize=(10, 6))
for cluster_id in range(n_clusters):
    mask = clusters == cluster_id
    plt.scatter(X[mask, 0], X[mask, 1], s=50, alpha=0.7, label=f'Cluster {cluster_id}')
plt.title('Clusters Espectrais')
plt.legend()
plt.grid(True)
plt.show()

# Para explorar diferentes parâmetros de afinidade:
affinities = ['rbf', 'nearest_neighbors']
gammas = [0.1, 1.0, 5.0]

fig, axes = plt.subplots(len(affinities), len(gammas), figsize=(15, 10))
for i, affinity in enumerate(affinities):
    for j, gamma in enumerate(gammas):
        if affinity == 'nearest_neighbors' and j > 0:
            continue  # gamma não é usado com nearest_neighbors
            
        params = {'n_clusters': n_clusters, 'affinity': affinity, 'random_state': 42}
        if affinity == 'rbf':
            params['gamma'] = gamma
        elif affinity == 'nearest_neighbors':
            params['n_neighbors'] = 10  # Número de vizinhos
            
        spectral = SpectralClustering(**params)
        clusters = spectral.fit_predict(X_scaled)
        
        ax = axes[i][j]
        for cluster_id in range(n_clusters):
            mask = clusters == cluster_id
            ax.scatter(X[mask, 0], X[mask, 1], s=30, alpha=0.7)
        ax.set_title(f'Affinity: {affinity}, Gamma: {gamma if affinity=="rbf" else "N/A"}')
        ax.grid(True)
        
plt.tight_layout()
plt.show()`
    },
    {
      id: 'optics',
      name: 'OPTICS',
      description: 'Ordering Points To Identify the Clustering Structure, algoritmo baseado em densidade que cria uma ordenação aumentada de pontos com base em sua densidade, permitindo identificar clusters de diferentes densidades.',
      strengths: [
        'Não requer número predefinido de clusters',
        'Pode identificar clusters de diferentes densidades',
        'Identifica naturalmente outliers',
        'Produz um gráfico de alcançabilidade para análise visual',
        'Mais flexível que DBSCAN para variações de densidade'
      ],
      weaknesses: [
        'Computacionalmente intensivo O(n²)',
        'Interpretação do gráfico de alcançabilidade pode ser subjetiva',
        'Escolha do parâmetro xi para extração de clusters pode ser difícil',
        'Menos intuitivo que outros algoritmos',
        'Implementação mais complexa'
      ],
      useCases: [
        'Análise geoespacial de pontos de interesse',
        'Detecção de grupos em redes sociais',
        'Identificação de padrões em séries temporais',
        'Agrupamento de dados com densidades variáveis',
        'Análise exploratória de dados complexos'
      ],
      hyperparameters: [
        { name: 'min_samples', description: 'Número mínimo de pontos em uma vizinhança para análise' },
        { name: 'max_eps', description: 'Distância máxima de vizinhança a ser considerada' },
        { name: 'metric', description: 'Métrica de distância a ser usada' },
        { name: 'xi', description: 'Determina a inclinação mínima no gráfico de alcançabilidade' },
        { name: 'cluster_method', description: 'Método para extração de clusters (xi, dbscan)' }
      ],
      code: `from sklearn.cluster import OPTICS
import numpy as np
import matplotlib.pyplot as plt

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar OPTICS
min_samples = 5  # Similar ao min_samples do DBSCAN
optics = OPTICS(min_samples=min_samples, xi=0.05, min_cluster_size=0.05)
clusters = optics.fit_predict(X_scaled)

# Visualizar os resultados
plt.figure(figsize=(10, 6))
# Pontos de ruído são rotulados como -1
noise = clusters == -1
plt.scatter(X[noise, 0], X[noise, 1], color='black', marker='x', s=30, label='Ruído')
# Plotar os clusters
for cluster_id in set(clusters[clusters != -1]):
    mask = clusters == cluster_id
    plt.scatter(X[mask, 0], X[mask, 1], s=50, alpha=0.7, label=f'Cluster {cluster_id}')
plt.title('Clusters OPTICS')
plt.legend()
plt.grid(True)
plt.show()

# Visualizar o gráfico de alcançabilidade (reachability plot)
space = np.arange(len(X_scaled))
reachability = optics.reachability_[optics.ordering_]
labels = clusters[optics.ordering_]

plt.figure(figsize=(10, 5))
plt.plot(space, reachability, 'k-', alpha=0.7)
plt.plot(space, np.full_like(space, 2.0, dtype=float), 'k-.', alpha=0.5)
colors = ['g.', 'r.', 'b.', 'y.', 'c.']
for klass, color in zip(range(0, 5), colors):
    Xk = space[labels == klass]
    Rk = reachability[labels == klass]
    plt.plot(Xk, Rk, color, alpha=0.3)
plt.plot(space[labels == -1], reachability[labels == -1], 'k.', alpha=0.3)
plt.ylabel('Distância de Alcançabilidade')
plt.title('Gráfico de Alcançabilidade do OPTICS')
plt.grid(True)
plt.show()`
    },
    {
      id: 'birch',
      name: 'BIRCH',
      description: 'Balanced Iterative Reducing and Clustering using Hierarchies, algoritmo projetado para grandes conjuntos de dados que constrói uma estrutura de árvore CF (Clustering Feature) para resumir os dados.',
      strengths: [
        'Extremamente eficiente para grandes conjuntos de dados',
        'Requer apenas uma passagem pelos dados (algoritmo de streaming)',
        'Usa memória limitada e pode lidar com milhões de pontos',
        'Robusto a outliers',
        'Pode ser usado como pré-processamento para outros algoritmos'
      ],
      weaknesses: [
        'Sensível à ordem dos dados',
        'Funciona melhor com clusters esféricos',
        'Resultados podem ser afetados pelo parâmetro threshold',
        'Menos flexível para dados muito complexos',
        'Pode não encontrar clusters de formas arbitrárias'
      ],
      useCases: [
        'Análise de grandes volumes de dados',
        'Pré-processamento para redução de dados',
        'Clustering incremental (streaming)',
        'Análise de dados em tempo real',
        'Agrupamento rápido para dados simples'
      ],
      hyperparameters: [
        { name: 'threshold', description: 'Raio máximo de um subcluster' },
        { name: 'branching_factor', description: 'Número máximo de subclusters em cada nó' },
        { name: 'n_clusters', description: 'Número de clusters após a última etapa de agrupamento' },
        { name: 'compute_labels', description: 'Se os rótulos de cluster devem ser calculados' },
        { name: 'copy', description: 'Se uma cópia dos dados deve ser feita' }
      ],
      code: `from sklearn.cluster import Birch
import numpy as np
import matplotlib.pyplot as plt

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar BIRCH
n_clusters = 4
threshold = 0.5
branching_factor = 50
birch = Birch(n_clusters=n_clusters, threshold=threshold, branching_factor=branching_factor)
clusters = birch.fit_predict(X_scaled)

# Visualizar os resultados
plt.figure(figsize=(10, 6))
for cluster_id in range(n_clusters):
    mask = clusters == cluster_id
    plt.scatter(X[mask, 0], X[mask, 1], s=50, alpha=0.7, label=f'Cluster {cluster_id}')
plt.title(f'Clusters BIRCH (threshold={threshold}, branching_factor={branching_factor})')
plt.legend()
plt.grid(True)
plt.show()

# Explorar diferentes valores de threshold
thresholds = [0.1, 0.5, 1.0, 1.5]
fig, axes = plt.subplots(1, len(thresholds), figsize=(15, 5))

for i, threshold in enumerate(thresholds):
    birch = Birch(n_clusters=n_clusters, threshold=threshold, branching_factor=50)
    clusters = birch.fit_predict(X_scaled)
    
    for cluster_id in range(n_clusters):
        mask = clusters == cluster_id
        axes[i].scatter(X[mask, 0], X[mask, 1], s=30, alpha=0.7)
    axes[i].set_title(f'Threshold: {threshold}')
    axes[i].grid(True)
    
plt.tight_layout()
plt.show()`
    }
  ];

  // Helper para mostrar/esconder atributos
  const FeatureSection = ({ title, items, color = "blue" }) => (
    <div className={`p-3 mb-3 bg-${color}-50 rounded-lg`}>
      <h5 className="font-medium text-gray-800 mb-2">{title}</h5>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex items-start">
            <Check size={16} className={`text-${color}-500 mr-2 flex-shrink-0 mt-0.5`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Principais Modelos de Clustering</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          Esta seção apresenta os principais algoritmos e modelos utilizados para problemas de 
          clustering, destacando suas características, pontos fortes e fracos, aplicações comuns 
          e principais hiperparâmetros a serem ajustados.
        </p>
      </div>
      
      <div className="space-y-4">
        {models.map(model => (
          <div key={model.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleModel(model.id)}
            >
              <h4 className="font-semibold text-blue-800">{model.name}</h4>
              <div>
                {expandedModels[model.id] ? (
                  <MinusCircle size={20} className="text-gray-600" />
                ) : (
                  <PlusCircle size={20} className="text-gray-600" />
                )}
              </div>
            </div>
            
            {expandedModels[model.id] && (
              <div className="p-4">
                <p className="text-gray-700 mb-4">{model.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FeatureSection 
                    title="Pontos Fortes" 
                    items={model.strengths} 
                    color="green" 
                  />
                  <FeatureSection 
                    title="Pontos Fracos" 
                    items={model.weaknesses} 
                    color="red" 
                  />
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Casos de Uso Comuns</h5>
                  <div className="flex flex-wrap gap-2">
                    {model.useCases.map((useCase, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Principais Hiperparâmetros</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Parâmetro</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.hyperparameters.map((param, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                            <td className="py-2 pr-4 text-sm font-medium text-gray-800">{param.name}</td>
                            <td className="py-2 text-sm text-gray-600">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Code size={18} className="text-blue-600 mr-2" />
                    Exemplo de Implementação
                  </h5>
                  <CodeBlock code={model.code} language="python" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <HelpCircle size={16} className="text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">
          Clique em cada modelo para ver detalhes completos e exemplos de implementação.
        </span>
      </div>
    </div>
  );
};

export default MainModels;