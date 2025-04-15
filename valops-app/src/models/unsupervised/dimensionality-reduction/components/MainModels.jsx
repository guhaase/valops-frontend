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

  // Dados dos principais modelos de redução de dimensionalidade
  const models = [
    {
      id: 'pca',
      name: 'PCA (Principal Component Analysis)',
      description: 'Método linear que transforma os dados em um novo sistema de coordenadas, onde a maior variância está na primeira coordenada (primeiro componente principal), a segunda maior variância na segunda coordenada, e assim por diante.',
      strengths: [
        'Eficiente computacionalmente',
        'Boa para compressão de dados',
        'Fácil de implementar e interpretar',
        'Reduz ruído (componentes de baixa variância)',
        'Útil para visualização de dados'
      ],
      weaknesses: [
        'Assume relações lineares entre variáveis',
        'Sensível a outliers',
        'Pode perder informação discriminativa importante para classificação',
        'Não preserva bem estruturas não-lineares',
        'Componentes nem sempre têm interpretabilidade clara'
      ],
      useCases: [
        'Compressão de imagens',
        'Pré-processamento para outros algoritmos',
        'Remoção de multicolinearidade',
        'Visualização de dados multidimensionais',
        'Redução de ruído em sinais'
      ],
      hyperparameters: [
        { name: 'n_components', description: 'Número de componentes principais a manter' },
        { name: 'svd_solver', description: 'Algoritmo para calcular os componentes principais (auto, full, arpack, randomized)' },
        { name: 'whiten', description: 'Se os componentes devem ter variância unitária' },
        { name: 'random_state', description: 'Semente aleatória para reprodutibilidade (quando svd_solver=randomized)' }
      ],
      code: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# É recomendado normalizar os dados antes de aplicar PCA
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Instanciando e aplicando PCA
pca = PCA(n_components=2)  # Reduzir para 2 dimensões
X_pca = pca.fit_transform(X_scaled)

# Analisando a variância explicada
print(f"Variância explicada por componente: {pca.explained_variance_ratio_}")
print(f"Variância explicada acumulada: {pca.explained_variance_ratio_.sum()}")

# Visualizando os resultados
plt.figure(figsize=(10, 8))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', alpha=0.8)
plt.xlabel('Primeiro Componente Principal')
plt.ylabel('Segundo Componente Principal')
plt.colorbar(label='Classes')
plt.title('Visualização PCA dos Dados')
plt.grid(True, alpha=0.3)
plt.show()

# Determinar número de componentes baseado na variância explicada
pca_full = PCA().fit(X_scaled)
cumsum = np.cumsum(pca_full.explained_variance_ratio_)
d = np.argmax(cumsum >= 0.95) + 1  # 95% da variância
print(f"Número de componentes para explicar 95% da variância: {d}")`
    },
    {
      id: 'tsne',
      name: 't-SNE (t-Distributed Stochastic Neighbor Embedding)',
      description: 'Técnica não-linear de redução de dimensionalidade que é particularmente eficaz para visualização de dados de alta dimensão. Concentra-se em preservar a estrutura local dos dados.',
      strengths: [
        'Excelente para visualização em 2D ou 3D',
        'Preserva estruturas locais nos dados',
        'Captura relações não-lineares',
        'Separa bem clusters de dados',
        'Ideal para análise exploratória'
      ],
      weaknesses: [
        'Computacionalmente intensivo para grandes conjuntos de dados',
        'Não preserva bem distâncias globais',
        'Resultados podem variar com diferentes inicializações',
        'Hiperparâmetros sensíveis (especialmente perplexidade)',
        'Não é adequado para redução de dimensão como pré-processamento'
      ],
      useCases: [
        'Visualização de dados de alta dimensão',
        'Análise exploratória de clusters',
        'Visualização de embeddings de palavras',
        'Análise de dados de expressão gênica',
        'Visualização de redes neurais'
      ],
      hyperparameters: [
        { name: 'perplexity', description: 'Equilíbrio entre preservar estruturas locais vs. globais (5-50)' },
        { name: 'n_components', description: 'Número de dimensões do espaço reduzido (geralmente 2 ou 3)' },
        { name: 'learning_rate', description: 'Taxa de aprendizado do processo de otimização' },
        { name: 'n_iter', description: 'Número de iterações para otimização' },
        { name: 'early_exaggeration', description: 'Fator que aumenta a atração entre pontos similares nas primeiras iterações' }
      ],
      code: `from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import time

# t-SNE pode ser lento, então é bom medir o tempo
start_time = time.time()

# Aplicando t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42, n_iter=1000)
X_tsne = tsne.fit_transform(X)

print(f"t-SNE concluído em {time.time() - start_time:.2f} segundos")

# Visualizando os resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização t-SNE dos Dados')
plt.xlabel('Dimensão 1')
plt.ylabel('Dimensão 2')
plt.grid(True, alpha=0.3)
plt.show()

# Dica: Para conjuntos de dados maiores, considere usar PCA primeiro
# pca = PCA(n_components=50).fit_transform(X)
# tsne = TSNE(n_components=2).fit_transform(pca)`
    },
    {
      id: 'umap',
      name: 'UMAP (Uniform Manifold Approximation and Projection)',
      description: 'Algoritmo de redução de dimensionalidade baseado em teoria de manifolds e topologia. Tenta preservar tanto a estrutura local quanto global dos dados.',
      strengths: [
        'Mais rápido que t-SNE para grandes conjuntos de dados',
        'Preserva estrutura global melhor que t-SNE',
        'Captura relações não-lineares',
        'Pode ser usado para visualização e como pré-processamento',
        'Bom equilíbrio entre performance e qualidade'
      ],
      weaknesses: [
        'Menos interpretável matematicamente',
        'Sensível à escolha de hiperparâmetros',
        'Implementação relativamente recente',
        'Resultados podem variar com diferentes inicializações',
        'Requer biblioteca adicional (não está em scikit-learn)'
      ],
      useCases: [
        'Visualização de dados de alta dimensão',
        'Alternativa mais rápida ao t-SNE',
        'Análise de dados genômicos',
        'Visualização de embeddings',
        'Pré-processamento para tarefas de classificação'
      ],
      hyperparameters: [
        { name: 'n_neighbors', description: 'Número de vizinhos para construção do grafo local (equilíbrio entre estrutura local e global)' },
        { name: 'min_dist', description: 'Controla quão próximos os pontos podem estar no espaço reduzido' },
        { name: 'n_components', description: 'Número de dimensões no espaço reduzido' },
        { name: 'metric', description: 'Métrica de distância a ser usada (euclidiana, manhattan, etc.)' }
      ],
      code: `# Instalar UMAP se ainda não estiver instalado
# !pip install umap-learn

import umap
import matplotlib.pyplot as plt
import numpy as np

# Configurando UMAP
reducer = umap.UMAP(n_neighbors=15, 
                    min_dist=0.1, 
                    n_components=2, 
                    metric='euclidean',
                    random_state=42)

# Aplicando UMAP aos dados
X_umap = reducer.fit_transform(X)

# Visualizando os resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização UMAP dos Dados')
plt.xlabel('Dimensão 1')
plt.ylabel('Dimensão 2')
plt.grid(True, alpha=0.3)
plt.show()

# Experimentando com diferentes parametros
param_grid = {
    'n_neighbors': [5, 15, 30, 50],
    'min_dist': [0.0, 0.1, 0.5, 0.8]
}

# Visualize different parameter combinations
fig, axs = plt.subplots(len(param_grid['n_neighbors']), 
                         len(param_grid['min_dist']), 
                         figsize=(16, 12))

for i, n in enumerate(param_grid['n_neighbors']):
    for j, d in enumerate(param_grid['min_dist']):
        reducer = umap.UMAP(n_neighbors=n, min_dist=d, random_state=42)
        embedding = reducer.fit_transform(X)
        axs[i, j].scatter(embedding[:, 0], embedding[:, 1], c=y, cmap='tab10', s=5)
        axs[i, j].set_title(f'n_neigh={n}, min_dist={d}')
        axs[i, j].set_xticks([])
        axs[i, j].set_yticks([])

plt.tight_layout()
plt.show()`
    },
    {
      id: 'lda',
      name: 'LDA (Linear Discriminant Analysis)',
      description: 'Técnica supervisionada que encontra combinações lineares das features que melhor separam as diferentes classes. Pode ser usada tanto para redução de dimensionalidade quanto para classificação.',
      strengths: [
        'Método supervisionado que usa informação de classe',
        'Maximiza a separabilidade entre classes',
        'Bom para pré-processamento antes de classificação',
        'Robusto a pequenas amostras por classe',
        'Pode lidar com multicolinearidade'
      ],
      weaknesses: [
        'Assume distribuição normal das classes',
        'Relações lineares apenas',
        'Limitado a (C-1) dimensões, onde C é o número de classes',
        'Sensível a outliers',
        'Requer classes balanceadas para melhor desempenho'
      ],
      useCases: [
        'Pré-processamento para classificação',
        'Reconhecimento facial',
        'Análise de dados biomédicos',
        'Visualização de dados rotulados',
        'Redução de dimensionalidade supervisionada'
      ],
      hyperparameters: [
        { name: 'n_components', description: 'Número de componentes (máximo = classes-1)' },
        { name: 'solver', description: 'Método para encontrar os discriminantes (svd, eigen, lsqr)' },
        { name: 'shrinkage', description: 'Regularização para estimativa de covariância' },
        { name: 'priors', description: 'Probabilidades a priori das classes' }
      ],
      code: `from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar LDA
lda = LDA(n_components=2)  # no máximo classes-1 componentes
X_lda = lda.fit_transform(X_scaled, y)

# Visualizar resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_lda[:, 0], X_lda[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização LDA dos Dados')
plt.xlabel('Primeiro Discriminante Linear')
plt.ylabel('Segundo Discriminante Linear')
plt.grid(True, alpha=0.3)
plt.show()

# Analisar a separação entre classes
print(f"Razão de variância explicada: {lda.explained_variance_ratio_}")

# Usar LDA como classificador
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# LDA como classificador
lda_clf = LDA()
lda_clf.fit(X_train, y_train)
y_pred = lda_clf.predict(X_test)
print(classification_report(y_test, y_pred))`
    },
    {
      id: 'kpca',
      name: 'Kernel PCA',
      description: 'Extensão não-linear do PCA que usa kernels para mapear implicitamente os dados para um espaço de maior dimensão, onde se pode encontrar relações não-lineares.',
      strengths: [
        'Captura relações não-lineares nos dados',
        'Pode descobrir estruturas complexas',
        'Versátil através de diferentes kernels',
        'Útil para dados não-linearmente separáveis',
        'Pode melhorar a performance de algoritmos lineares subsequentes'
      ],
      weaknesses: [
        'Computacionalmente intensivo para grandes conjuntos',
        'Difícil interpretação dos componentes',
        'Seleção de kernel e parâmetros não é trivial',
        'Não há método direto para projetar novos dados',
        'Pode ser sensível a outliers dependendo do kernel'
      ],
      useCases: [
        'Reconhecimento de padrões não-lineares',
        'Pré-processamento para algoritmos de classificação',
        'Extração de características não-lineares',
        'Detecção de anomalias',
        'Alternativa ao PCA quando há relações não-lineares'
      ],
      hyperparameters: [
        { name: 'kernel', description: 'Função kernel a ser usada (rbf, poly, sigmoid, etc.)' },
        { name: 'gamma', description: 'Coeficiente do kernel (para rbf, poly, sigmoid)' },
        { name: 'degree', description: 'Grau do polinômio (para kernel poly)' },
        { name: 'n_components', description: 'Número de componentes a serem retidos' },
        { name: 'fit_inverse_transform', description: 'Se deve calcular a transformação inversa aproximada' }
      ],
      code: `from sklearn.decomposition import KernelPCA
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar Kernel PCA com kernel RBF (Gaussian)
kpca = KernelPCA(n_components=2, kernel='rbf', gamma=10, random_state=42)
X_kpca = kpca.fit_transform(X_scaled)

# Visualizar resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_kpca[:, 0], X_kpca[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização Kernel PCA (RBF) dos Dados')
plt.xlabel('Primeiro Componente')
plt.ylabel('Segundo Componente')
plt.grid(True, alpha=0.3)
plt.show()

# Comparar diferentes kernels
kernels = ['linear', 'poly', 'rbf', 'sigmoid']
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
axes = axes.ravel()

for i, kernel in enumerate(kernels):
    kpca = KernelPCA(n_components=2, kernel=kernel, gamma=10, random_state=42)
    X_kpca = kpca.fit_transform(X_scaled)
    
    axes[i].scatter(X_kpca[:, 0], X_kpca[:, 1], c=y, cmap='tab10', alpha=0.8)
    axes[i].set_title(f'Kernel PCA com kernel {kernel}')
    axes[i].set_xlabel('Primeiro Componente')
    axes[i].set_ylabel('Segundo Componente')
    axes[i].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`
    },
    {
      id: 'autoencoder',
      name: 'Autoencoder',
      description: 'Redes neurais que aprendem a codificar os dados em uma representação de menor dimensão (encoder) e depois reconstruí-los (decoder). A camada latente intermediária fornece a representação reduzida.',
      strengths: [
        'Captura relações altamente não-lineares',
        'Flexível e adaptável a diferentes tipos de dados',
        'Pode lidar com grandes volumes de dados',
        'Útil para aprendizado de representação profunda',
        'Pode ser especializado para diferentes tarefas (denoising, variacional, etc.)'
      ],
      weaknesses: [
        'Computacionalmente intensivo para treinar',
        'Requer mais dados que métodos tradicionais',
        'Difícil interpretabilidade da representação latente',
        'Muitos hiperparâmetros para ajustar',
        'Risco de overfitting sem regularização adequada'
      ],
      useCases: [
        'Compressão de imagens e sinais',
        'Extração de características para deep learning',
        'Detecção de anomalias',
        'Remoção de ruído',
        'Geração de dados (VAEs e GANs)'
      ],
      hyperparameters: [
        { name: 'Arquitetura', description: 'Número e tamanho das camadas do encoder e decoder' },
        { name: 'Função de ativação', description: 'ReLU, sigmoid, tanh, etc.' },
        { name: 'Regularização', description: 'Dropout, regularização L1/L2, etc.' },
        { name: 'Dimensão latente', description: 'Tamanho da camada intermediária (bottleneck)' },
        { name: 'Função de perda', description: 'MSE, crossentropy, etc.' }
      ],
      code: `import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import numpy as np

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Definir dimensão do espaço latente
latent_dim = 2
input_dim = X_scaled.shape[1]

# Construir o modelo autoencoder
input_layer = Input(shape=(input_dim,))

# Encoder
encoder = Dense(64, activation='relu')(input_layer)
encoder = Dropout(0.2)(encoder)
encoder = Dense(32, activation='relu')(encoder)
encoder = Dropout(0.2)(encoder)
encoder = Dense(latent_dim, activation='relu')(encoder)

# Decoder
decoder = Dense(32, activation='relu')(encoder)
decoder = Dropout(0.2)(decoder)
decoder = Dense(64, activation='relu')(decoder)
decoder = Dropout(0.2)(decoder)
output_layer = Dense(input_dim, activation='linear')(decoder)

# Criar e compilar o modelo
autoencoder = Model(inputs=input_layer, outputs=output_layer)
autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mse')

# Treinar o modelo
history = autoencoder.fit(
    X_scaled, X_scaled,
    epochs=50,
    batch_size=32,
    shuffle=True,
    validation_split=0.2,
    verbose=1
)

# Criar o modelo encoder separado para extração de características
encoder_model = Model(inputs=input_layer, outputs=encoder)

# Obter a representação de baixa dimensão
X_encoded = encoder_model.predict(X_scaled)

# Visualizar os resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_encoded[:, 0], X_encoded[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização do Espaço Latente do Autoencoder')
plt.xlabel('Dimensão Latente 1')
plt.ylabel('Dimensão Latente 2')
plt.grid(True, alpha=0.3)
plt.show()

# Plotar a curva de perdas
plt.figure(figsize=(10, 6))
plt.plot(history.history['loss'], label='Treino')
plt.plot(history.history['val_loss'], label='Validação')
plt.title('Curva de Perdas do Autoencoder')
plt.xlabel('Época')
plt.ylabel('Perda (MSE)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`
    },
    {
      id: 'isomap',
      name: 'Isomap',
      description: 'Técnica de redução de dimensionalidade não-linear que preserva as distâncias geodésicas (ao longo do manifold) entre os pontos, em vez das distâncias euclidianas diretas.',
      strengths: [
        'Preserva estrutura global do manifold',
        'Captura relações não-lineares',
        'Bom para dados que residem em um manifold de baixa dimensão',
        'Preserva distâncias geodésicas',
        'Pode revelar estruturas complexas nos dados'
      ],
      weaknesses: [
        'Sensível ao parâmetro de vizinhança',
        'Computacionalmente intensivo (O(n³) para n amostras)',
        'Não funciona bem com dados muito ruidosos',
        'Problemas com "furos" no manifold',
        'Dificuldade em lidar com dados muito esparsos'
      ],
      useCases: [
        'Visualização de dados de alta dimensão',
        'Análise de dobras e curvas em manifolds',
        'Análise de imagens e visão computacional',
        'Processamento de sinais',
        'Análise de postura e movimento'
      ],
      hyperparameters: [
        { name: 'n_neighbors', description: 'Número de vizinhos para construir o grafo de vizinhança' },
        { name: 'n_components', description: 'Número de dimensões no espaço reduzido' },
        { name: 'eigen_solver', description: 'Método para cálculo de autovalores' },
        { name: 'path_method', description: 'Método para calcular distâncias geodésicas no grafo' }
      ],
      code: `from sklearn.manifold import Isomap
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
import numpy as np

# Normalizar os dados
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar Isomap
isomap = Isomap(n_neighbors=10, n_components=2, path_method='auto')
X_isomap = isomap.fit_transform(X_scaled)

# Visualizar resultados
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_isomap[:, 0], X_isomap[:, 1], c=y, cmap='tab10', alpha=0.8)
plt.colorbar(scatter, label='Classes')
plt.title('Visualização Isomap dos Dados')
plt.xlabel('Componente 1')
plt.ylabel('Componente 2')
plt.grid(True, alpha=0.3)
plt.show()

# Experimentar com diferentes números de vizinhos
n_neighbors_range = [5, 10, 20, 50]
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
axes = axes.ravel()

for i, n_neighbors in enumerate(n_neighbors_range):
    isomap = Isomap(n_neighbors=n_neighbors, n_components=2)
    X_isomap = isomap.fit_transform(X_scaled)
    
    axes[i].scatter(X_isomap[:, 0], X_isomap[:, 1], c=y, cmap='tab10', alpha=0.8)
    axes[i].set_title(f'Isomap com {n_neighbors} vizinhos')
    axes[i].set_xlabel('Componente 1')
    axes[i].set_ylabel('Componente 2')
    axes[i].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`
    },
    {
      id: 'feature-selection',
      name: 'Seleção de Características',
      description: 'Conjunto de técnicas que selecionam um subconjunto das características originais, eliminando aquelas que são irrelevantes ou redundantes para a tarefa em questão.',
      strengths: [
        'Mantém as características originais (interpretabilidade)',
        'Reduz overfitting ao eliminar ruído',
        'Pode melhorar a performance do modelo',
        'Reduz tempo de treinamento e inferência',
        'Simplifica o modelo e melhora a generalização'
      ],
      weaknesses: [
        'Pode perder informações de interações entre features',
        'Métodos univariados não capturam redundâncias',
        'Seleção pode ser instável entre diferentes amostras',
        'Métodos wrapper são computacionalmente intensivos',
        'Pode ser sensível a outliers'
      ],
      useCases: [
        'Modelos interpretáveis',
        'Conjuntos de dados com muitas features irrelevantes',
        'Redução de custo computacional',
        'Análise biomédica e genômica',
        'Quando a simplicidade do modelo é importante'
      ],
      hyperparameters: [
        { name: 'Método de seleção', description: 'Filter, Wrapper ou Embedded' },
        { name: 'Métrica de avaliação', description: 'Correlação, informação mútua, importância em árvores, etc.' },
        { name: 'k', description: 'Número de features a selecionar' },
        { name: 'Threshold', description: 'Limiar para inclusão de features' }
      ],
      code: `from sklearn.feature_selection import SelectKBest, f_classif, RFE
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# 1. Filter Method: SelectKBest com ANOVA F-value
selector = SelectKBest(f_classif, k=5)  # Selecionar as 5 melhores features
X_kbest = selector.fit_transform(X, y)

# Visualizar scores das features
scores = selector.scores_
features = range(X.shape[1])
plt.figure(figsize=(12, 6))
plt.bar(features, scores)
plt.xlabel('Índice da Feature')
plt.ylabel('Score ANOVA F-value')
plt.title('Importância das Features (SelectKBest)')
plt.xticks(features)
plt.grid(True, alpha=0.3)
plt.show()

# 2. Wrapper Method: Recursive Feature Elimination
model = RandomForestClassifier(n_estimators=100, random_state=42)
rfe = RFE(estimator=model, n_features_to_select=5)
X_rfe = rfe.fit_transform(X, y)

# Visualizar ranking das features
plt.figure(figsize=(12, 6))
plt.bar(features, rfe.ranking_)
plt.xlabel('Índice da Feature')
plt.ylabel('Ranking (menor é melhor)')
plt.title('Ranking das Features (RFE)')
plt.xticks(features)
plt.grid(True, alpha=0.3)
plt.show()

# 3. Embedded Method: Importância de features em Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
importances = model.feature_importances_

# Visualizar importância
plt.figure(figsize=(12, 6))
plt.bar(features, importances)
plt.xlabel('Índice da Feature')
plt.ylabel('Importância')
plt.title('Importância das Features (Random Forest)')
plt.xticks(features)
plt.grid(True, alpha=0.3)
plt.show()

# Selecionar features baseado em threshold
from sklearn.feature_selection import SelectFromModel
selector = SelectFromModel(model, threshold='mean')
X_sfm = selector.fit_transform(X, y)
print(f"Features selecionadas: {np.where(selector.get_support())[0]}")
print(f"Número de features selecionadas: {X_sfm.shape[1]}")`
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
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Principais Técnicas de Redução de Dimensionalidade</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          Esta seção apresenta os principais algoritmos e técnicas utilizados para redução de dimensionalidade,
          destacando suas características, pontos fortes e fracos, aplicações comuns e principais 
          hiperparâmetros a serem ajustados.
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
          Clique em cada técnica para ver detalhes completos e exemplos de implementação.
        </span>
      </div>
    </div>
  );
};

export default MainModels;