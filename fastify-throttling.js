const fastify = require('fastify')({ logger: true });

const CONFIG = {
  PORT: 5004,
  HOST: '127.0.0.1',
};

fastify.listen({ port: CONFIG.PORT, host: CONFIG.HOST }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
