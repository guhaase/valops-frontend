// testing/models/classification/ClassificationMainModels.js
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

  // Dados dos principais modelos de classificação
  const models = [
    {
      id: 'logistic-regression',
      name: 'Regressão Logística',
      description: 'Modelo linear que utiliza a função logística para modelar a probabilidade de um evento binário. Apesar do nome, é um modelo de classificação.',
      strengths: [
        'Simples e interpretável',
        'Bom para conjuntos de dados pequenos',
        'Fornece probabilidades de classe',
        'Eficiente computacionalmente',
        'Baixo risco de overfitting'
      ],
      weaknesses: [
        'Assume relação linear entre features e log-odds',
        'Limitado para problemas complexos',
        'Não captura interações não-lineares sem engenharia de features',
        'Sensível a outliers'
      ],
      useCases: [
        'Predição de churn de clientes',
        'Aprovação de crédito',
        'Diagnóstico médico simples',
        'Marketing (conversão de clientes)'
      ],
      hyperparameters: [
        { name: 'C', description: 'Inverso da força de regularização (menor valor = mais regularização)' },
        { name: 'penalty', description: 'Tipo de regularização (L1, L2, ElasticNet)' },
        { name: 'solver', description: 'Algoritmo de otimização utilizado' },
        { name: 'class_weight', description: 'Pesos das classes (útil para dados desbalanceados)' }
      ],
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Criando um pipeline com normalização e regressão logística
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression(C=1.0, penalty='l2', random_state=42))
])

# Treinando o modelo
pipeline.fit(X_train, y_train)

# Fazendo previsões
y_pred = pipeline.predict(X_test)
y_pred_proba = pipeline.predict_proba(X_test)[:, 1]  # Probabilidades da classe positiva`
    },
    {
      id: 'decision-tree',
      name: 'Árvore de Decisão',
      description: 'Modelo que separa o espaço de características em regiões simples, tomando decisões baseadas em perguntas sequenciais sobre os atributos.',
      strengths: [
        'Altamente interpretável',
        'Captura relações não-lineares',
        'Não requer normalização',
        'Seleciona naturalmente features relevantes',
        'Lida bem com features categóricas e numéricas'
      ],
      weaknesses: [
        'Propenso a overfitting',
        'Instável (pequenas mudanças nos dados podem alterar significativamente a árvore)',
        'Pode criar estruturas complexas',
        'Desempenho inferior a métodos ensemble'
      ],
      useCases: [
        'Sistemas de regras de negócio',
        'Triagem médica',
        'Análise de risco',
        'Processos de decisão que precisam ser explicáveis'
      ],
      hyperparameters: [
        { name: 'max_depth', description: 'Profundidade máxima da árvore' },
        { name: 'min_samples_split', description: 'Número mínimo de amostras para dividir um nó' },
        { name: 'min_samples_leaf', description: 'Número mínimo de amostras em um nó folha' },
        { name: 'criterion', description: 'Função para medir a qualidade da divisão (gini, entropy)' },
        { name: 'max_features', description: 'Número máximo de features a considerar em cada divisão' }
      ],
      code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV

# Criando o modelo
dt_classifier = DecisionTreeClassifier(random_state=42)

# Definindo parâmetros para otimização
param_grid = {
    'max_depth': [None, 5, 10, 15, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'criterion': ['gini', 'entropy']
}

# Grid search para encontrar os melhores parâmetros
grid_search = GridSearchCV(dt_classifier, param_grid, cv=5, scoring='f1')
grid_search.fit(X_train, y_train)

# Melhor modelo
best_dt = grid_search.best_estimator_`
    },
    {
      id: 'random-forest',
      name: 'Random Forest',
      description: 'Método ensemble que combina múltiplas árvores de decisão, cada uma treinada em uma amostra aleatória dos dados e com um subconjunto aleatório de features.',
      strengths: [
        'Maior precisão que árvores individuais',
        'Menos propenso a overfitting',
        'Robusto a outliers e ruído',
        'Fornece importância das features',
        'Lida bem com grandes conjuntos de dados'
      ],
      weaknesses: [
        'Menos interpretável que árvores individuais',
        'Computacionalmente mais intensivo',
        'Requer mais memória e espaço de armazenamento',
        'Pode ser lento para predição com muitas árvores'
      ],
      useCases: [
        'Detecção de fraudes',
        'Análise de risco de crédito',
        'Previsão de doenças',
        'Classificação de imagens',
        'Recomendação de produtos'
      ],
      hyperparameters: [
        { name: 'n_estimators', description: 'Número de árvores na floresta' },
        { name: 'max_depth', description: 'Profundidade máxima das árvores' },
        { name: 'min_samples_split', description: 'Número mínimo de amostras para dividir um nó' },
        { name: 'min_samples_leaf', description: 'Número mínimo de amostras em um nó folha' },
        { name: 'max_features', description: 'Número de features a considerar em cada divisão' },
        { name: 'bootstrap', description: 'Se as amostras são sorteadas com ou sem reposição' }
      ],
      code: `from sklearn.ensemble import RandomForestClassifier

# Criando o modelo Random Forest
rf_classifier = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features='sqrt',
    bootstrap=True,
    random_state=42
)

# Treinando o modelo
rf_classifier.fit(X_train, y_train)

# Obtendo a importância das features
feature_importances = rf_classifier.feature_importances_`
    },
    {
      id: 'svm',
      name: 'Support Vector Machines (SVM)',
      description: 'Modelo que busca encontrar um hiperplano que melhor separa as classes, maximizando a margem entre os pontos de diferentes classes mais próximos.',
      strengths: [
        'Eficaz em espaços de alta dimensão',
        'Robusto contra overfitting em espaços de alta dimensão',
        'Versátil através de diferentes kernels',
        'Bom desempenho quando há separação clara entre classes'
      ],
      weaknesses: [
        'Não escala bem para grandes volumes de dados',
        'Sensível à escolha de parâmetros e kernel',
        'Difícil interpretação do modelo',
        'Lento para treinar com muitos exemplos',
        'Não fornece probabilidades diretamente'
      ],
      useCases: [
        'Classificação de texto',
        'Reconhecimento de imagens',
        'Bioinformática',
        'Previsão em espaços de alta dimensão'
      ],
      hyperparameters: [
        { name: 'C', description: 'Parâmetro de regularização que controla o trade-off entre margem e erro' },
        { name: 'kernel', description: 'Função kernel para transformação dos dados (linear, poly, rbf, sigmoid)' },
        { name: 'gamma', description: 'Coeficiente para kernels rbf, poly e sigmoid' },
        { name: 'degree', description: 'Grau do polinômio para kernel poly' },
        { name: 'class_weight', description: 'Pesos para as classes (útil para dados desbalanceados)' }
      ],
      code: `from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# SVMs exigem normalização dos dados
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', SVC(kernel='rbf', C=1.0, gamma='scale', probability=True, random_state=42))
])

