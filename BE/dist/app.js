"use strict";
// src/index.ts or main.ts
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_js_1 = require("./web-socket/socket-io.js");
const redis_client_js_1 = require("./redis/redis-client.js");
const Mongodb_js_1 = require("./database/Mongodb/Mongodb.js");
const server_js_1 = require("./server.js");
const bootstrap = async () => {
    try {
        await Promise.all([
            (0, server_js_1.startServer)(),
            (0, socket_io_js_1.startSocketIo)(),
            (0, redis_client_js_1.startRedis)(),
            (0, Mongodb_js_1.startMongodb)(),
        ]);
        console.log("Server fully started!");
    }
    catch (error) {
        console.error("Error starting services:", error);
        process.exit(1);
    }
};
bootstrap();
