import React, {useContext, useEffect, useState} from 'react';
import socket from "../SocketIoClient/SocketIo";
import {PlayerContext} from "../App";

const QuizComponent = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState([]);
    const {player, setPlayer} = useContext(PlayerContext)

    useEffect(() => {
        socket.on('question', (newQuestion) => {
            console.log(newQuestion)
            setCurrentQuestion(newQuestion);
            setSelectedOption('');
        });
        socket.on('connect',()=>{
            setPlayer(socket.id.slice(0,4));
            socket.emit('joinQuiz','quiz')
        })
        socket.on('disconnect',()=>{
            setPlayer('left. Refresh to play');
        })

        socket.on('leaderboardUpdate', (newScore) => {
            setScore(newScore);
        });


        return () => {

            socket.off('question');
            socket.off('scoreUpdate');
            socket.emit('leaveQuiz');
        };
    }, [setPlayer]);

    const handleAnswer = () => {
        if (selectedOption) {
            socket.emit('answer', selectedOption,player);
            setSelectedOption('');
        }
    };


    return (
        <div style={{ padding: '20px' }}>
            <h1>Real-Time Quiz. You are player {player}</h1>
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
            {score.map((item, index) => <h3 id={index}>{item.value}: {item.score}</h3>)}

        </div>
    );
};

export default QuizComponent;
