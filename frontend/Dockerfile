# React 애플리케이션 빌드
FROM node:16-alpine

WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install

COPY ./ /app

RUN npm run build

CMD ["npm", "start"]
