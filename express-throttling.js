const express = require('express');

const app = express();
const CONFIG = {
  PORT: 5002,
  HOST: '127.0.0.1',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`Server is running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});
