// src/models/supervised/regression/components/MainModels.jsx
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

  // Dados dos principais modelos de regressão
  const models = [
    {
      id: 'linear-regression',
      name: 'Regressão Linear',
      description: 'Modelo que assume uma relação linear entre as variáveis independentes e a variável dependente. A regressão linear múltipla usa várias variáveis independentes.',
      strengths: [
        'Simples e interpretável',
        'Computacionalmente eficiente',
        'Bom para relações lineares',
        'Fornece coeficientes que indicam importância das features',
        'Bom para conjuntos de dados pequenos'
      ],
      weaknesses: [
        'Assume relação linear entre variáveis',
        'Sensível a outliers',
        'Limitado para relações complexas e não-lineares',
        'Assume independência entre variáveis preditoras',
        'Assume variância constante dos erros (homoscedasticidade)'
      ],
      useCases: [
        'Previsão de vendas simples',
        'Análise de fatores que influenciam preços',
        'Estimativa de consumo de energia',
        'Avaliação de imóveis com fatores lineares'
      ],
      hyperparameters: [
        { name: 'fit_intercept', description: 'Se deve calcular interceptação (termo constante)' },
        { name: 'normalize', description: 'Deprecated em versões recentes, use preprocessamento separado' },
        { name: 'copy_X', description: 'Se deve copiar X para evitar modificar os dados originais' },
        { name: 'n_jobs', description: 'Número de jobs para computações (relevante apenas para alguns solvers)' }
      ],
      code: `from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Preparando os dados (X = features, y = target)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando um pipeline com normalização e regressão linear
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', LinearRegression())
])

# Treinando o modelo
pipeline.fit(X_train, y_train)

# Fazendo previsões
y_pred = pipeline.predict(X_test)

# Avaliando o modelo
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Acessando coeficientes (para interpretação)
coefficients = pipeline.named_steps['regressor'].coef_
intercept = pipeline.named_steps['regressor'].intercept_

print('Interceptação:', intercept)
print('Coeficientes:', coefficients)`
    },
    {
      id: 'polynomial-regression',
      name: 'Regressão Polinomial',
      description: 'Extensão da regressão linear que captura relações não lineares entre variáveis, transformando as features em polinômios de grau n.',
      strengths: [
        'Captura relações não lineares',
        'Ainda é relativamente interpretável',
        'Baseado na regressão linear (implementação simples)',
        'Flexível para diferentes graus de complexidade',
        'Pode modelar curvas e ondulações nos dados'
      ],
      weaknesses: [
        'Facilmente pode causar overfitting com graus altos',
        'Sensível a outliers',
        'Escolha do grau do polinômio pode ser complicada',
        'Computacionalmente mais intensivo que regressão linear',
        'Extrapolação fora do range dos dados de treinamento pode ser problemática'
      ],
      useCases: [
        'Modelagem de curvas de crescimento',
        'Análise de tendências não lineares em séries temporais',
        'Relações em forma de U ou outras curvas',
        'Modelagem de fenômenos físicos com comportamento polinomial'
      ],
      hyperparameters: [
        { name: 'degree', description: 'Grau do polinômio (complexidade do modelo)' },
        { name: 'interaction_only', description: 'Se deve incluir apenas termos de interação' },
        { name: 'include_bias', description: 'Se deve incluir termo de viés (interceptação)' },
        { name: 'order', description: 'Ordem de saída dos termos' }
      ],
      code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o pipeline para regressão polinomial
degree = 3  # Ajuste este grau conforme necessário
polynomial_pipeline = Pipeline([
    ('poly_features', PolynomialFeatures(degree=degree, include_bias=False)),
    ('scaler', StandardScaler()),
    ('regression', LinearRegression())
])

# Treinando o modelo
polynomial_pipeline.fit(X_train, y_train)

# Fazendo previsões
y_pred = polynomial_pipeline.predict(X_test)

# Avaliando o modelo
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'Grau do polinômio: {degree}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Para visualizar o modelo (apenas para caso de 1 feature)
if X.shape[1] == 1:
    X_range = np.linspace(X.min(), X.max(), 100).reshape(-1, 1)
    y_range_pred = polynomial_pipeline.predict(X_range)
    
    plt.figure(figsize=(10, 6))
    plt.scatter(X, y, color='blue', label='Dados reais')
    plt.plot(X_range, y_range_pred, color='red', label=f'Polinômio grau {degree}')
    plt.legend()
    plt.title('Regressão Polinomial')
    plt.show()`
    },
    {
      id: 'ridge-regression',
      name: 'Regressão Ridge',
      description: 'Regressão linear com regularização L2, que adiciona uma penalidade proporcional à soma dos quadrados dos coeficientes para evitar overfitting.',
      strengths: [
        'Evita overfitting em modelos complexos',
        'Lida melhor com multicolinearidade que regressão linear',
        'Mantém todos os coeficientes no modelo, apenas reduzindo sua magnitude',
        'Funciona bem quando há muitas features com impactos similares',
        'Computacionalmente eficiente'
      ],
      weaknesses: [
        'A seleção do parâmetro de regularização (alpha) pode ser desafiadora',
        'Ainda assume relação linear subjacente entre variáveis',
        'Não realiza seleção de features (mantém todas as variáveis)',
        'Menos interpretável que regressão linear simples',
        'Pode subestimar o impacto de variáveis importantes'
      ],
      useCases: [
        'Previsão com muitas variáveis correlacionadas',
        'Quando overfitting é uma preocupação',
        'Modelagem com dados de alta dimensionalidade',
        'Como alternativa à regressão linear em casos complexos'
      ],
      hyperparameters: [
        { name: 'alpha', description: 'Parâmetro de regularização (maior valor = mais regularização)' },
        { name: 'solver', description: 'Algoritmo para otimização do problema' },
        { name: 'max_iter', description: 'Número máximo de iterações para solvers iterativos' },
        { name: 'tol', description: 'Tolerância para critério de parada' },
        { name: 'fit_intercept', description: 'Se deve calcular o termo de interceptação' }
      ],
      code: `from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o pipeline com Ridge
ridge_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('ridge', Ridge(random_state=42))
])

