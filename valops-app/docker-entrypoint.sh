#!/bin/sh

# Substitui variáveis de ambiente nos arquivos JavaScript
echo "Configurando ambiente frontend..."

# Encontra os arquivos JavaScript no diretório de build
js_files=$(find /usr/share/nginx/html -type f -name "*.js" | sort)

# Substitui todas as ocorrências da variável de ambiente
for file in $js_files; do
  echo "Processando: $file"
  
  # Substitui a variável de API_URL se existir
  if [ ! -z "$VITE_API_URL" ]; then
    sed -i "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL}|g" $file
  fi
  
  # Aqui você pode adicionar mais substituições se necessário
done

echo "Configuração concluída!"

# Inicia o Nginx
exec "$@"
