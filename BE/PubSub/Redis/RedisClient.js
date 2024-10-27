import redis from "redis";
import dotenv from "dotenv";
dotenv.config();
const REDIS_URI = process.env.REDIS_URI;

const redisClient = redis.createClient({ url: REDIS_URI });
const startRedis=()=>
    redisClient.connect()
        .then(() => console.log("Connected to Redis"))
        .catch((err) => console.error("Redis connection error:", err));


async function updateScoreInRedis(quizId, userId, score) {
    await redisClient.zIncrBy(`leaderboard:${quizId}`, score, userId);
}

async function getLeaderboardFromRedis(quizId) {
    return redisClient.zRangeWithScores(`leaderboard:${quizId}`, 0, -1);
}
export {startRedis,redisClient,updateScoreInRedis,getLeaderboardFromRedis}
