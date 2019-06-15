
FROM node:8.10.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . . 
RUN npm run build
COPY .env ./


EXPOSE 5000

CMD ["npm", "start"]