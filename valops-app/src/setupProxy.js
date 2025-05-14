const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get API URL from environment variables or use default
  const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  // Handle CORS preflight OPTIONS requests directly
  app.use('/api', (req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Employee-MTRC');
      res.header('Access-Control-Max-Age', '3600');
      res.status(200).send();
      return;
    }
    next();
  });

  // Configuração do proxy para o servidor do backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_URL,
      changeOrigin: true,
      // Removida a linha pathRewrite para preservar o caminho '/api' na solicitação
      onProxyRes: (proxyRes, req, res) => {
        // Ensure CORS headers are present in the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Employee-MTRC';
      },
    })
  );
};