# Treinando o modelo
pipeline.fit(X_train, y_train)

# Para obter probabilidades
y_pred_proba = pipeline.predict_proba(X_test)`
    },
    {
      id: 'gradient-boosting',
      name: 'Gradient Boosting',
      description: 'Método ensemble que constrói árvores sequencialmente, onde cada árvore corrige os erros da combinação anterior. Inclui variantes como XGBoost, LightGBM e CatBoost.',
      strengths: [
        'Excelente performance preditiva',
        'Robusto contra overfitting com parâmetros adequados',
        'Lida bem com diferentes tipos de dados',
        'Destaca features importantes',
        'Captura relações complexas entre features'
      ],
      weaknesses: [
        'Computacionalmente intensivo',
        'Requer ajuste cuidadoso de hiperparâmetros',
        'Menos interpretável que modelos mais simples',
        'Pode ser sensível a outliers',
        'Treinamento sequencial dificulta a paralelização'
      ],
      useCases: [
        'Competições de machine learning',
        'Problemas complexos de classificação',
        'Sistemas de recomendação',
        'Previsão de risco de crédito',
        'Detecção de fraudes'
      ],
      hyperparameters: [
        { name: 'n_estimators', description: 'Número de estágios de boosting (árvores)' },
        { name: 'learning_rate', description: 'Taxa de aprendizado que controla a contribuição de cada árvore' },
        { name: 'max_depth', description: 'Profundidade máxima das árvores individuais' },
        { name: 'subsample', description: 'Fração de amostras usadas para treinar cada árvore' },
        { name: 'colsample_bytree', description: 'Fração de features usadas para treinar cada árvore' }
      ],
      code: `import xgboost as xgb

# Criando o modelo XGBoost
xgb_classifier = xgb.XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    subsample=0.8,
    colsample_bytree=0.8,
    objective='binary:logistic',
    random_state=42
)

# Treinando o modelo
xgb_classifier.fit(
    X_train, 
    y_train, 
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=10,
    verbose=False
)

# Fazendo previsões
y_pred = xgb_classifier.predict(X_test)
y_pred_proba = xgb_classifier.predict_proba(X_test)[:, 1]`
    },
    {
      id: 'neural-networks',
      name: 'Redes Neurais',
      description: 'Modelos inspirados no cérebro humano, compostos por camadas de neurônios artificiais que aprendem representações complexas dos dados.',
      strengths: [
        'Extremamente poderoso para relações complexas e não-lineares',
        'Capaz de aprender representações automáticas dos dados',
        'Adaptável a diferentes tipos de dados (textos, imagens, séries temporais)',
        'Escalável para grandes volumes de dados',
        'Pode atingir estado da arte em muitos problemas'
      ],
      weaknesses: [
        'Geralmente exige grandes volumes de dados',
        'Computacionalmente intensivo para treinar',
        'Propenso a overfitting sem regularização adequada',
        'Difícil interpretabilidade (caixa preta)',
        'Requer expertise para arquitetura e hiperparâmetros'
      ],
      useCases: [
        'Classificação de imagens',
        'Processamento de linguagem natural',
        'Detecção de fraudes complexas',
        'Sistemas de recomendação avançados',
        'Aplicações onde as relações nos dados são altamente complexas'
      ],
      hyperparameters: [
        { name: 'Arquitetura', description: 'Número de camadas e unidades em cada camada' },
        { name: 'Função de ativação', description: 'ReLU, sigmoid, tanh, etc.' },
        { name: 'Taxa de aprendizado', description: 'Controla o tamanho dos passos durante a otimização' },
        { name: 'Dropout', description: 'Taxa de neurônios a serem ignorados durante o treinamento (regularização)' },
        { name: 'Batch size', description: 'Número de amostras processadas antes da atualização dos pesos' },
        { name: 'Épocas', description: 'Número de vezes que o algoritmo percorre o conjunto de dados completo' }
      ],
      code: `import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Criando um modelo sequencial
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')  # Para classificação binária
])

