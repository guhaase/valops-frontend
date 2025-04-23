# Estágio de build - Compila o aplicativo React
FROM node:18-alpine as build

WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --silent

# Copiar o código fonte da aplicação
COPY . .

# Configuração das variáveis de ambiente para a aplicação
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

# Build da aplicação para produção
RUN npm run build

# Estágio de produção - Servidor web leve para servir o conteúdo estático
FROM nginx:stable-alpine

# Copiar configuração personalizada do Nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos de build do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Script para substituir variáveis de ambiente em runtime
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Expor porta 80
EXPOSE 80

# Usar script de entrada para substituir variáveis de ambiente
ENTRYPOINT ["/docker-entrypoint.sh"]

# Iniciar o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]