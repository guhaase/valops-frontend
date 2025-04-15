# ValOps Frontend

Frontend da aplicação ValOps para gerenciamento de validação de modelos e treinamentos.

## Tecnologias

- React
- Vite
- Tailwind CSS
- Nginx (para servir em produção)
- Docker & Docker Compose

## Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
cd valops-app
npm install
```

### Executar em Desenvolvimento

```bash
cd valops-app
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Implantação com Docker

### Usando Docker Compose

1. Configure as variáveis de ambiente necessárias:

```bash
# .env na raiz do projeto
API_BASE_URL=http://backend-url:8000
DOCKER_USERNAME=seu-usuario-docker-hub
```

2. Execute o Docker Compose:

```bash
docker-compose up -d
```

Isso irá:
- Construir a imagem do frontend
- Configurar o reverse proxy para o backend
- Iniciar todos os serviços necessários

O aplicativo estará disponível em `http://localhost:80`

### Configuração de CI/CD

A implantação contínua está configurada através do GitHub Actions:

1. Configurar os seguintes secrets no GitHub:
   - `DOCKER_USERNAME`: Seu usuário do Docker Hub
   - `DOCKER_PASSWORD`: Sua senha do Docker Hub
   - `API_BASE_URL`: URL da API backend
   - `PROD_HOST`: Host do servidor de produção
   - `PROD_USERNAME`: Nome de usuário para SSH
   - `PROD_SSH_KEY`: Chave SSH privada para acesso ao servidor

2. Cada push para a branch `main` irá:
   - Executar testes
   - Construir a imagem Docker
   - Publicar a imagem no Docker Hub
   - Implantar no servidor de produção

## Estrutura de Arquivos

- `/src` - Código-fonte da aplicação React
- `/public` - Arquivos estáticos públicos
- `/nginx` - Configuração do servidor Nginx para produção
- `/proxy` - Configuração do proxy reverso para comunicação com o backend

## Conectando com o Backend

Por padrão, o aplicativo se conecta ao backend através da URL definida na variável de ambiente `VITE_API_BASE_URL`. Esta variável é injetada durante o build do Docker.