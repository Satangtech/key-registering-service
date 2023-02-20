FROM node:16

RUN useradd -ms /bin/bash keyregis

USER keyregis
WORKDIR /app
RUN chown -R keyregis:keyregis /app

COPY --chown=keyregis:keyregis ./package*.json ./

RUN npm install

COPY --chown=keyregis:keyregis . .

RUN npm run build

EXPOSE 3000 9229

CMD ["npm", "start"]
