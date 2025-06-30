// src/index.ts or main.ts

import { startSocketIo } from "./web-socket/socket-io.js";
import { startRedis } from "./redis/redis-client.js"
import { startMongodb } from "./database/Mongodb/Mongodb.js";
import { startServer } from "./server.js";

const bootstrap = async (): Promise<void> => {
  try {
    await Promise.all([
      startServer(),
      startSocketIo(),
      startRedis(),
      startMongodb(),
    ]);
    console.log("Server fully started!");
  } catch (error) {
    console.error("Error starting services:", error);
    process.exit(1);
  }
};

bootstrap();
