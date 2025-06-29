import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
    question: string;
    options: string[];
    correctAnswer: string;
    category: string;
    difficulty: string;
}

interface Message {
    text: string;
    isError: boolean;
}

const AddQuestion: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        category: '',
        difficulty: '',
    });

    const [message, setMessage] = useState<Message>({ text: '', isError: false });
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        setFormData((prevData) => {
            const updatedOptions = [...prevData.options];
            updatedOptions[index] = value;
            return { ...prevData, options: updatedOptions };
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/questions`, formData);
            setMessage({ text: 'Question added successfully!', isError: false });
            setFormData({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                category: '',
                difficulty: '',
            });
        } catch (error) {
            console.error('Error adding question:', error);
            setMessage({ text: 'Error adding question. Please try again.', isError: true });
        }
    };

    return (
        <div className="w-screen h-screen max-h-screen box-border overflow-y-auto bg-gray-100 px-6 py-10 xl:px-20">
            <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
                Add a New Question
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 xl:space-y-8 bg-white shadow-2xl p-8 xl:p-12 rounded-2xl"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <input
                        type="text"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {formData.options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Correct Answer</label>
                        <input
                            type="text"
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Difficulty</label>
                        <input
                            type="text"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    Add Question
                </button>

                {message.text && (
                    <div
                        className={`mt-4 text-sm text-center p-3 rounded-md ${
                            message.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}
                    >
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddQuestion;
