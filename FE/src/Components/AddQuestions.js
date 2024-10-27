import React, { useState } from 'react';
import axios from 'axios';

const AddQuestion = () => {
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''], // Four options
        correctAnswer: '',
        category: '',
        difficulty: '',
    });
    const [message, setMessage] = useState({ text: '', isError: false });
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        setFormData((prevData) => {
            const updatedOptions = [...prevData.options];
            updatedOptions[index] = value;
            return { ...prevData, options: updatedOptions };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/questions`, formData);
            setMessage({ text: 'Question added successfully!', isError: false });
            // Reset form
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
        <div className="add-question">
            <h2>Add a New Question</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question">Question:</label>
                    <input
                        type="text"
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="options-container">
                    <label>Options:</label>
                    {formData.options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            name={`option-${index}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                    ))}
                </div>
                <div>
                    <label htmlFor="correctAnswer">Correct Answer:</label>
                    <input
                        type="text"
                        id="correctAnswer"
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="difficulty">Difficulty:</label>
                    <input
                        type="text"
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Question</button>
                {message.text && (
                    <p className={`message ${message.isError ? 'error' : 'success'}`}>
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AddQuestion;