# Busca dos melhores hiperparâmetros
param_grid = {
    'ridge__alpha': [0.001, 0.01, 0.1, 1.0, 10.0, 100.0]
}

grid_search = GridSearchCV(
    ridge_pipeline,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhor modelo e parâmetros
best_alpha = grid_search.best_params_['ridge__alpha']
best_model = grid_search.best_estimator_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'Melhor alpha: {best_alpha}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')`
    },
    {
      id: 'lasso-regression',
      name: 'Regressão Lasso',
      description: 'Regressão linear com regularização L1, que adiciona uma penalidade proporcional à soma dos valores absolutos dos coeficientes, promovendo esparsidade.',
      strengths: [
        'Realiza seleção de features automaticamente (zerando coeficientes irrelevantes)',
        'Bom para conjuntos com muitas features',
        'Evita overfitting',
        'Produz modelos mais simples e interpretáveis',
        'Útil quando apenas algumas variáveis têm impacto significativo'
      ],
      weaknesses: [
        'Com features altamente correlacionadas, tende a selecionar arbitrariamente apenas uma',
        'Dificuldade para selecionar o parâmetro alpha ideal',
        'Pode remover variáveis importantes se alpha for muito alto',
        'Menos estável que Ridge em algumas situações',
        'Performance limitada quando há muitas relações importantes'
      ],
      useCases: [
        'Conjuntos de dados com muitas features',
        'Quando é importante selecionar automaticamente features',
        'Simplificação de modelos complexos',
        'Análise de variáveis mais relevantes'
      ],
      hyperparameters: [
        { name: 'alpha', description: 'Parâmetro de regularização (maior valor = mais regularização)' },
        { name: 'max_iter', description: 'Número máximo de iterações' },
        { name: 'tol', description: 'Tolerância para critério de parada' },
        { name: 'selection', description: 'Estratégia de seleção de features' },
        { name: 'fit_intercept', description: 'Se deve calcular o termo de interceptação' }
      ],
      code: `from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o pipeline com Lasso
lasso_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('lasso', Lasso(random_state=42, max_iter=10000))
])

# Busca dos melhores hiperparâmetros
param_grid = {
    'lasso__alpha': [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0]
}

