# API Rate Limiting And Throttling

API Rate Limiting and Throttling is a process that controls the rate of requests sent or received by an API. It is used to prevent abuse and ensure that the API is used in a fair and efficient manner. Rate limiting and throttling can help protect the API from being overwhelmed by too many requests, and can also help ensure that the API is used in a way that is consistent with its intended purpose.

## Clone the repository

```bash
git clone https://github.com/ExorTek/api-rate-throttle-playground.git
```

## Install dependencies

```bash
npm install
# OR
yarn install
```

## Run express server

```bash
npm run dev:express
# OR
yarn dev:express
```

## Run fastify server

```bash
npm run dev:fastify
# OR
yarn dev:fastify
```

## Required Configurations

- Check the `express-rate-limiting-redis` and `fastify-rate-limiting-redis` directories for the required configurations.
- Add your Redis configurations: `host`, `port`, `password`.
