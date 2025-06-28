import mongoose, { Schema } from 'mongoose';
const questionSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
});
const Question = mongoose.model('Question', questionSchema);
export default Question;
