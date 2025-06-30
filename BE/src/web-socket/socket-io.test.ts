import { createServer, Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import Client, { Socket as ClientSocket } from "socket.io-client";
import * as RedisClient from "../redis/redis-client";
import Question from "../models/questions";
import { startSocketIo,io } from "./socket-io";

jest.mock("../redis/redis-client");
jest.mock("../models/questions");

let httpServer: HttpServer;
let socketUrl: string;

beforeAll((done) => {
  httpServer = createServer();
  const socketServer = new IOServer(httpServer, {
    cors: { origin: "*" }
  });

  io.attach(httpServer);
  httpServer.listen(() => {
    const address = httpServer.address();
    if (typeof address === "object" && address !== null) {
      socketUrl = `http://localhost:${address.port}`;
    }
    startSocketIo();
    done();
  });
});

afterAll((done) => {
  io.close();
  httpServer.close(done);
});

test("should emit leaderboardUpdate after correct answer", (done) => {
  const mockUpdateScore = RedisClient.updateScoreInRedis as jest.Mock;
  const mockGetLeaderboard = RedisClient.getLeaderboardFromRedis as jest.Mock;
  const mockQuestionFind = Question.find as jest.Mock;

  mockUpdateScore.mockResolvedValue(undefined);
  mockGetLeaderboard.mockResolvedValue([{ userId: "user1", score: 10 }]);
  mockQuestionFind.mockReturnValue({
    sort: () => ({
      limit: () => ({
        exec: () =>
          Promise.resolve([
            { _doc: { correctAnswer: "A" } }
          ])
      })
    })
  });

  const client = Client(socketUrl);

  client.on("connect", () => {
    client.emit("joinQuiz", "quiz");

    client.on("leaderboardUpdate", (leaderboard:any) => {
      expect(mockUpdateScore).toHaveBeenCalledWith("quiz", "user1", 10);
      expect(Array.isArray(leaderboard)).toBe(true);
      expect(leaderboard[0].userId).toBe("user1");
      client.disconnect();
      done();
    });

    client.emit("answer", "A", "user1");
  });
});
