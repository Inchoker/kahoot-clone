"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_1 = __importDefault(require("./models/questions"));
const socket_io_1 = require("./web-socket/socket-io");
const router = express_1.default.Router();
// Create a new question
router.post('/questions', async (req, res) => {
    const { question, options, correctAnswer, category, difficulty } = req.body;
    const newQuestion = new questions_1.default({
        question,
        options,
        correctAnswer,
        category,
        difficulty,
    });
    try {
        await newQuestion.save();
        res.status(201).json(newQuestion);
        socket_io_1.io.to('quiz').emit('question', newQuestion);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Fetch all questions
router.get('/questions', async (_req, res) => {
    try {
        const questions = await questions_1.default.find();
        res.status(200).json(questions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Submit answers and return score
router.post('/submit', async (req, res) => {
    const { answers } = req.body;
    let score = 0;
    for (const answer of answers) {
        const question = await questions_1.default.findById(answer.questionId);
        if (question && question.correctAnswer === answer.userAnswer) {
            score++;
        }
    }
    res.status(200).json({ score });
});
exports.default = router;
