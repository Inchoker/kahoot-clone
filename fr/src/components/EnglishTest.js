import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const QuizComponent = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);

    useEffect(() => {
        socket.on('question', (newQuestion) => {
            console.log(newQuestion)
            setCurrentQuestion(newQuestion);
            setSelectedOption('');
        });

        socket.on('scoreUpdate', (newScore) => {
            setScore(newScore);
        });
        socket.emit('joinQuiz','quiz')

        return () => {
            console.log('here')
            socket.off('question');
            socket.off('scoreUpdate');
            socket.emit('leaveQuiz');
        };
    }, []);

    const handleAnswer = () => {
        if (selectedOption) {
            socket.emit('answer', selectedOption);
            setSelectedOption('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Real-Time Quiz</h1>
            {currentQuestion ? (
                <div>
                    <h2>{currentQuestion.question}</h2>
                    <p><strong>Category:</strong> {currentQuestion.category}</p>
                    <p><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>
                    <div>
                        {currentQuestion.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    id={option}
                                    name="quizOption"
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAnswer}>Submit Answer</button>
                </div>
            ) : (
                <p>Waiting for questions...</p>
            )}
            <h3>Your Score: {score}</h3>
        </div>
    );
};

export default QuizComponent;
