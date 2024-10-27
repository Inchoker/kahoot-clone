import express from 'express';
import Question from './Models/Questions.js';
import {io} from "./PubSub/SocketIo.js";

const router = express.Router();

router.post('/questions', async (req, res) => {
    const { question, options, correctAnswer, category, difficulty } = req.body;

    const newQuestion = new Question({
        question,
        options,
        correctAnswer,
        category,
        difficulty,
    });

    try {
        await newQuestion.save();
        res.status(201).json(newQuestion);
        io.to('quiz').emit('question',newQuestion)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit answers
router.post('/submit', async (req, res) => {
    const { answers } = req.body; // An array of answer objects { questionId, userAnswer }

    let score = 0;

    for (const answer of answers) {
        const question = await Question.findById(answer.questionId);
        if (question && question.correctAnswer === answer.userAnswer) {
            score++;
        }
    }

    res.status(200).json({ score });
});

export default router;
