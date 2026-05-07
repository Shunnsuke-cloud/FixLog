import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`FixLog API is running on http://localhost:${env.port}`);
});
