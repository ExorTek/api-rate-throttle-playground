const express = require('express');

const app = express();
const CONFIG = {
  PORT: 5003,
  HOST: '127.0.0.1',
};

const throttle = {
  requestTimes: new Map(),
  limit: 10,
  delay: 2000,
  windowMs: 60000,
};

const throttleMiddleware = async (req, res, next) => {
  const clientIP = req.ip;
  const currentTime = Date.now();
  let clientRequests = throttle.requestTimes.get(clientIP) || [];

  clientRequests = clientRequests.filter((timestamp) => currentTime - timestamp < throttle.windowMs);

  const oldestRequest = clientRequests[0] || currentTime;

  const resetTime = Math.max(0, throttle.windowMs - (currentTime - oldestRequest));

  res.setHeader('X-Throttle-Limit', throttle.limit);
  res.setHeader('X-Throttle-Remaining', Math.max(0, throttle.limit - clientRequests.length));
  res.setHeader('X-Throttle-Reset', Math.ceil(resetTime / 1000));

  if (clientRequests.length >= throttle.limit) {
    await new Promise((resolve) => setTimeout(resolve, throttle.delay));
    throttle.requestTimes.set(clientIP, []);
  }

  clientRequests.push(currentTime);
  throttle.requestTimes.set(clientIP, clientRequests);

  next();
};

app.use(throttleMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`Server is running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});
