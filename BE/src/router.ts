import express, { Request, Response } from 'express';
import Question from './Models/Questions.js';
import { io } from './PubSub/SocketIo.js';

const router = express.Router();

// Define types for request bodies
interface QuestionRequestBody {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

interface Answer {
  questionId: string;
  userAnswer: string;
}

interface SubmitRequestBody {
  answers: Answer[];
}

// Create a new question
router.post('/questions', async (req: Request<{}, {}, QuestionRequestBody>, res: Response) => {
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
    io.to('quiz').emit('question', newQuestion);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch all questions
router.get('/questions', async (_req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Submit answers and return score
router.post('/submit', async (req: Request<{}, {}, SubmitRequestBody>, res: Response) => {
  const { answers } = req.body;
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
