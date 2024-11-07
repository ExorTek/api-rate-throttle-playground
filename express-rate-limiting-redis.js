const express = require('express');
const expressRateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');

const app = express();

const CONFIG = {
  PORT: 5005,
  HOST: '127.0.0.1',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  REDIS_PORT: 6379,
};

const redisClient = createClient({
  password: CONFIG.REDIS_PASSWORD,
  socket: {
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
  },
});

(async () => {
  await redisClient.connect();
})();

app.use(express.json());

const rateLimiter = expressRateLimit({
  windowMs: 60 * 1000,
  max: 3,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later in 1 minute',
    });
  },
});

app.use(rateLimiter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello World!',
  });
});

app.get('/redis', async (req, res) => {
  const value = await redisClient.get(`rl:${req.ip}`);
  res.status(200).json({
    success: true,
    message: value,
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found!',
  });
});

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`Server is running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});
