# Usar uma versão específica do Node.js
FROM node:18.19.0-alpine3.18

# Configurar o ambiente
ENV NODE_ENV=production
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências com retry e ferramentas de build para bcrypt
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm install \
    && npm rebuild bcrypt --build-from-source \
    && apk del .build-deps

# Copiar o código da aplicação
COPY . .

# Expor a porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]