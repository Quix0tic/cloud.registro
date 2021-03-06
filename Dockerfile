FROM hypriot/rpi-node:latest

COPY . /app

WORKDIR /app

RUN npm install
RUN npm run tsc

EXPOSE 8585

CMD ["npm", "start"]