grid_search = GridSearchCV(
    lasso_pipeline,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhor modelo e parâmetros
best_alpha = grid_search.best_params_['lasso__alpha']
best_model = grid_search.best_estimator_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'Melhor alpha: {best_alpha}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Visualização dos coeficientes (para verificar quais features foram selecionadas)
coef = best_model.named_steps['lasso'].coef_
n_features = len(coef)

plt.figure(figsize=(10, 6))
plt.bar(range(n_features), coef)
plt.xlabel('Feature Index')
plt.ylabel('Coeficiente')
plt.title(f'Coeficientes Lasso (alpha={best_alpha})')
plt.grid(True, alpha=0.3)
plt.show()

# Identificando features com coeficientes não-zero (selecionadas pelo modelo)
selected_features = np.where(coef != 0)[0]
print(f'Número de features selecionadas: {len(selected_features)} de {n_features}')
print('Índices das features selecionadas:', selected_features)`
    },
    {
      id: 'elastic-net',
      name: 'ElasticNet',
      description: 'Combinação de regularizações L1 (Lasso) e L2 (Ridge), permitindo tanto a redução de coeficientes quanto a seleção de features.',
      strengths: [
        'Combina benefícios de Ridge e Lasso',
        'Mais estável que Lasso para features correlacionadas',
        'Realiza seleção de features e redução de magnitude',
        'Flexível para diferentes tipos de dados',
        'Bom para dados com muitas features'
      ],
      weaknesses: [
        'Requer ajuste de dois parâmetros (alpha e l1_ratio)',
        'Computacionalmente mais intensivo que Ridge ou Lasso individualmente',
        'Menos interpretável que modelos mais simples',
        'Pode não ser tão eficiente quanto Lasso para seleção de features',
        'Requer mais dados para treinamento eficaz'
      ],
      useCases: [
        'Conjuntos com muitas features potencialmente correlacionadas',
        'Quando se busca equilíbrio entre seleção de features e regularização',
        'Problemas onde tanto Ridge quanto Lasso funcionam razoavelmente bem',
        'Para prever vendas ou preços com muitos fatores correlacionados'
      ],
      hyperparameters: [
        { name: 'alpha', description: 'Parâmetro de regularização global' },
        { name: 'l1_ratio', description: 'Proporção entre regularização L1 e L2 (0 = Ridge, 1 = Lasso)' },
        { name: 'max_iter', description: 'Número máximo de iterações' },
        { name: 'tol', description: 'Tolerância para critério de parada' },
        { name: 'selection', description: 'Estratégia de seleção de features' }
      ],
      code: `from sklearn.linear_model import ElasticNet
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o pipeline com ElasticNet
elastic_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('elastic', ElasticNet(random_state=42, max_iter=10000))
])

# Busca dos melhores hiperparâmetros - requer ajuste de alpha e l1_ratio
param_grid = {
    'elastic__alpha': [0.001, 0.01, 0.1, 1.0],
    'elastic__l1_ratio': [0.1, 0.3, 0.5, 0.7, 0.9]
}

grid_search = GridSearchCV(
    elastic_pipeline,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhores parâmetros
best_alpha = grid_search.best_params_['elastic__alpha']
best_l1_ratio = grid_search.best_params_['elastic__l1_ratio']
best_model = grid_search.best_estimator_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'Melhor alpha: {best_alpha}')
print(f'Melhor l1_ratio: {best_l1_ratio}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Coeficientes e suas magnitudes
coef = best_model.named_steps['elastic'].coef_
nonzero_coef = np.sum(coef != 0)

print(f'Número de coeficientes não-zero: {nonzero_coef} de {len(coef)}')`
    },
    {
      id: 'svr',
      name: 'Support Vector Regression (SVR)',
      description: 'Extensão do SVM para problemas de regressão. Tenta encontrar um hiperplano que melhor se ajusta aos dados, maximizando a margem de tolerância.',
      strengths: [
        'Eficaz em espaços de alta dimensionalidade',
        'Diferentes kernels para capturar relações não lineares',
        'Robusto contra overfitting em alguns casos',
        'Bom para conjuntos de dados de tamanho médio',
        'Foco em pontos próximos à margem (support vectors)'
      ],
      weaknesses: [
        'Sensível à escolha de hiperparâmetros',
        'Não escala bem para grandes conjuntos de dados',
        'Computacionalmente intensivo para treinamento',
        'Difícil interpretação do modelo',
        'Armazenamento dos vetores de suporte pode ser custoso'
      ],
      useCases: [
        'Previsão de valores em dados complexos não lineares',
        'Quando relações são difíceis de modelar linearmente',
        'Dados com outliers (usando kernels apropriados)',
        'Problemas de regressão de dimensão moderada'
      ],
      hyperparameters: [
        { name: 'C', description: 'Parâmetro de regularização (penalidade de erro)' },
        { name: 'epsilon', description: 'Margem de tolerância (define a largura do tubo)' },
        { name: 'kernel', description: 'Tipo de kernel (linear, poly, rbf, sigmoid)' },
        { name: 'gamma', description: 'Coeficiente do kernel para kernels não lineares' },
        { name: 'degree', description: 'Grau do polinômio para kernel poly' }
      ],
      code: `from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o pipeline com SVR
svr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svr', SVR())
])

