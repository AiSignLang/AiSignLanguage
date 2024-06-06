FROM node:latest as build
LABEL authors="A.Resch,E.Lambourne,B.Tsolmonbat"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]



