import { Server, Socket } from "socket.io";
import { server } from "../server"
import Question from "../models/questions";
import { getLeaderboardFromRedis, updateScoreInRedis } from "../redis/redis-client";

interface AnswerPayload {
  answer: string;
}

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const startSocketIo = (): void => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinQuiz", (quizId: string) => {
      quizId = "quiz";
      socket.join(quizId);
      console.log(`User ${socket.id} joined quiz ${quizId}`);
    });

    socket.on("answer", async (data: string, userId: string) => {
      await processAnswer(io, data, userId);
    });

    socket.on("leaveQuiz", (quiz: string) => {
      socket.leave(quiz);
      console.log(`Socket ${socket.id} left quiz ${quiz}`);
      io.to(quiz).emit("message", `User ${socket.id} has left the quiz.`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  console.log("Started SocketIo server");
};

async function processAnswer(io: Server, data: string, userId: string): Promise<void> {
  const question = await getCurrentQuestion();
  const isCorrect = data === question.correctAnswer;
  const scoreIncrement = isCorrect ? 10 : 0;

  await updateScoreInRedis("quiz", userId, scoreIncrement);
  const leaderboard = await getLeaderboardFromRedis("quiz");
  io.to("quiz").emit("leaderboardUpdate", leaderboard);
}

async function getCurrentQuestion(): Promise<{
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}> {
  const result = ((await Question.find().sort({ _id: -1 }).limit(1).exec())[0] as any)._doc;
  return result;
}

export { io, startSocketIo };
