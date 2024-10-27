import {startSocketIo} from "./PubSub/SocketIo.js";
import {startRedis} from "./PubSub/Redis/RedisClient.js";
import {startMongodb} from "./Database/Mongodb/Mongodb.js";
import {startServer} from "./server.js";

Promise.all([
    startServer(),startSocketIo(),startRedis(), startMongodb()
]).then (()=>{console.log("Server fully started!")})
