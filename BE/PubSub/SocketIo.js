import {Server} from "socket.io";
import {server} from "../server.js";

const startSocketIo = () => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinQuiz", (quizId) => {
            quizId = 'quiz';
            socket.join(quizId);
            console.log(`User ${socket.id} joined quiz ${quizId}`);
        });

        socket.on("submitAnswer", async (data) => {
            const {quizId, userId, answer} = data;
            await processAnswer(io, quizId, userId, answer);
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

async function processAnswer(io, quizId, userId, answer) {
    // Fetch the current question for this quiz
    const question = await getCurrentQuestion(quizId);

    // Check if the answer is correct and calculate score
    const isCorrect = answer === question.correctAnswer;
    const scoreIncrement = isCorrect ? 10 : 0;

    // Update score in Redis
    await updateScoreInRedis(quizId, userId, scoreIncrement);

    // Emit the updated leaderboard to all participants in the quiz
    const leaderboard = await getLeaderboardFromRedis(quizId);
    io.to(quizId).emit("leaderboardUpdate", leaderboard);
}

export {io,startSocketIo}