# Compilando o modelo
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Treinando o modelo
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    batch_size=32,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=5)]
)`
    },
    {
      id: 'naive-bayes',
      name: 'Naive Bayes',
      description: 'Família de classificadores probabilísticos baseados no teorema de Bayes, com a "ingênua" suposição de independência entre as features.',
      strengths: [
        'Muito rápido para treinar e prever',
        'Funciona bem com conjuntos de dados pequenos',
        'Robusto a features irrelevantes',
        'Boa performance para classificação de texto',
        'Necessita de poucos dados de treinamento'
      ],
      weaknesses: [
        'Assume independência entre features (raramente verdadeiro)',
        'Não captura interações entre features',
        'Pode ser superado por modelos mais complexos',
        'Zero frequency problem (quando uma categoria não aparece no treino)',
        'Estimativas de probabilidade nem sempre são bem calibradas'
      ],
      useCases: [
        'Classificação de texto e spam',
        'Análise de sentimento',
        'Sistemas de recomendação',
        'Diagnóstico médico',
        'Filtragem de conteúdo'
      ],
      hyperparameters: [
        { name: 'var_smoothing', description: 'Estabilidade numérica (GaussianNB)' },
        { name: 'alpha', description: 'Parâmetro de suavização aditiva (MultinomialNB, ComplementNB)' },
        { name: 'fit_prior', description: 'Se deve aprender probabilidades de classes (MultinomialNB, BernoulliNB)' },
        { name: 'class_prior', description: 'Probabilidades a priori das classes' },
        { name: 'binarize', description: 'Threshold para binarização de features (BernoulliNB)' }
      ],
      code: `from sklearn.naive_bayes import GaussianNB, MultinomialNB

# Para features contínuas
nb_gaussian = GaussianNB()
nb_gaussian.fit(X_train, y_train)

# Para contagens (ex: frequência de palavras)
nb_multinomial = MultinomialNB(alpha=1.0)
nb_multinomial.fit(X_train, y_train)

# Probabilidades de classe
class_probs = nb_gaussian.predict_proba(X_test)`
    },
    {
      id: 'knn',
      name: 'K-Nearest Neighbors (KNN)',
      description: 'Algoritmo que classifica um exemplo com base na maioria das classes de seus k vizinhos mais próximos no espaço de features.',
      strengths: [
        'Simples e intuitivo',
        'Não faz suposições sobre a distribuição dos dados',
        'Funciona bem para fronteiras de decisão complexas',
        'Não requer treinamento (lazy learner)',
        'Naturalmente multiclasse'
      ],
      weaknesses: [
        'Lento para predição em grandes conjuntos de dados',
        'Sensível à escala das features',
        'Performance reduzida em alta dimensionalidade (curse of dimensionality)',
        'Requer boa medida de similaridade',
        'Memória intensiva (armazena todo o conjunto de treinamento)'
      ],
      useCases: [
        'Sistemas de recomendação',
        'Classificação de imagens simples',
        'Detecção de anomalias',
        'Imputação de dados',
        'Problemas onde a relação entre features é complexa mas local'
      ],
      hyperparameters: [
        { name: 'n_neighbors (k)', description: 'Número de vizinhos a considerar' },
        { name: 'weights', description: 'Função de peso (uniforme ou por distância)' },
        { name: 'metric', description: 'Métrica de distância (euclidiana, manhattan, etc.)' },
        { name: 'p', description: 'Parâmetro para métrica Minkowski (p=1: manhattan, p=2: euclidiana)' },
        { name: 'algorithm', description: 'Algoritmo para computar vizinhos mais próximos' }
      ],
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# KNN é sensível à escala, então normalização é importante
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', KNeighborsClassifier(n_neighbors=5, weights='distance'))
])

# Treinando o modelo (na verdade, apenas armazenando os dados)
pipeline.fit(X_train, y_train)

# Fazendo previsões
y_pred = pipeline.predict(X_test)`
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
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Principais Modelos de Classificação</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          Esta seção apresenta os principais algoritmos e modelos utilizados para problemas de 
          classificação, destacando suas características, pontos fortes e fracos, aplicações comuns 
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
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{model.code}</code>
                    </pre>
                  </div>
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