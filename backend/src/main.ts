import { createApp } from './app.js';

const port = Number(process.env.PORT || 4106);
createApp().listen(port, () => {
  console.log('UPI Cognitive Spend Brake API listening on http://127.0.0.1:' + port);
});

