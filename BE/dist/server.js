"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.startServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || "1208", 10);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.server = server;
const startServer = () => {
    app.use((0, cors_1.default)({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use(router_1.default);
    return server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
exports.startServer = startServer;
