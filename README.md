# key-registering-service

- Create file and correct data `.env` and `privkey.ts`

  - Copy file example

  ```bash
  cp .env.example .env
  cp privkey.example.ts privkey.ts
  ```

  - Config file `.env` and `privkey.ts`

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

- Run Integration Test

  ```bash
  # integration test
  npm run test:it

  # down integration test
  npm run test:down
  ```
