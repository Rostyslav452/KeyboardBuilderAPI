FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM node:22-alpine AS production

WORKDIR /app

ENV PORT=3000

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --chown=node:node .sequelizerc ./
COPY --chown=node:node database ./database
COPY --chown=node:node --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
