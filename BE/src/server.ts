import dotenv from "dotenv";
import express, { Application } from "express";
import http, { Server } from "http";
import router from "./router";
import cors from "cors";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "1208", 10);

const app: Application = express();
const server: Server = http.createServer(app);

const startServer = (): Server => {
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    app.use(express.json());
    app.use(router); 

    return server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

export { startServer, server };
