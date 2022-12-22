FROM node:16

WORKDIR /app

COPY ./app .

RUN npm install && npx tsc

EXPOSE 3000 9229

CMD ["npm", "start"]
