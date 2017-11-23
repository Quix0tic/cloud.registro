FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install
RUN npm run tsc

EXPOSE 80

CMD ["npm", "start"]