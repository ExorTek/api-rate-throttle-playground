const fastify = require('fastify')({ logger: true });
const fastifyRateLimit = require('@fastify/rate-limit');
const Redis = require('ioredis');

const CONFIG = {
  PORT: 5005,
  HOST: '127.0.0.1',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  REDIS_PORT: 6379,
};

const redis = new Redis({
  host: CONFIG.REDIS_HOST,
  password: CONFIG.REDIS_PASSWORD,
  port: CONFIG.REDIS_PORT,
});

const startServer = async () => {
  await fastify.register(fastifyRateLimit, {
    max: 5,
    timeWindow: 60 * 1000,
    redis,
    errorResponseBuilder: (req, context) => {
      return {
        success: false,
        message: 'Too many requests, please try again later in 1 minute',
      };
    },
  });

  fastify.get('/', (request, reply) => {
    reply.send({ message: 'Hello World' });
  });

  fastify.get('/redis', async (request, reply) => {
    const value = await redis.get(`rl:${request.ip}`);
    reply.send({ message: value });
  });

  return fastify.listen({ port: CONFIG.PORT, host: CONFIG.HOST });
};

startServer()
  .then((address) => console.log(`Server is running on ${address}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