# Busca dos melhores hiperparâmetros
param_grid = {
    'svr__kernel': ['linear', 'rbf'],
    'svr__C': [0.1, 1, 10, 100],
    'svr__epsilon': [0.01, 0.1, 0.2],
    'svr__gamma': ['scale', 'auto', 0.1, 0.01]
}

grid_search = GridSearchCV(
    svr_pipeline,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhores parâmetros
best_model = grid_search.best_estimator_
best_params = grid_search.best_params_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print('Melhores parâmetros:')
for param, value in best_params.items():
    print(f'    {param}: {value}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')`
    },
    {
      id: 'random-forest-regression',
      name: 'Random Forest Regression',
      description: 'Ensemble de árvores de decisão para regressão, combinando as previsões de múltiplas árvores treinadas em subconjuntos aleatórios dos dados e features.',
      strengths: [
        'Captura relações não lineares complexas',
        'Robusto contra overfitting',
        'Não requer normalização dos dados',
        'Fornece importância de features',
        'Lida bem com outliers e dados ruidosos'
      ],
      weaknesses: [
        'Menos interpretável que modelos lineares',
        'Computacionalmente intensivo para grandes conjuntos',
        'Propenso a extrapolação pobre (dificuldade fora do range dos dados)',
        'Pode ser pesado em memória',
        'Hiperparametrização pode ser complexa'
      ],
      useCases: [
        'Problemas de regressão complexos com relações não lineares',
        'Quando a interpretabilidade não é crítica',
        'Conjuntos de dados com diferentes tipos de variáveis',
        'Previsão de preços de imóveis, demanda de produtos, etc.'
      ],
      hyperparameters: [
        { name: 'n_estimators', description: 'Número de árvores na floresta' },
        { name: 'max_depth', description: 'Profundidade máxima das árvores' },
        { name: 'min_samples_split', description: 'Número mínimo de amostras para dividir um nó' },
        { name: 'min_samples_leaf', description: 'Número mínimo de amostras em um nó folha' },
        { name: 'max_features', description: 'Número de features a considerar em cada divisão' }
      ],
      code: `from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o modelo Random Forest
rf_regressor = RandomForestRegressor(random_state=42)

# Busca dos melhores hiperparâmetros
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(
    rf_regressor,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhores parâmetros
best_model = grid_search.best_estimator_
best_params = grid_search.best_params_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print('Melhores parâmetros:')
for param, value in best_params.items():
    print(f'    {param}: {value}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Visualizando importância das features
feature_importance = best_model.feature_importances_
sorted_idx = np.argsort(feature_importance)

plt.figure(figsize=(10, 6))
plt.barh(range(len(sorted_idx)), feature_importance[sorted_idx])
plt.yticks(range(len(sorted_idx)), sorted_idx)
plt.xlabel('Importância da Feature')
plt.ylabel('Índice da Feature')
plt.title('Importância das Features - Random Forest')
plt.tight_layout()
plt.show()`
    },
    {
      id: 'gradient-boosting-regression',
      name: 'Gradient Boosting Regression',
      description: 'Ensemble que constrói modelos sequencialmente, onde cada novo modelo corrige erros dos anteriores. Inclui implementações como XGBoost, LightGBM e CatBoost.',
      strengths: [
        'Excelente performance preditiva',
        'Robusto contra overfitting com parâmetros adequados',
        'Captura relações não lineares complexas',
        'Fornece importância de features',
        'Implementações otimizadas disponíveis (XGBoost, LightGBM)'
      ],
      weaknesses: [
        'Computacionalmente intensivo para treinar',
        'Sensível a outliers',
        'Requer ajuste cuidadoso de hiperparâmetros',
        'Menos interpretável que modelos simples',
        'Treinamento sequencial dificulta paralelização'
      ],
      useCases: [
        'Competições de machine learning',
        'Problemas complexos de regressão',
        'Previsão de séries temporais',
        'Situações onde performance é mais importante que interpretabilidade'
      ],
      hyperparameters: [
        { name: 'n_estimators', description: 'Número de estágios de boosting (árvores)' },
        { name: 'learning_rate', description: 'Taxa de aprendizado que controla a contribuição de cada árvore' },
        { name: 'max_depth', description: 'Profundidade máxima das árvores individuais' },
        { name: 'subsample', description: 'Fração de amostras usadas para treinar cada árvore' },
        { name: 'loss', description: 'Função de perda a ser otimizada' }
      ],
      code: `import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Inicializando o modelo XGBoost para regressão
xgb_regressor = xgb.XGBRegressor(
    objective='reg:squarederror',
    random_state=42
)

# Busca dos melhores hiperparâmetros
param_grid = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 4, 5, 6],
    'subsample': [0.8, 0.9, 1.0],
    'colsample_bytree': [0.8, 0.9, 1.0]
}

grid_search = GridSearchCV(
    xgb_regressor,
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

# Treinando o modelo com busca de hiperparâmetros
grid_search.fit(X_train, y_train)

# Melhores parâmetros
best_model = grid_search.best_estimator_
best_params = grid_search.best_params_

# Avaliando o modelo
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print('Melhores parâmetros:')
for param, value in best_params.items():
    print(f'    {param}: {value}')
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Visualizando importância das features
plt.figure(figsize=(10, 6))
xgb.plot_importance(best_model, importance_type='weight')
plt.title('Importância das Features - XGBoost')
plt.tight_layout()
plt.show()

# Treinamento com early stopping para evitar overfitting
xgb_model = xgb.XGBRegressor(
    **best_params,
    random_state=42
)

xgb_model.fit(
    X_train, y_train,
    eval_set=[(X_train, y_train), (X_test, y_test)],
    eval_metric='rmse',
    early_stopping_rounds=20,
    verbose=False
)

print(f'Melhor iteração: {xgb_model.best_iteration}')`
    },
    {
      id: 'neural-networks',
      name: 'Redes Neurais para Regressão',
      description: 'Modelos de deep learning aplicados a problemas de regressão, usando camadas densas (fully connected) para capturar relações complexas.',
      strengths: [
        'Extremamente poderoso para capturar relações complexas',
        'Flexível para diferentes arquiteturas',
        'Capaz de aprender features automaticamente',
        'Escalável para grandes conjuntos de dados',
        'Pode ser combinado com outros tipos de camadas (CNN, RNN)'
      ],
      weaknesses: [
        'Requer mais dados para treinamento eficaz',
        'Computacionalmente intensivo',
        'Propenso a overfitting sem regularização adequada',
        'Difícil interpretabilidade ("caixa preta")',
        'Engenharia de rede e hiperparâmetros complexos'
      ],
      useCases: [
        'Problemas de regressão altamente complexos',
        'Quando há muitos dados disponíveis',
        'Previsão de séries temporais',
        'Quando a performance é mais importante que interpretabilidade'
      ],
      hyperparameters: [
        { name: 'Arquitetura da rede', description: 'Número e tamanho das camadas ocultas' },
        { name: 'Funções de ativação', description: 'ReLU, sigmoid, tanh, etc.' },
        { name: 'Taxa de aprendizado', description: 'Step size do otimizador' },
        { name: 'Batch size', description: 'Tamanho dos lotes para treinamento' },
        { name: 'Regularização', description: 'L1, L2, dropout, etc.' }
      ],
      code: `import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalizando os dados
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Criando um modelo sequencial
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(1)  # Sem ativação na camada de saída para regressão
])

