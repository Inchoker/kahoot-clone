import {Server} from "socket.io";
import {server} from "../server.js";
import Question from "../Models/Questions.js";
import {getLeaderboardFromRedis, updateScoreInRedis} from "./Redis/RedisClient.js";

const startSocketIo = () => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinQuiz", (quizId) => {
            quizId = 'quiz';
            socket.join(quizId);
            console.log(`User ${socket.id} joined quiz ${quizId}`);
        });

        socket.on("answer", async (data,userId) => {
            await processAnswer(io, data,userId);
        });
        socket.on('leaveQuiz', (quiz) => {
            socket.leave(quiz);
            console.log(`Socket ${socket.id} left quiz ${quiz}`);
            io.to(quiz).emit('message', `User ${socket.id} has left the quiz.`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    console.log('Started SocketIo server')
}

const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend URL in production
    },
});

async function processAnswer(io, data,userId) {
    // Fetch the current question for this quiz
    const question = await getCurrentQuestion();

    const isCorrect = data === question.correctAnswer;
    const scoreIncrement = isCorrect ? 10 : 0;

    await updateScoreInRedis('quiz', userId, scoreIncrement);

    const leaderboard = await getLeaderboardFromRedis('quiz');
    io.to('quiz').emit("leaderboardUpdate", leaderboard);
}
async function getCurrentQuestion() {
    const result = (await Question.find().sort({ _id: -1 }).limit(1).exec())[0]._doc;
    return result;
}
export {io,startSocketIo}
