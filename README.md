# key-registering-service

- Create file and correct data `app/.env` and `app/privkey.ts`

  - Copy file example

  ```bash
  cp app/.env.example app/.env
  cp app/privkey.example.ts app/privkey.ts
  ```

  - Config file `app/.env` and `app/privkey.ts`

    File `.env`

    - `BIND, PORT` : IP, Port of service

    - `CONTRACT` : Address of contract MobileValidator

    - `NETWORK`: Network of Blockchain

    - `RPC_URL` : URI of RPC node

    - `MONGODB_URL` : URI of MongoDB

    File `privkey.ts`

    - Key for account admin of contract MobileValidator

- Start Service

  ```bash
  docker compose up -d
  ```

- Run Test

  ```bash
  docker compose exec key-registry-service bash -c "MONGODB_URL_TEST=mongodb://mongo:27017/key-register-test npm test"
  ```
