import dotenv from "dotenv";
import express from "express";
import http from "http";
import router from "./router.js";
import cors from "cors";
import Question from "./Models/Questions.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const startServer = ()=>{
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express.json());
    app.use(router)
    return server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

 export {startServer,server};
