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
        origin: 'http://localhost:3000', // Allow only requests from your React app
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true // Allow credentials (if needed)
    }));
    app.use(express.json());
    app.use(router)
    return server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}



async function getCurrentQuestion(quizId) {
    const questions = await Question.find();
    return { correctAnswer: "A" }; // Example correct answer
}

 export {startServer,server};
