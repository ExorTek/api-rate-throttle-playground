const express = require('express');
const expressRateLimit = require('express-rate-limit');

const app = express();
const CONFIG = {
  PORT: 5001,
  HOST: '127.0.0.1',
};

app.use(express.json());

const rateLimiter = expressRateLimit({
  windowMs: 60 * 1000,
  max: 3,
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

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found!',
  });
});

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`Server is running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});
