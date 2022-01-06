FROM node:12.13-alpine

ENV APP_PORT=3333

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3333/tcp

CMD ["node", "dist/main"]