# Compilando o modelo
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='mean_squared_error',
    metrics=['mae']
)

# Callbacks para early stopping e checkpoint
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=20,
    restore_best_weights=True
)

model_checkpoint = ModelCheckpoint(
    'best_nn_model.h5',
    monitor='val_loss',
    save_best_only=True
)

# Treinando o modelo
history = model.fit(
    X_train_scaled, y_train,
    validation_split=0.2,
    epochs=200,
    batch_size=32,
    callbacks=[early_stopping, model_checkpoint],
    verbose=1
)

# Avaliando o modelo
y_pred = model.predict(X_test_scaled).flatten()
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')

# Visualizando o histórico de treinamento
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Treino')
plt.plot(history.history['val_loss'], label='Validação')
plt.title('Loss por Época')
plt.xlabel('Época')
plt.ylabel('MSE')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['mae'], label='Treino')
plt.plot(history.history['val_mae'], label='Validação')
plt.title('MAE por Época')
plt.xlabel('Época')
plt.ylabel('MAE')
plt.legend()

plt.tight_layout()
plt.show()

# Visualizando previsões vs valores reais
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Valores Reais')
plt.ylabel('Valores Previstos')
plt.title('Previsões vs Valores Reais - Rede Neural')
plt.grid(True, alpha=0.3)
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
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Principais Modelos de Regressão</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          Esta seção apresenta os principais algoritmos e modelos utilizados para problemas de 
          regressão, destacando suas características, pontos fortes e fracos, aplicações comuns 
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