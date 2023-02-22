FROM node:16 as builder

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16

RUN useradd -ms /bin/bash keyregis
USER keyregis

WORKDIR /app

COPY --chown=keyregis:keyregis --from=builder /app .

EXPOSE 3000 9229

CMD ["npm", "start"]
