import mongoose, { Document, Schema, Model } from 'mongoose';

interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

interface QuestionDocument extends IQuestion, Document {}

const questionSchema: Schema = new Schema<QuestionDocument>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
});

const Question: Model<QuestionDocument> = mongoose.model<QuestionDocument>('Question', questionSchema);

export default Question;
