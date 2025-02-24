# Usar uma versão específica do Node.js
FROM node:18.19.0-alpine3.18

# Configurar o ambiente
ENV NODE_ENV=production
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências com retry
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000 && \
    npm install && \
    apk del .build-deps

# Copiar o código da aplicação
COPY . .

# Expor a porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]