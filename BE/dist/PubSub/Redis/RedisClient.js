import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const REDIS_URI = process.env.REDIS_URI;
if (!REDIS_URI) {
    throw new Error("REDIS_URI is not defined in environment variables");
}
const redisClient = createClient({ url: REDIS_URI });
const startRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    }
    catch (err) {
        console.error("Redis connection error:", err);
    }
};
async function updateScoreInRedis(quizId, userId, score) {
    await redisClient.zIncrBy(`leaderboard:${quizId}`, score, userId);
}
async function getLeaderboardFromRedis(quizId) {
    return redisClient.zRangeWithScores(`leaderboard:${quizId}`, 0, -1);
}
export { startRedis, redisClient, updateScoreInRedis, getLeaderboardFromRedis };
