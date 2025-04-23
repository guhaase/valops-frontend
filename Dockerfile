FROM node:18-alpine as build

WORKDIR /app

# Instalar dependências
COPY valops-app/package*.json ./
RUN npm ci

# Copiar código-fonte
COPY valops-app/ ./

# Definir variáveis de ambiente
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Construir a aplicação
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar arquivos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração Nginx
COPY valops-app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]