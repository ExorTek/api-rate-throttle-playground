const fastify = require('fastify')({ logger: true });
const fastifyRateLimit = require('@fastify/rate-limit');

const CONFIG = {
  PORT: 5003,
  HOST: '127.0.0.1',
};

const startServer = async () => {
  await fastify.register(fastifyRateLimit, {
    max: 5,
    timeWindow: 60 * 1000,
  });

  fastify.get('/', (request, reply) => {
    reply.send({ message: 'Hello World' });
  });

  return fastify.listen({ port: CONFIG.PORT, host: CONFIG.HOST });
};

startServer()
  .then((address) => console.log(`Server is running on ${address}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
