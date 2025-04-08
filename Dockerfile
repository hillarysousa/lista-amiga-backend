FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN mkdir -p dist && chown -R node:node /app

USER node

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:dev"]
