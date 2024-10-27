import mongoose from "mongoose";
import dotenv from "dotenv";

const MONGO_URI = process.env.MONGO_URI;
dotenv.config();
const startMongodb =()=>
    mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

export {startMongodb}
