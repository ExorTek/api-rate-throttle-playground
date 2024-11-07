const fastify = require('fastify')({ logger: true });

const CONFIG = {
  PORT: 5006,
  HOST: '127.0.0.1',
};

const throttle = {
  requestTimes: new Map(),
  limit: 10,
  delay: 2000,
  windowMs: 60000,
};

const throttleMiddleware = async (req, reply) => {
  const clientIP = req.ip;
  const currentTime = Date.now();
  let clientRequests = throttle.requestTimes.get(clientIP) || [];

  clientRequests = clientRequests.filter((timestamp) => currentTime - timestamp < throttle.windowMs);

  const oldestRequest = clientRequests[0] || currentTime;
  const resetTime = Math.max(0, throttle.windowMs - (currentTime - oldestRequest));

  reply.header('X-Throttle-Limit', throttle.limit);
  reply.header('X-Throttle-Remaining', Math.max(0, throttle.limit - clientRequests.length));
  reply.header('X-Throttle-Reset', Math.ceil(resetTime / 1000));

  if (clientRequests.length >= throttle.limit) {
    await new Promise((resolve) => setTimeout(resolve, throttle.delay));
    throttle.requestTimes.set(clientIP, []);
  }

  clientRequests.push(currentTime);
  throttle.requestTimes.set(clientIP, clientRequests);
};

const startServer = async () => {
  fastify.addHook('onRequest', throttleMiddleware);

  fastify.get('/', async (req, reply) => {
    return { message: 'Hello World!' };
  });

  return fastify.listen({ port: CONFIG.PORT, host: CONFIG.HOST });
};

startServer()
  .then((address) => console.log(`Server is running on ${address}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
