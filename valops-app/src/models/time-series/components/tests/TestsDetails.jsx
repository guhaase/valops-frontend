// src/models/supervised/time-series/components/tests/TestsDetails.jsx
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
    validationMethods: true,
    diagnostics: false,
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

  // Dados sobre métodos de validação para séries temporais
  const validationMethods = [
    {
      id: 'train-test-split',
      name: 'Divisão Temporal',
      description: 'Divide a série temporal em conjuntos de treino e teste de forma cronológica, com dados mais antigos para treino e mais recentes para teste.',
      details: [
        'Preserva a ordem temporal dos dados',
        'Simula o cenário real de previsão (prever futuro com base no passado)',
        'Geralmente usa proporções como 80/20 ou 70/30',
        'Deve considerar ciclos sazonais completos em ambos os conjuntos'
      ],
      when: [
        'É o método básico e essencial para qualquer validação de séries temporais',
        'Quando há dados suficientes para criar conjuntos representativos',
        'Para avaliação final de modelos antes da implantação'
      ],
      limitations: [
        'Sensível ao período específico escolhido para teste',
        'Pode não capturar adequadamente a variação da performance ao longo do tempo',
        'Utiliza apenas uma amostra de teste, reduzindo a confiabilidade da estimativa de erro'
      ]
    },
    {
      id: 'rolling-origin',
      name: 'Validação com Origem Móvel',
      description: 'Realiza múltiplas avaliações, cada uma com um ponto de origem diferente, mas mantendo o horizonte de previsão fixo.',
      details: [
        'Cria múltiplos pares de treino/teste ao longo da série',
        'Mantém o horizonte de previsão constante (ex: sempre 3 meses à frente)',
        'Simula como o modelo se comportaria se fosse atualizado periodicamente',
        'Fornece distribuição do erro ao invés de uma única estimativa'
      ],
      when: [
        'Quando é importante entender a estabilidade da performance ao longo do tempo',
        'Para avaliar como o modelo se comporta em diferentes períodos históricos',
        'Em séries longas com possíveis mudanças estruturais'
      ],
      limitations: [
        'Computacionalmente mais intensivo (múltiplos treinamentos)',
        'Pode ser impraticável para modelos muito complexos ou conjuntos muito grandes',
        'Os testes não são totalmente independentes (sobreposição de dados)'
      ]
    },
    {
      id: 'rolling-window',
      name: 'Validação com Janela Deslizante',
      description: 'Usa uma janela de tamanho fixo para treinamento que se move ao longo do tempo, simulando um modelo que é treinado apenas com dados recentes.',
      details: [
        'Mantém o tamanho do conjunto de treino constante',
        'Remove dados antigos à medida que novos dados são incluídos',
        'Simula cenário onde apenas dados recentes são relevantes',
        'Útil para séries não-estacionárias ou com mudanças de regime'
      ],
      when: [
        'Quando dados históricos distantes são menos relevantes para previsões atuais',
        'Em séries com mudanças estruturais ou regimes diferentes ao longo do tempo',
        'Para simular modelos que serão frequentemente retreinados com dados recentes'
      ],
      limitations: [
        'Pode perder padrões de longo prazo ou sazonalidade de baixa frequência',
        'Sensível ao tamanho da janela escolhida',
        'Mais complexo de implementar e interpretar'
      ]
    },
    {
      id: 'expanding-window',
      name: 'Validação com Janela Expansiva',
      description: 'Similar à origem móvel, mas aumenta o tamanho do conjunto de treino a cada iteração, mantendo todos os dados históricos.',
      details: [
        'Inicia com um conjunto mínimo de treino e expande incrementalmente',
        'Retém todos os dados históricos em cada iteração',
        'Simula cenário onde o modelo é atualizado regularmente com novos dados',
        'Avalia como a performance melhora com mais dados de treinamento'
      ],
      when: [
        'Quando todos os dados históricos permanecem relevantes',
        'Para entender como a quantidade de dados históricos afeta a performance',
        'Em séries estacionárias onde padrões antigos ainda são aplicáveis'
      ],
      limitations: [
        'Menos eficaz para séries com mudanças estruturais significativas',
        'Primeiras iterações podem ter conjuntos de treino muito pequenos',
        'Pode ser computacionalmente intensivo para séries muito longas'
      ]
    },
    {
      id: 'nested-cv',
      name: 'Validação Cruzada Aninhada',
      description: 'Combina validação temporal para seleção de hiperparâmetros dentro de um esquema maior de validação temporal para avaliação de performance.',
      details: [
        'Separação explícita entre otimização de hiperparâmetros e avaliação final',
        'Evita otimismo na estimativa de erro devido à seleção de hiperparâmetros',
        'Mantém a integridade temporal em ambos os níveis',
        'Fornece estimativa mais robusta do erro de generalização'
      ],
      when: [
        'Quando há extensiva otimização de hiperparâmetros',
        'Para avaliação rigorosa de modelos complexos com muitos parâmetros',
        'Em comparações formais entre diferentes arquiteturas de modelos',
        'Quando há disponibilidade de dados e recursos computacionais suficientes'
      ],
      limitations: [
        'Significativamente mais complexo e computacionalmente intensivo',
        'Requer grandes volumes de dados para ser efetivo',
        'Pode ser desnecessariamente elaborado para modelos simples ou validações preliminares'
      ]
    },
    {
      id: 'multiple-horizon',
      name: 'Validação Multi-horizonte',
      description: 'Avalia o modelo em múltiplos horizontes de previsão simultaneamente para entender como a performance se degrada com previsões mais distantes.',
      details: [
        'Testa o mesmo modelo em diferentes horizontes de previsão',
        'Avalia a degradação da performance conforme o horizonte aumenta',
        'Pode utilizar previsão direta ou iterativa para diferentes horizontes',
        'Fornece visão completa da capacidade preditiva em diferentes prazos'
      ],
      when: [
        'Quando diferentes horizontes de previsão são relevantes para a aplicação',
        'Para entender o trade-off entre precisão e horizonte de previsão',
        'Em sistemas que precisam tomar decisões com diferentes antecedências',
        'Para definir o limite prático de horizonte útil para o modelo'
      ],
      limitations: [
        'Aumenta a complexidade da avaliação e interpretação dos resultados',
        'Pode exigir diferentes configurações de modelo para diferentes horizontes',
        'Métricas agregadas entre horizontes podem obscurecer nuances importantes'
      ]
    }
  ];

  // Dados sobre testes de diagnóstico para séries temporais
  const diagnosticTests = [
    {
      id: 'residuals-acf',
      name: 'Análise de Autocorrelação dos Resíduos',
      description: 'Verifica se os resíduos do modelo apresentam correlação serial, o que indicaria que existem padrões temporais não capturados pelo modelo.',
      implementation: [
        'Calcular os resíduos (valor real - valor previsto)',
        'Plotar a função de autocorrelação (ACF) dos resíduos',
        'Aplicar teste estatístico de Ljung-Box para significância',
        'Verificar se a correlação está dentro das bandas de confiança'
      ],
      interpretation: [
        'Resíduos ideais: não apresentam autocorrelação significativa (ruído branco)',
        'Autocorrelação significativa: modelo não capturou todos os padrões temporais',
        'Padrões sazonais nos resíduos: sazonalidade não modelada corretamente',
        'p-valor abaixo de 0.05 no teste Ljung-Box: rejeita hipótese de resíduos não correlacionados'
      ]
    },
    {
      id: 'normality',
      name: 'Teste de Normalidade dos Resíduos',
      description: 'Avalia se os resíduos seguem uma distribuição normal, o que é pressuposto para muitos testes estatísticos e para a construção de intervalos de confiança válidos.',
      implementation: [
        'Plotar histograma dos resíduos e comparar com distribuição normal',
        'Criar gráfico quantil-quantil (Q-Q plot)',
        'Aplicar testes formais: Shapiro-Wilk, Anderson-Darling, Jarque-Bera',
        'Verificar assimetria e curtose dos resíduos'
      ],
      interpretation: [
        'Resíduos ideais: distribuição aproximadamente normal sem assimetria ou caudas pesadas',
        'Desvios da normalidade podem indicar relações não lineares não modeladas',
        'p-valor alto nos testes: não rejeita hipótese de normalidade',
        'Não-normalidade afeta principalmente a validade dos intervalos de confiança'
      ]
    },
    {
      id: 'stationarity',
      name: 'Testes de Estacionariedade',
      description: 'Avalia se a série temporal original e os resíduos do modelo são estacionários, ou seja, se suas propriedades estatísticas não mudam ao longo do tempo.',
      implementation: [
        'Aplicar teste de Dickey-Fuller Aumentado (ADF)',
        'Aplicar teste KPSS (que tem hipótese nula inversa ao ADF)',
        'Verificar tendência na média e variância dos resíduos',
        'Examinar visualmente a série e resíduos por períodos'
      ],
      interpretation: [
        'Série não-estacionária e resíduos estacionários: modelo capturou a não-estacionariedade',
        'Resíduos não-estacionários: modelo não removeu adequadamente tendências ou outros componentes',
        'ADF p-valor baixo: rejeita hipótese nula de não-estacionariedade',
        'KPSS p-valor alto: não rejeita hipótese nula de estacionariedade'
      ]
    },
    {
      id: 'heteroscedasticity',
      name: 'Testes de Heteroscedasticidade',
      description: 'Verifica se a variância dos resíduos muda ao longo do tempo, o que pode indicar necessidade de modelagem específica para a volatilidade (como modelos GARCH).',
      implementation: [
        'Plotar resíduos ao longo do tempo e verificar padrões na dispersão',
        'Aplicar teste ARCH-LM para efeitos ARCH',
        'Plotar resíduos quadrados e verificar autocorrelação',
        'Agrupar resíduos por períodos e comparar variâncias'
      ],
      interpretation: [
        'Variância constante (homoscedasticidade): modelo captura adequadamente a estrutura de volatilidade',
        'Clusters de volatilidade: períodos de alta/baixa variabilidade não capturados',
        'ARCH-LM p-valor baixo: presença de efeitos ARCH (considerar modelos tipo GARCH)',
        'Heteroscedasticidade afeta eficiência dos estimadores e intervalos de previsão'
      ]
    },
    {
      id: 'forecast-evaluation',
      name: 'Avaliação de Intervalos de Previsão',
      description: 'Verifica se os intervalos de previsão gerados pelo modelo têm a cobertura esperada e são bem calibrados.',
      implementation: [
        'Calcular taxa de cobertura empírica dos intervalos',
        'Verificar se proporção de observações dentro dos intervalos corresponde ao nível de confiança',
        'Verificar tendências na cobertura ao longo do tempo ou por região da série',
        'Avaliar largura média ou mediana dos intervalos'
      ],
      interpretation: [
        'Cobertura próxima ao nível nominal (ex: ~95% para IC 95%): intervalos bem calibrados',
        'Cobertura abaixo do nível nominal: intervalos muito estreitos (subconfiante)',
        'Cobertura acima do nível nominal: intervalos muito amplos (superconfiante)',
        'Variação na cobertura por região: calibração inconsistente ao longo da série'
      ]
    },
    {
      id: 'structural-breaks',
      name: 'Testes de Quebras Estruturais',
      description: 'Identifica se existem pontos na série onde as propriedades estatísticas mudam significativamente, o que pode requerer modelagem específica ou segmentação.',
      implementation: [
        'Aplicar teste de Chow em pontos suspeitos',
        'Utilizar teste CUSUM para detecção de mudanças',
        'Empregar teste de Quandt Likelihood Ratio para múltiplas quebras',
        'Verificar mudanças na performance do modelo ao longo do tempo'
      ],
      interpretation: [
        'Identificação de quebras estruturais: períodos onde o modelo tem performance significativamente diferente',
        'Quebras podem indicar necessidade de: atualizar modelo, usar janela deslizante, modelar regimes separadamente',
        'Testes com p-valor baixo: evidência estatística de mudança estrutural',
        'Quebras não tratadas podem comprometer severamente a confiabilidade das previsões'
      ]
    }
  ];

  // Código de exemplo para validação e diagnóstico
  const codeSnippets = {
    validation: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Função para validação com origem móvel (rolling origin)
def rolling_origin_validation(data, model_func, start_train_size, test_size, step_size, max_iterations=None):
    """
    Realiza validação com origem móvel para séries temporais.
    
    Parâmetros:
    -----------
    data : array-like
        Série temporal completa
    model_func : function
        Função que recebe dados de treino e retorna um modelo treinado e uma função de previsão
    start_train_size : int
        Tamanho inicial do conjunto de treino
    test_size : int
        Tamanho do conjunto de teste (horizonte de previsão)
    step_size : int
        Número de observações para avançar entre iterações
    max_iterations : int, opcional
        Número máximo de iterações
        
    Retorna:
    --------
    DataFrame com métricas de erro por iteração
    """
    results = []
    n = len(data)
    
    # Determinar número de iterações
    max_possible_iterations = (n - start_train_size - test_size) // step_size + 1
    if max_iterations is not None:
        iterations = min(max_iterations, max_possible_iterations)
    else:
        iterations = max_possible_iterations
    
    for i in range(iterations):
        # Definir índices de treino e teste
        train_end = start_train_size + i * step_size
        test_start = train_end
        test_end = test_start + test_size
        
        if test_end > n:
            break
            
        # Dividir dados
        train_data = data[:train_end]
        test_data = data[test_start:test_end]
        
        # Treinar modelo (função personalizada passada como parâmetro)
        model, predict_func = model_func(train_data)
        
        # Fazer previsão
        predictions = predict_func(test_size)
        
        # Calcular métricas
        mae = mean_absolute_error(test_data, predictions)
        rmse = np.sqrt(mean_squared_error(test_data, predictions))
        mape = mean_absolute_percentage_error(test_data, predictions) * 100
        
        # Armazenar resultados
        results.append({
            'iteracao': i+1,
            'train_size': len(train_data),
            'train_end_idx': train_end,
            'test_start_idx': test_start,
            'test_end_idx': test_end,
            'mae': mae,
            'rmse': rmse,
            'mape': mape
        })
    
    return pd.DataFrame(results)

# Exemplo de uso para modelo SARIMA
def sarima_model_func(train_data):
    """Função que treina um modelo SARIMA e retorna o modelo e uma função de previsão"""
    # Ajustar modelo SARIMA
    model = SARIMAX(train_data, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    result = model.fit(disp=False)
    
    # Função de previsão
    def predict(steps):
        return result.forecast(steps)
    
    return result, predict

# Carregar dados
df = pd.read_csv('serie_temporal.csv', parse_dates=['data'], index_col='data')
serie = df['valor']

# Executar validação
val_results = rolling_origin_validation(
    data=serie,
    model_func=sarima_model_func,
    start_train_size=24,  # 2 anos de dados mensais iniciais
    test_size=3,          # Previsão de 3 meses à frente
    step_size=1,          # Avançar 1 mês por iteração
    max_iterations=20     # Limitar a 20 iterações
)

# Visualizar resultados
plt.figure(figsize=(12, 6))
plt.plot(val_results['iteracao'], val_results['mape'], marker='o')
plt.xlabel('Iteração')
plt.ylabel('MAPE (%)')
plt.title('Erro Percentual Absoluto Médio nas Iterações de Validação')
plt.grid(True)
plt.show()

# Resumo estatístico dos erros
print("Resumo das métricas:")
print(val_results[['mae', 'rmse', 'mape']].describe())

# Visualização boxplot das métricas
plt.figure(figsize=(10, 6))
val_results[['mae', 'rmse', 'mape']].boxplot()
plt.title('Distribuição das Métricas de Erro')
plt.ylabel('Valor')
plt.show()`,
    
    diagnostics: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller, kpss, acf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.stats.diagnostic import het_arch, acorr_ljungbox
from scipy import stats
import seaborn as sns

# Carregar dados
df = pd.read_csv('serie_temporal.csv', parse_dates=['data'], index_col='data')
serie = df['valor']

# Suponha que já temos um modelo treinado e seus resíduos
# Aqui vamos simular isso com um modelo SARIMA simples
from statsmodels.tsa.statespace.sarimax import SARIMAX

modelo = SARIMAX(serie, order=(1, 1, 1), seasonal_order=(1, 1, 0, 12))
resultado = modelo.fit(disp=False)
residuos = resultado.resid

# 1. Análise visual dos resíduos
plt.figure(figsize=(12, 8))

# Série temporal dos resíduos
plt.subplot(2, 2, 1)
plt.plot(residuos)
plt.title('Resíduos ao Longo do Tempo')
plt.axhline(y=0, color='r', linestyle='-')
plt.grid(True)

# Histograma dos resíduos
plt.subplot(2, 2, 2)
sns.histplot(residuos, kde=True)
plt.title('Distribuição dos Resíduos')
plt.grid(True)

# Q-Q plot para testar normalidade
plt.subplot(2, 2, 3)
stats.probplot(residuos, dist="norm", plot=plt)
plt.title('Q-Q Plot dos Resíduos')
plt.grid(True)

# ACF dos resíduos
plt.subplot(2, 2, 4)
plot_acf(residuos, lags=24, ax=plt.gca())
plt.title('Autocorrelação dos Resíduos')
plt.grid(True)

plt.tight_layout()
plt.show()

# 2. Teste de autocorrelação dos resíduos (Ljung-Box)
lb_result = acorr_ljungbox(residuos, lags=[12, 24, 36], return_df=True)
print("\nTeste de Ljung-Box para Autocorrelação:")
print(lb_result)
print("Interpretação: p-valor < 0.05 indica presença de autocorrelação")

# 3. Teste de normalidade
shapiro_test = stats.shapiro(residuos)
print("\nTeste de Shapiro-Wilk para Normalidade:")
print(f"Estatística: {shapiro_test[0]:.4f}, p-valor: {shapiro_test[1]:.4f}")
print("Interpretação: p-valor < 0.05 rejeita a hipótese de normalidade")

# 4. Teste de estacionariedade dos resíduos
adf_test = adfuller(residuos.dropna())
print("\nTeste ADF para Estacionariedade:")
print(f"Estatística ADF: {adf_test[0]:.4f}")
print(f"p-valor: {adf_test[1]:.4f}")
print(f"Valores críticos: {adf_test[4]}")
print("Interpretação: p-valor < 0.05 rejeita a hipótese de não-estacionariedade")

# 5. Teste KPSS (hipótese nula inversa ao ADF)
kpss_test = kpss(residuos.dropna())
print("\nTeste KPSS para Estacionariedade:")
print(f"Estatística KPSS: {kpss_test[0]:.4f}")
print(f"p-valor: {kpss_test[1]:.4f}")
print(f"Valores críticos: {kpss_test[3]}")
print("Interpretação: p-valor < 0.05 rejeita a hipótese de estacionariedade")

# 6. Teste para efeitos ARCH (heterocedasticidade condicional)
arch_test = het_arch(residuos.dropna(), nlags=12)
print("\nTeste ARCH-LM para heterocedasticidade:")
print(f"Estatística: {arch_test[0]:.4f}")
print(f"p-valor: {arch_test[1]:.4f}")
print("Interpretação: p-valor < 0.05 indica presença de efeitos ARCH")

# 7. Análise de quebras estruturais
from statsmodels.stats.diagnostic import breaks_cusumolsresid

# Regressão OLS nos resíduos (apenas para usar o teste CUSUM)
X = np.arange(len(residuos))
X = sm.add_constant(X)
modelo_ols = sm.OLS(residuos, X).fit()

# Teste CUSUM
plt.figure(figsize=(12, 6))
fig = breaks_cusumolsresid(modelo_ols)
plt.title('Teste CUSUM para Estabilidade dos Resíduos')
plt.show()

# 8. Análise do intervalo de previsão
# Simular algumas previsões e verificar cobertura
n_forecast = 12
forecasts = resultado.get_forecast(n_forecast)
pred_mean = forecasts.predicted_mean
pred_ci = forecasts.conf_int(alpha=0.05)  # 95% de intervalo de confiança

# Supondo que temos dados reais para este período
dados_reais = serie[-n_forecast:]

# Verificar quantos pontos caem dentro do intervalo
dentro_intervalo = ((dados_reais >= pred_ci.iloc[:, 0]) & 
                    (dados_reais <= pred_ci.iloc[:, 1])).sum()
cobertura = dentro_intervalo / n_forecast * 100

print(f"\nCobertura do Intervalo de Confiança de 95%: {cobertura:.1f}%")
print(f"Esperado: 95%, Obtido: {cobertura:.1f}%")

# Visualizar previsão vs. realidade
plt.figure(figsize=(12, 6))
plt.plot(dados_reais.index, dados_reais, 'b-', label='Valores Reais')
plt.plot(pred_mean.index, pred_mean, 'r-', label='Previsão')
plt.fill_between(pred_ci.index, 
                 pred_ci.iloc[:, 0], 
                 pred_ci.iloc[:, 1], 
                 color='pink', alpha=0.3,
                 label='Intervalo de Confiança 95%')
plt.legend()
plt.title('Previsão vs. Valores Reais com Intervalo de Confiança')
plt.grid(True)
plt.show()

# 9. Resumo geral dos diagnósticos
print("\n===== RESUMO DOS DIAGNÓSTICOS =====")
diagnosticos = {
    "Autocorrelação": "Presente" if any(lb_result['lb_pvalue'] < 0.05) else "Ausente",
    "Normalidade": "Não-normal" if shapiro_test[1] < 0.05 else "Normal",
    "Estacionariedade": "Estacionário" if adf_test[1] < 0.05 else "Não-estacionário",
    "Heterocedasticidade": "Presente" if arch_test[1] < 0.05 else "Ausente",
    "Cobertura do IC": f"{cobertura:.1f}% (ideal: 95%)"
}

for diag, resultado in diagnosticos.items():
    print(f"{diag}: {resultado}")

# 10. Recomendações baseadas nos diagnósticos
print("\nRECOMENDAÇÕES:")
if any(lb_result['lb_pvalue'] < 0.05):
    print("- Considere aumentar a ordem AR/MA do modelo para capturar autocorrelação restante")
    
if shapiro_test[1] < 0.05:
    print("- Os resíduos não são normais. Considere transformações ou modelos que lidem com distribuições não-normais")
    
if adf_test[1] >= 0.05:
    print("- Os resíduos não parecem estacionários. Revise a ordem de diferenciação do modelo")
    
if arch_test[1] < 0.05:
    print("- Há evidência de heterocedasticidade. Considere modelos da família GARCH")
    
if abs(cobertura - 95) > 10:
    print("- O intervalo de confiança não está bem calibrado. Revise pressupostos do modelo")`
  };

  // Checklist para avaliação de modelos de séries temporais
  const checklistItems = [
    'Utilize validação cronológica adequada, preservando a ordem temporal dos dados',
    'Verifique e trate a estacionariedade dos dados antes da modelagem',
    'Examine a autocorrelação dos resíduos para garantir que o modelo capturou todos os padrões temporais',
    'Teste múltiplos horizontes de previsão para entender a degradação da performance',
    'Considere a sazonalidade e certifique-se que está adequadamente modelada',
    'Avalie a calibração dos intervalos de previsão, não apenas as previsões pontuais',
    'Teste o modelo em diferentes segmentos temporais para verificar estabilidade',
    'Compare com benchmarks simples (média, último valor, sazonalidade ingênua) para contextualizar resultados',
    'Para modelos probabilísticos, avalie a qualidade da distribuição de previsão completa',
    'Quando relevante, considere o impacto de eventos especiais e outliers na avaliação'
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
      {/* Métodos de validação para séries temporais */}
      <ExpandableSection
        title="Métodos de Validação para Séries Temporais"
        isExpanded={expandedSections.validationMethods}
        onToggle={() => toggleSection('validationMethods')}
      >
        <div className="space-y-6">
          {validationMethods.map(method => (
            <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-3">
                <h5 className="text-lg font-semibold text-blue-800 mb-1">{method.name}</h5>
                <p className="text-gray-700">{method.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Características Principais</h6>
                  <ul className="space-y-1">
                    {method.details.map((detail, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="p-3 bg-green-50 rounded mb-3">
                    <h6 className="font-medium text-gray-800 mb-2">Quando Usar</h6>
                    <ul className="space-y-1">
                      {method.when.map((item, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <CheckCircle size={14} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded">
                    <h6 className="font-medium text-gray-800 mb-2">Limitações</h6>
                    <ul className="space-y-1">
                      {method.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-yellow-500 mr-2 mt-1">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>
      
      {/* Testes de diagnóstico para séries temporais */}
      <ExpandableSection
        title="Testes de Diagnóstico para Séries Temporais"
        isExpanded={expandedSections.diagnostics}
        onToggle={() => toggleSection('diagnostics')}
      >
        <div className="space-y-6">
          {diagnosticTests.map(test => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-3">
                <h5 className="text-lg font-semibold text-blue-800 mb-1">{test.name}</h5>
                <p className="text-gray-700">{test.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Implementação</h6>
                  <ul className="space-y-1">
                    {test.implementation.map((step, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">{index+1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Interpretação</h6>
                  <ul className="space-y-1">
                    {test.interpretation.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-blue-600 mr-2 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>
      
      {/* Exemplos práticos de código */}
      <ExpandableSection
        title="Exemplos de Implementação"
        isExpanded={expandedSections.codeExamples}
        onToggle={() => toggleSection('codeExamples')}
      >
        <div>
          <h5 className="font-medium text-gray-800 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Validação com Origem Móvel (Rolling Origin)
          </h5>
          <CodeBlock code={codeSnippets.validation} language="python" />

          
          <h5 className="font-medium text-gray-800 mt-6 mb-3 flex items-center">
            <Code className="h-5 w-5 text-blue-600 mr-2" />
            Testes de Diagnóstico Completos
          </h5>
          <CodeBlock code={codeSnippets.diagnostics} language="python" />
        </div>
      </ExpandableSection>
      
      {/* Checklist de Avaliação para Modelos de Séries Temporais */}
      <ExpandableSection
        title="Checklist de Avaliação para Modelos de Séries Temporais"
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
                A validação de modelos de séries temporais tem particularidades fundamentais 
                diferentes dos modelos de aprendizado supervisionado tradicionais. A preservação 
                da ordem temporal é crucial, e métodos como validação cruzada aleatória são 
                geralmente inadequados. Sempre considere o contexto específico da aplicação e 
                a estrutura temporal dos dados ao escolher o método de validação.
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default TestsDetails;