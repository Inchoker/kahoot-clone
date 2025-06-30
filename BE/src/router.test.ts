import request from 'supertest';
import express from 'express';
import router from './router'; 
import Question from './models/questions';
import { io } from './web-socket/socket-io';

jest.mock('./models/questions');
jest.mock('./web-socket/socket-io');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Quiz Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /questions', () => {
    it('should create a new question and emit event', async () => {
      const mockQuestionData = {
        question: 'What is 2+2?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '4',
        category: 'Math',
        difficulty: 'Easy',
      };

      const mockSavedQuestion = { _id: '123', ...mockQuestionData };

      (Question as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedQuestion),
      }));

      const emitMock = jest.fn();
      (io.to as jest.Mock).mockReturnValue({ emit: emitMock });

      const res = await request(app).post('/questions').send(mockQuestionData);

      expect(res.status).toBe(201);
      expect(io.to).toHaveBeenCalledWith('quiz');
    });
  });

  describe('GET /questions', () => {
    it('should return all questions', async () => {
      const mockQuestions = [
        { _id: '1', question: 'Q1' },
        { _id: '2', question: 'Q2' },
      ];
      (Question.find as jest.Mock).mockResolvedValue(mockQuestions);

      const res = await request(app).get('/questions');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockQuestions);
    });
  });

  describe('POST /submit', () => {
    it('should return correct score', async () => {
      const mockAnswers = [
        { questionId: '1', userAnswer: 'A' },
        { questionId: '2', userAnswer: 'B' },
      ];

      const mockQuestions = [
        { _id: '1', correctAnswer: 'A' },
        { _id: '2', correctAnswer: 'C' },
      ];

      (Question.findById as jest.Mock).mockImplementation((id: string) => {
        return Promise.resolve(mockQuestions.find(q => q._id === id));
      });

      const res = await request(app).post('/submit').send({ answers: mockAnswers });

      expect(res.status).toBe(200);
      expect(res.body.score).toBe(1); // Only the first answer is correct
    });
  });
});
