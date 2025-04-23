import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Code, Check, X, HelpCircle, Copy } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        title="Copy code"
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
  // State to control which models are expanded
  const [expandedModels, setExpandedModels] = useState({});

  // Function to toggle model expansion
  const toggleModel = (modelId) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  // Time series model data
  const models = [
    {
      id: 'arima',
      name: 'ARIMA (AutoRegressive Integrated Moving Average)',
      description: 'Statistical model that combines autoregression (AR), differencing for stationarity (I), and moving averages (MA) to analyze and forecast time series.',
      strengths: [
        'Good interpretability of parameters',
        'Captures various temporal dependency structures',
        'Solid and well-established theoretical foundation',
        'Provides confidence intervals for forecasts',
        'Effective for series with linear patterns'
      ],
      weaknesses: [
        'Requires stationarity (after differencing)',
        'Difficulty with complex non-linear series',
        'Parameter selection can be labor-intensive',
        'Limited performance for long horizons',
        'Does not handle multiple seasonalities well'
      ],
      useCases: [
        'Demand forecasting for inventory planning',
        'Financial indicator analysis',
        'Energy consumption forecasting',
        'Business metrics analysis (KPIs)',
        'Operational metrics monitoring'
      ],
      hyperparameters: [
        { name: 'p', description: 'Order of autoregressive component (AR)' },
        { name: 'd', description: 'Degree of differencing to make the series stationary (I)' },
        { name: 'q', description: 'Order of moving average component (MA)' },
        { name: 'P, D, Q, m', description: 'Parameters for seasonal component (SARIMA)' },
        { name: 'exog', description: 'Exogenous variables (external regressors) for ARIMAX' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from pmdarima import auto_arima
import warnings
warnings.filterwarnings("ignore")

# Load and prepare data
df = pd.read_csv('time_series_data.csv', parse_dates=['date'], index_col='date')
series = df['value']  # Column with time series

# Check stationarity (optional)
from statsmodels.tsa.stattools import adfuller
result = adfuller(series.dropna())
print(f'ADF Statistic: {result[0]}')
print(f'p-value: {result[1]}')

# Automatic parameter identification
auto_model = auto_arima(series, 
                        seasonal=True, 
                        m=12,  # Seasonal period (12 for monthly data)
                        d=None,  # Automatically determine differencing order
                        trace=True,
                        error_action='ignore',
                        suppress_warnings=True,
                        stepwise=True)

print(auto_model.summary())

# Manual adjustment of optimal parameters found
model = SARIMAX(series, 
                order=(1, 1, 1),  # (p, d, q) - Regular parameters
                seasonal_order=(1, 1, 1, 12),  # (P, D, Q, m) - Seasonal parameters
                enforce_stationarity=False,
                enforce_invertibility=False)

result = model.fit()
print(result.summary())

# Make predictions for the next 12 periods
forecast = result.get_forecast(steps=12)
forecast_interval = forecast.conf_int()

# Plot results
plt.figure(figsize=(12, 6))
plt.plot(series, label='Observed')
plt.plot(forecast.predicted_mean, label='Forecast')
plt.fill_between(forecast_interval.index,
                 forecast_interval.iloc[:, 0],
                 forecast_interval.iloc[:, 1], color='k', alpha=0.2)
plt.legend()
plt.title('SARIMA Forecast')
plt.show()

# Residual diagnostics
residuals = result.resid
plt.figure(figsize=(12, 8))
plt.subplot(211)
plt.plot(residuals)
plt.title('Model residuals')
plt.subplot(212)
plot_acf(residuals, ax=plt.gca(), lags=40)
plt.tight_layout()
plt.show()`
    },
    {
      id: 'exponential-smoothing',
      name: 'Exponential Smoothing',
      description: 'Family of methods that produce forecasts by weighting past observations, with weights that decay exponentially. Includes Simple Exponential Smoothing (SES), Holt, and Holt-Winters models.',
      strengths: [
        'Intuitive and easy to implement',
        'Effective for series with trend and seasonality',
        'Good performance for short-term forecasts',
        'Requires less historical data than ARIMA',
        'Robust to small irregularities in the data'
      ],
      weaknesses: [
        'Less flexible than ARIMA for certain patterns',
        'Difficulty with highly irregular series',
        'Does not easily incorporate exogenous variables',
        'Can be sensitive to the choice of initial values',
        'Does not provide causal analysis between variables'
      ],
      useCases: [
        'Seasonal sales forecasting in retail',
        'Demand planning in logistics',
        'Web traffic metrics forecasting',
        'IT resource utilization forecasting',
        'Consumer trend analysis'
      ],
      hyperparameters: [
        { name: 'alpha', description: 'Smoothing parameter for level (0-1)' },
        { name: 'beta', description: 'Smoothing parameter for trend (0-1)' },
        { name: 'gamma', description: 'Smoothing parameter for seasonality (0-1)' },
        { name: 'trend', description: 'Trend type (None, additive, multiplicative)' },
        { name: 'seasonal', description: 'Seasonality type (None, additive, multiplicative)' },
        { name: 'seasonal_periods', description: 'Number of periods in a seasonal cycle' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Load and prepare data
df = pd.read_csv('sales_data.csv', parse_dates=['date'], index_col='date')
series = df['sales']

# Split into train and test (80/20)
train_size = int(len(series) * 0.8)
train, test = series[:train_size], series[train_size:]

# 1. Simple Exponential Smoothing (for series without trend or seasonality)
ses_model = SimpleExpSmoothing(train).fit(smoothing_level=0.6, optimized=False)
ses_forecast = ses_model.forecast(len(test))

# 2. Holt's Method (for series with trend)
holt_model = ExponentialSmoothing(train, trend='add', seasonal=None).fit(
    smoothing_level=0.8, 
    smoothing_trend=0.2, 
    optimized=False
)
holt_forecast = holt_model.forecast(len(test))

# 3. Holt-Winters Method (for series with trend and seasonality)
# Assuming monthly frequency with annual seasonality (12 months)
hw_model = ExponentialSmoothing(
    train,
    trend='add',             # Additive trend
    seasonal='mul',          # Multiplicative seasonality
    seasonal_periods=12      # Seasonal period of 12 months
).fit(
    smoothing_level=0.6,    
    smoothing_trend=0.2,
    smoothing_seasonal=0.6,
    optimized=False
)
hw_forecast = hw_model.forecast(len(test))

# 4. Fit with parameter optimization
optimal_model = ExponentialSmoothing(
    train,
    trend='add',
    seasonal='mul',
    seasonal_periods=12
).fit(optimized=True)  # Automatically adjust the best parameters
optimal_forecast = optimal_model.forecast(len(test))
print(f"Optimized parameters: alpha={optimal_model.params['smoothing_level']:.4f}, "
      f"beta={optimal_model.params['smoothing_trend']:.4f}, "
      f"gamma={optimal_model.params['smoothing_seasonal']:.4f}")

# Model evaluation
methods = ['SES', 'Holt', 'Holt-Winters', 'HW Optimized']
forecasts = [ses_forecast, holt_forecast, hw_forecast, optimal_forecast]
results = pd.DataFrame(index=methods, columns=['MAE', 'RMSE'])

for i, method in enumerate(methods):
    mae = mean_absolute_error(test, forecasts[i])
    rmse = np.sqrt(mean_squared_error(test, forecasts[i]))
    results.loc[method] = [mae, rmse]

print(results)

# Visualize results
plt.figure(figsize=(12, 6))
plt.plot(train.index, train, label='Train')
plt.plot(test.index, test, label='Test')
plt.plot(test.index, optimal_forecast, label='Forecast (Optimized Holt-Winters)')
plt.legend()
plt.title('Forecast with Exponential Smoothing (Holt-Winters)')
plt.show()

# Future forecast (next 12 periods)
final_model = ExponentialSmoothing(
    series,  # Using the complete series for the final model
    trend='add',
    seasonal='mul',
    seasonal_periods=12
).fit(optimized=True)

future = final_model.forecast(12)  # 12 periods ahead
plt.figure(figsize=(12, 6))
plt.plot(series.index, series, label='Historical')
plt.plot(future.index, future, label='Forecast')
plt.legend()
plt.title('Future Forecast with Holt-Winters')
plt.show()`
    },
    {
      id: 'prophet',
      name: 'Prophet',
      description: 'Time series forecasting model developed by Facebook, designed to handle multiple seasonalities, holidays, and automatically detect trend changes.',
      strengths: [
        'Handles multiple seasonalities well (daily, weekly, annual)',
        'Robust to missing data and outliers',
        'Incorporates holiday and special event effects',
        'Automatically detects trend changes',
        'Easy to use and requires little manual configuration'
      ],
      weaknesses: [
        'Less flexibility than pure statistical models for certain patterns',
        'May be less effective for very short series',
        'Not designed to capture interactions between external variables',
        'Specialized implementation (not available in all libraries)',
        'Can be computationally intensive for very long series'
      ],
      useCases: [
        'Business demand forecasting (affected by multiple seasonalities)',
        'Social media metrics and web traffic forecasting',
        'Trend analysis with holiday effects',
        'Retail sales forecasting with seasonal events',
        'Capacity planning in services'
      ],
      hyperparameters: [
        { name: 'changepoint_prior_scale', description: 'Flexibility for trend changes' },
        { name: 'seasonality_prior_scale', description: 'Strength of seasonal components' },
        { name: 'holidays_prior_scale', description: 'Strength of holiday effects' },
        { name: 'seasonality_mode', description: 'Seasonality type (additive, multiplicative)' },
        { name: 'changepoint_range', description: 'Proportion of initial data to look for trend changes' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric

# Load data
df = pd.read_csv('sales_data.csv')

# Prophet requires specific columns: 'ds' (date) and 'y' (value)
df_prophet = df.rename(columns={'date': 'ds', 'sales': 'y'})

# Create and train basic model
model = Prophet(
    changepoint_prior_scale=0.05,    # Flexibility for trend changes
    seasonality_prior_scale=10,      # Strength of seasonal component
    seasonality_mode='multiplicative' # Seasonality type
)

# Add custom seasonality (if needed)
model.add_seasonality(
    name='monthly',
    period=30.5,
    fourier_order=5
)

# Add holidays (optional)
holidays = pd.DataFrame({
  'holiday': 'black_friday',
  'ds': pd.to_datetime(['2022-11-25', '2023-11-24']),
  'lower_window': 0,
  'upper_window': 1,
})
model.add_country_holidays(country_name='US')  # Add US holidays
model.add_holidays(holidays)                  # Add custom holidays

# Add external regressors (if available)
if 'temperature' in df.columns:
    df_prophet['temperature'] = df['temperature']
    model.add_regressor('temperature')

# Train the model
model.fit(df_prophet)

# Create dataframe for future forecasting
future = model.make_future_dataframe(periods=90)  # 90 days in the future

# If using regressors, we need to provide values for the future period
if 'temperature' in df_prophet.columns:
    # Create future values for the regressor (example)
    future_temp = [0] * 90  # Future temperature values (simple example)
    future['temperature'] = np.concatenate([df_prophet['temperature'].values, future_temp])

# Make predictions
forecast = model.predict(future)

# Visualize results
fig1 = model.plot(forecast)
plt.title('Prophet Forecast')
plt.ylabel('Sales')
plt.xlabel('Date')
plt.show()

# Visualize components
fig2 = model.plot_components(forecast)
plt.show()

# Cross-validation (optional)
df_cv = cross_validation(model, initial='365 days', period='30 days', horizon='90 days')
df_p = performance_metrics(df_cv)
print(df_p.head())

# Visualize error metrics by forecast horizon
fig3 = plot_cross_validation_metric(df_cv, metric='mape')
plt.show()`
    },
    {
      id: 'lstm',
      name: 'LSTM (Long Short-Term Memory)',
      description: 'Type of recurrent neural network capable of learning long-term dependencies in sequential data, effective for modeling complex and non-linear time series.',
      strengths: [
        'Captures complex non-linear relationships',
        'Memorizes long and short-term dependencies',
        'No assumptions about stationarity required',
        'Can process multiple variables without specific transformations',
        'Scalable for large volumes of data'
      ],
      weaknesses: [
        'Requires large volumes of data for effective training',
        'Computationally intensive (time and resources)',
        'Difficult interpretability (black box model)',
        'Hyperparameter tuning can be challenging',
        'Risk of overfitting in small series'
      ],
      useCases: [
        'Complex financial series forecasting',
        'Industrial sensor data analysis',
        'Demand forecasting with multiple factors',
        'Modeling series with non-linear patterns',
        'Forecasting with multiple correlated variables'
      ],
      hyperparameters: [
        { name: 'units', description: 'Number of LSTM neurons in each layer' },
        { name: 'layers', description: 'Number of stacked LSTM layers' },
        { name: 'dropout', description: 'Dropout rate for regularization' },
        { name: 'sequence_length', description: 'Length of input sequences (lookback)' },
        { name: 'batch_size', description: 'Batch size for training' },
        { name: 'epochs', description: 'Number of training epochs' }
      ],
      code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# Load data
df = pd.read_csv('time_series.csv', parse_dates=['date'], index_col='date')
data = df['value'].values.reshape(-1, 1)

# Normalize data (important for neural networks)
scaler = MinMaxScaler(feature_range=(0, 1))
data_scaled = scaler.fit_transform(data)

# Function to create input (X) and output (y) sequences
def create_dataset(dataset, look_back=60):
    X, y = [], []
    for i in range(len(dataset) - look_back):
        X.append(dataset[i:(i + look_back), 0])
        y.append(dataset[i + look_back, 0])
    return np.array(X), np.array(y)

# Set parameters
look_back = 60  # Use 60 past observations to predict the next one
X, y = create_dataset(data_scaled, look_back)

# Reshape to the format expected by LSTM [samples, time steps, features]
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# Split into train and test sets (80/20)
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Build the LSTM model
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(look_back, 1)))
model.add(Dropout(0.2))
model.add(LSTM(units=50))
model.add(Dropout(0.2))
model.add(Dense(units=1))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Early stopping callback
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Train the model
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1
)

# Make predictions
y_pred = model.predict(X_test)

# Invert normalization to get actual values
y_test_inv = scaler.inverse_transform(y_test.reshape(-1, 1))
y_pred_inv = scaler.inverse_transform(y_pred)

# Calculate error metrics
rmse = np.sqrt(mean_squared_error(y_test_inv, y_pred_inv))
print(f'RMSE: {rmse}')

# Visualize results
plt.figure(figsize=(12, 6))
plt.plot(y_test_inv, label='Actual')
plt.plot(y_pred_inv, label='Prediction')
plt.legend()
plt.title('LSTM Prediction vs. Actual Values')
plt.show()

# Visualize training history
plt.figure(figsize=(12, 6))
plt.plot(history.history['loss'], label='Training Error')
plt.plot(history.history['val_loss'], label='Validation Error')
plt.legend()
plt.title('Training History - LSTM')
plt.show()

# Function to forecast future periods
def forecast_future(model, current_data, scaler, periods=30):
    future = []
    batch = current_data[-look_back:].reshape((1, look_back, 1))

    for i in range(periods):
        # Predict next value
        next_val = model.predict(batch)[0]
        # Add to list
        future.append(next_val)
        # Update batch for next prediction (remove first, add prediction)
        batch = np.append(batch[:, 1:, :], [[next_val]], axis=1)

    # Convert to array and invert normalization
    future_array = np.array(future).reshape(-1, 1)
    future_inv = scaler.inverse_transform(future_array)

    return future_inv

# Forecast 30 periods ahead
future_forecast = forecast_future(model, data_scaled, scaler, 30)

# Create index for future forecasts
last_day = df.index[-1]
future_index = pd.date_range(start=last_day + pd.Timedelta(days=1), periods=30, freq='D')

# Visualize future forecast
plt.figure(figsize=(12, 6))
plt.plot(df.index[-90:], df['value'].values[-90:], label='Recent History')
plt.plot(future_index, future_forecast, label='Future Forecast', color='red')
plt.title('Future Forecast with LSTM')
plt.legend()
plt.show()`
    },
    {
      id: 'var',
      name: 'VAR (Vector Autoregression)',
      description: 'Statistical model that captures linear relationships between multiple time series, allowing analysis of how they influence each other over time.',
      strengths: [
        'Models relationships between multiple variables simultaneously',
        'Captures feedback effects between variables',
        'Allows causality analysis (Granger causality)',
        'Useful for impulse-response analysis',
        'Solid statistical foundation and interpretable'
      ],
      weaknesses: [
        'Assumes multivariate stationarity',
        'Sensitive to the number of lags selected',
        'Suffers from curse of dimensionality for many variables',
        'Limited to linear relationships between variables',
        'Computationally intensive for large systems'
      ],
      useCases: [
        'Macroeconomic analysis (relationships between GDP, inflation, unemployment)',
        'Interconnected financial markets analysis',
        'Interdependence study in industrial systems',
        'Modeling relationships between business metrics',
        'Forecasting multiple related variables'
      ],
      hyperparameters: [
        { name: 'lags', description: 'Number of lags to include in the model' },
        { name: 'deterministic', description: 'Deterministic components (constant, trend)' },
        { name: 'seasons', description: 'Number of seasonal periods' },
        { name: 'freq', description: 'Data frequency (D, M, Q, A)' },
        { name: 'missing', description: 'How to handle missing values' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller, grangercausalitytests
from statsmodels.tsa.vector_ar.vecm import coint_johansen
import seaborn as sns

# Load multivariate data
df = pd.read_csv('macro_data.csv', parse_dates=['date'], index_col='date')
print(df.head())

# Check stationarity for each series
for column in df.columns:
    result = adfuller(df[column].dropna())
    print(f'ADF Statistic for {column}: {result[0]}')
    print(f'p-value: {result[1]}')
    print('--------------------------------------')

# Difference non-stationary series (if needed)
df_diff = df.diff().dropna()

# Visualize correlations
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title('Correlations between Variables')
plt.tight_layout()
plt.show()

# Test for Granger causality
max_lag = 8
for i in range(len(df.columns)):
    for j in range(len(df.columns)):
        if i != j:
            test_result = grangercausalitytests(
                df[[df.columns[j], df.columns[i]]], 
                max_lag, 
                verbose=False
            )
            p_values = [round(test_result[i+1][0]['ssr_chi2test'][1], 4) for i in range(max_lag)]
            min_p_value = min(p_values)
            min_p_index = p_values.index(min_p_value) + 1
            
            if min_p_value < 0.05:
                print(f"{df.columns[i]} causes (Granger) {df.columns[j]} with lag {min_p_index} (p-value: {min_p_value})")

# Select optimal number of lags
var_model = VAR(df_diff)
results = {}
for i in range(1, 11):
    result = var_model.fit(i)
    results[i] = {
        'aic': result.aic,
        'bic': result.bic,
        'hqic': result.hqic
    }

# Convert to DataFrame for visualization
lag_selection = pd.DataFrame(results).T
print("Lag Selection:")
print(lag_selection)

# Fit the model with the optimal lag
optimal_lag = lag_selection['aic'].idxmin()  # Using AIC to select
print(f"Optimal lag by AIC: {optimal_lag}")

# Fit the VAR model
final_model = var_model.fit(optimal_lag)
print(final_model.summary())

# Impulse response analysis
irf = final_model.irf(10)  # 10 periods horizon
irf.plot(orth=False, response=df.columns[0])  # Response of the first variable
plt.show()

# Forecast future periods
forecast = final_model.forecast(df_diff.values[-optimal_lag:], 12)  # 12 periods ahead

# Convert forecasts to DataFrame
forecast_df = pd.DataFrame(forecast, index=pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=12, freq='M'), columns=df.columns)

# Revert differencing to obtain level values (first difference)
last_value = df.iloc[-1]
forecast_level = pd.DataFrame(index=forecast_df.index)

for column in df.columns:
    forecast_level[column] = [last_value[column]]
    for i in range(len(forecast_df)):
        forecast_level.iloc[i, forecast_level.columns.get_loc(column)] = forecast_level.iloc[i-1 if i > 0 else 0, forecast_level.columns.get_loc(column)] + forecast_df.iloc[i, forecast_df.columns.get_loc(column)]

# Visualize forecasts
for i, column in enumerate(df.columns):
    plt.figure(figsize=(12, 6))
    plt.plot(df.index[-24:], df[column].values[-24:], label='Historical')
    plt.plot(forecast_level.index, forecast_level[column], label='Forecast')
    plt.title(f'VAR Forecast for {column}')
    plt.legend()
    plt.grid(True)
    plt.show()

# Variance decomposition
fevd = final_model.fevd(12)  # 12 periods
fevd.plot()
plt.show()`
    },
    {
      id: 'xgboost',
      name: 'XGBoost for Time Series',
      description: 'Adaptation of the XGBoost gradient boosting algorithm for time series problems, using time windows or derived features to capture temporal dependencies.',
      strengths: [
        'Captures complex non-linear relationships',
        'Robust to outliers and noisy data',
        'Easily incorporates exogenous variables',
        'Works well with medium-sized datasets',
        'Adaptable to various types of temporal patterns'
      ],
      weaknesses: [
        'Requires explicit temporal feature engineering',
        'Does not naturally capture sequential dependency',
        'More difficult to interpret than classic statistical models',
        'Hyperparameters can be sensitive and difficult to optimize',
        'Risk of overfitting in small series without proper regularization'
      ],
      useCases: [
        'Demand forecasting with multiple external factors',
        'Anomaly detection in time series',
        'Indicator forecasting with explanatory variables',
        'Forecasting competitions (won many Kaggle competitions)',
        'Scenarios with incomplete or irregular data'
      ],
      hyperparameters: [
        { name: 'n_estimators', description: 'Number of trees in the ensemble' },
        { name: 'learning_rate', description: 'Learning rate for shrinkage' },
        { name: 'max_depth', description: 'Maximum depth of trees' },
        { name: 'subsample', description: 'Fraction of samples to train trees' },
        { name: 'colsample_bytree', description: 'Fraction of features for each tree' },
        { name: 'gamma', description: 'Regularization parameter for node splitting' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV

# Load data
df = pd.read_csv('series_data.csv', parse_dates=['date'], index_col='date')

# Function to create temporal features
def create_temporal_features(df):
    df = df.copy()
    # Date/time characteristics
    df['month'] = df.index.month
    df['day_of_month'] = df.index.day
    df['day_of_week'] = df.index.dayofweek
    df['week_of_year'] = df.index.isocalendar().week
    df['quarter'] = df.index.quarter
    df['year'] = df.index.year

    # Seasonal indicators
    df['month_sin'] = np.sin(2 * np.pi * df.index.month / 12)
    df['month_cos'] = np.cos(2 * np.pi * df.index.month / 12)
    df['day_sin'] = np.sin(2 * np.pi * df.index.day / 30)
    df['day_cos'] = np.cos(2 * np.pi * df.index.day / 30)

    # Lags (past values)
    for lag in [1, 7, 14, 28]:
        df[f'lag_{lag}'] = df['value'].shift(lag)

    # Moving averages
    for window in [7, 14, 30, 90]:
        df[f'moving_avg_{window}'] = df['value'].rolling(window=window).mean()

    # Moving standard deviation
    for window in [7, 14, 30]:
        df[f'moving_std_{window}'] = df['value'].rolling(window=window).std()

    # Trend
    df['trend'] = np.arange(len(df))

    return df

# Prepare dataset with temporal features
df_features = create_temporal_features(df)
df_features = df_features.dropna()  # Remove NaNs from lags

# Define features and target
features = [col for col in df_features.columns if col != 'value']
X = df_features[features]
y = df_features['value']

# Split into train and test sets temporally
split_date = df.index[-int(len(df)*0.2)]  # last 20% for testing
X_train = X[X.index < split_date]
X_test = X[X.index >= split_date]
y_train = y[y.index < split_date]
y_test = y[y.index >= split_date]

# Normalize features (optional, but often helps XGBoost)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Basic model
simple_model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

# Train
simple_model.fit(X_train, y_train)

# Predict
y_pred = simple_model.predict(X_test)

# Evaluate
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

print(f'MAE: {mae:.2f}')
print(f'RMSE: {rmse:.2f}')
print(f'MAPE: {mape:.2f}%')

# Visualize results
plt.figure(figsize=(12, 6))
plt.plot(y_test.index, y_test, label='Actual')
plt.plot(y_test.index, y_pred, label='Prediction')
plt.legend()
plt.title('XGBoost - Prediction vs. Actual')
plt.show()

# Hyperparameter optimization (optional)
tscv = TimeSeriesSplit(n_splits=5)
param_grid = {
    'n_estimators': [100, 200, 500],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 0.9, 1.0],
    'colsample_bytree': [0.8, 0.9, 1.0],
    'gamma': [0, 0.1, 0.5]
}

grid_search = GridSearchCV(
    estimator=XGBRegressor(random_state=42),
    param_grid=param_grid,
    cv=tscv,
    scoring='neg_root_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

grid_search.fit(X_train, y_train)
print(f"Best parameters: {grid_search.best_params_}")

# Optimized model
optimized_model = grid_search.best_estimator_
y_pred_optimized = optimized_model.predict(X_test)

# Evaluate optimized model
rmse_optimized = np.sqrt(mean_squared_error(y_test, y_pred_optimized))
print(f'Optimized RMSE: {rmse_optimized:.2f}')

# Feature importance
importance = optimized_model.feature_importances_
indices = np.argsort(importance)[::-1]

plt.figure(figsize=(12, 8))
plt.title('Feature Importance')
plt.bar(range(X_train.shape[1]), importance[indices])
plt.xticks(range(X_train.shape[1]), [features[i] for i in indices], rotation=90)
plt.tight_layout()
plt.show()

# Future forecasting
# We need to create features for future periods
# This is a simplified example for 30 days ahead
last_day = df.index[-1]
future_days = pd.date_range(start=last_day + pd.Timedelta(days=1), periods=30, freq='D')
df_future = pd.DataFrame(index=future_days)

# Create features for future days
df_future['month'] = df_future.index.month
df_future['day_of_month'] = df_future.index.day
df_future['day_of_week'] = df_future.index.dayofweek
df_future['week_of_year'] = df_future.index.isocalendar().week
df_future['quarter'] = df_future.index.quarter
df_future['year'] = df_future.index.year
df_future['month_sin'] = np.sin(2 * np.pi * df_future.index.month / 12)
df_future['month_cos'] = np.cos(2 * np.pi * df_future.index.month / 12)
df_future['day_sin'] = np.sin(2 * np.pi * df_future.index.day / 30)
df_future['day_cos'] = np.cos(2 * np.pi * df_future.index.day / 30)
df_future['trend'] = np.arange(len(df), len(df) + len(df_future))

# Fill lag and moving average columns (simplified example)
# In practice, predicted values would need to be added recursively
recent_values = df['value'].values[-90:]  # Last 90 values

for i, lag in enumerate([1, 7, 14, 28]):
    df_future[f'lag_{lag}'] = recent_values[-lag]

for i, window in enumerate([7, 14, 30, 90]):
    df_future[f'moving_avg_{window}'] = np.mean(recent_values[-window:])

for i, window in enumerate([7, 14, 30]):
    df_future[f'moving_std_{window}'] = np.std(recent_values[-window:])

# Normalize future features
X_future = df_future[features]
X_future_scaled = scaler.transform(X_future)

# Make prediction
future_forecast = optimized_model.predict(X_future)

# Visualize future forecast
plt.figure(figsize=(12, 6))
plt.plot(df.index[-90:], df['value'].values[-90:], label='Recent History')
plt.plot(future_days, future_forecast, label='Forecast', color='red')
plt.title('Future Forecast - XGBoost')
plt.legend()
plt.show()`
    },
    {
      id: 'garch',
      name: 'GARCH (Generalized Autoregressive Conditional Heteroskedasticity)',
      description: 'Model for analyzing and forecasting volatility in time series, especially useful for financial series where variance changes over time.',
      strengths: [
        'Explicitly models time-varying volatility',
        'Captures volatility clusters (turbulent periods)',
        'Useful for risk estimation and confidence intervals',
        'Solid theoretical foundation in finance',
        'Various extensions available for different volatility patterns'
      ],
      weaknesses: [
        'Focus on volatility, not level prediction',
        'Assumes specific distributions (usually normal)',
        'Sensitive to extreme outliers',
        'Model convergence can be problematic',
        'Complex interpretability for non-specialists'
      ],
      useCases: [
        'Volatility modeling in financial markets',
        'Portfolio risk management',
        'Value at Risk (VaR) calculation',
        'Derivatives and options pricing',
        'Uncertainty analysis in series with unstable variance'
      ],
      hyperparameters: [
        { name: 'p', description: 'Order of GARCH component (past volatility)' },
        { name: 'q', description: 'Order of ARCH component (past squared residuals)' },
        { name: 'dist', description: 'Error distribution (normal, t-student, etc.)' },
        { name: 'vol', description: 'Volatility model (constant, GARCH, EGARCH, etc.)' },
        { name: 'mean', description: 'Specification for conditional mean model' }
      ],
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import arch
from arch import arch_model
from arch.univariate import ConstantMean, GARCH, Normal
from scipy import stats

# Load financial data
df = pd.read_csv('financial_data.csv', parse_dates=['date'], index_col='date')
returns = df['price'].pct_change().dropna() * 100  # Convert to percentage

# Exploratory analysis of returns
plt.figure(figsize=(12, 8))

# Returns plot
plt.subplot(2, 2, 1)
plt.plot(returns)
plt.title('Daily Returns (%)')
plt.grid(True)

# Histogram
plt.subplot(2, 2, 2)
plt.hist(returns, bins=50, alpha=0.6, density=True)
x = np.linspace(returns.min(), returns.max(), 100)
plt.plot(x, stats.norm.pdf(x, returns.mean(), returns.std()))
plt.title('Returns Distribution')
plt.grid(True)

# ACF of returns
plt.subplot(2, 2, 3)
pd.plotting.autocorrelation_plot(returns)
plt.title('ACF - Returns')
plt.grid(True)

# ACF of absolute returns (proxy for volatility)
plt.subplot(2, 2, 4)
pd.plotting.autocorrelation_plot(returns.abs())
plt.title('ACF - |Returns| (Volatility)')
plt.grid(True)

plt.tight_layout()
plt.show()

# Check descriptive statistics
print("Descriptive Statistics of Returns:")
print(returns.describe())

# Normality test
_, p_value = stats.jarque_bera(returns)
print(f"Jarque-Bera Test p-value: {p_value}")
if p_value < 0.05:
    print("Returns do not follow normal distribution.")

# Test for ARCH effects (Heteroskedasticity)
from statsmodels.stats.diagnostic import het_arch
arch_test = het_arch(returns)
print(f"ARCH LM Test p-value: {arch_test[1]}")
if arch_test[1] < 0.05:
    print("ARCH effects detected - GARCH is appropriate.")

# Split into train and test
train_size = int(len(returns) * 0.8)
train, test = returns[:train_size], returns[train_size:]

# Fit GARCH(1,1) model with t-Student distribution
model = arch_model(
    train, 
    vol='Garch', 
    p=1, 
    q=1, 
    dist='studentst'
)
result = model.fit(disp='off')
print(result.summary())

# In-sample forecast
train_forecast = result.conditional_volatility

# Out-of-sample forecast
forecast = result.forecast(horizon=len(test))
forecast_vol = np.sqrt(forecast.variance.values[-1, :])

# Calculate VaR (Value at Risk) for 95% confidence
var_95 = stats.norm.ppf(0.05) * forecast_vol

# Plot results
plt.figure(figsize=(12, 8))

# Predicted volatility vs. actual returns
plt.subplot(2, 1, 1)
plt.plot(train.index[-100:], train.values[-100:], color='blue', label='Returns (Train)')
plt.plot(test.index, test.values, color='green', label='Returns (Test)')
plt.plot(train.index[-100:], train_forecast[-100:], color='red', alpha=0.7, label='Volatility (Train)')
plt.plot(test.index, forecast_vol, color='purple', alpha=0.7, label='Predicted Volatility')
plt.title('Returns and Volatility GARCH(1,1)')
plt.legend()
plt.grid(True)

# VaR
plt.subplot(2, 1, 2)
plt.plot(test.index, test.values, label='Actual Returns')
plt.fill_between(test.index, var_95, 0, alpha=0.3, color='red', label='VaR 95%')
plt.title('Value at Risk (VaR) 95% with GARCH')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

# Check VaR violations
violations = (test < var_95).sum()
violation_rate = violations / len(test) * 100
print(f"Number of VaR violations: {violations} ({violation_rate:.2f}%)")
print(f"Theoretical: 5%, Observed: {violation_rate:.2f}%")

# Fit alternative models
models = {
    'GARCH(1,1)': arch_model(train, vol='Garch', p=1, q=1, dist='normal'),
    'GARCH(1,1)-t': arch_model(train, vol='Garch', p=1, q=1, dist='studentst'),
    'EGARCH(1,1)': arch_model(train, vol='EGARCH', p=1, q=1, dist='normal'),
    'GJR-GARCH(1,1)': arch_model(train, vol='GARCH', p=1, o=1, q=1, dist='normal')
}

results = {}
aic_bic = pd.DataFrame(columns=['AIC', 'BIC'])

for name, model in models.items():
    print(f"Fitting {name}...")
    res = model.fit(disp='off')
    results[name] = res
    aic_bic.loc[name] = [res.aic, res.bic]

print("\nModel Comparison:")
print(aic_bic)

# Use best model for final forecast
best_model = results[aic_bic['AIC'].idxmin()]
final_forecast = best_model.forecast(horizon=20)  # 20 days ahead

# Plot future volatility forecast
plt.figure(figsize=(10, 6))
plt.plot(np.sqrt(final_forecast.variance.iloc[-1]))
plt.title(f"Volatility Forecast - {aic_bic['AIC'].idxmin()}")
plt.ylabel("Predicted Volatility (%)")
plt.xlabel("Horizon (Days)")
plt.grid(True)
plt.show()`
    }
  ];

  // Helper to show/hide attributes
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
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Main Time Series Models</h3>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p>
          This section presents the main algorithms and models used for time series problems,
          highlighting their characteristics, strengths and weaknesses, common applications,
          and key hyperparameters to be adjusted.
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
                    title="Strengths" 
                    items={model.strengths} 
                    color="green" 
                  />
                  <FeatureSection 
                    title="Weaknesses" 
                    items={model.weaknesses} 
                    color="red" 
                  />
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Common Use Cases</h5>
                  <div className="flex flex-wrap gap-2">
                    {model.useCases.map((useCase, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Main Hyperparameters</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Parameter</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Description</th>
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
                    Implementation Example
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
          Click on each model to see full details and implementation examples.
        </span>
      </div>
    </div>
  );
};

export default MainModels;