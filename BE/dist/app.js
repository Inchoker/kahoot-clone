// src/index.ts or main.ts
import { startSocketIo } from "./PubSub/SocketIo.js";
import { startRedis } from "./PubSub/Redis/RedisClient.js";
import { startMongodb } from "./Database/Mongodb/Mongodb.js";
import { startServer } from "./server.js";
const bootstrap = async () => {
    try {
        await Promise.all([
            startServer(),
            startSocketIo(),
            startRedis(),
            startMongodb(),
        ]);
        console.log("Server fully started!");
    }
    catch (error) {
        console.error("Error starting services:", error);
        process.exit(1);
    }
};
bootstrap();
