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

- Run Test

  ```bash
  # Download file firovm.tar
  bash checksum_verification.sh
  ```

  ```bash
  # terminal 1
  npm run test:up

  # wait terminal 1 run success then run terminal 2
  npm run test:it

  # down test
  npm run test:down
  ```
