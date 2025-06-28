import React, { useContext, useEffect, useState } from 'react';
import socket from '../SocketIoClient/SocketIo';
import { PlayerContext } from '../App';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

interface ScoreItem {
  value: string;
  score: number;
}

interface PlayerContextType {
  player: string;
  setPlayer: React.Dispatch<React.SetStateAction<string>>;
}

const QuizComponent: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [score, setScore] = useState<ScoreItem[]>([]);
  const [nameInput, setNameInput] = useState('');
  const { player, setPlayer } = useContext(PlayerContext) as PlayerContextType;

  useEffect(() => {
    socket.on('question', (newQuestion: Question) => {
      setCurrentQuestion(newQuestion);
      setSelectedOption('');
    });

    socket.on('connect', () => {
      if (player) {
        socket.emit('joinQuiz', 'quiz');
      }
    });

    socket.on('disconnect', () => {
      setPlayer('left. Refresh to play');
    });

    socket.on('leaderboardUpdate', (newScore: ScoreItem[]) => {
      setScore(newScore);
    });

    return () => {
      socket.off('question');
      socket.off('leaderboardUpdate');
      socket.emit('leaveQuiz');
    };
  }, [player, setPlayer]);

  const handleAnswer = () => {
    if (selectedOption) {
      socket.emit('answer', selectedOption, player);
      setSelectedOption('');
      setCurrentQuestion(null)
    }
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setPlayer(nameInput.trim());
      socket.emit('joinQuiz', 'quiz');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSubmit()
    }
  };

  if (!player || player === 'left. Refresh to play') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Enter Your Name to Join</h1>
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 mb-3 w-64"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Your name"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleNameSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Real-Time Quiz <span className="text-blue-600">({player})</span>
      </h1>

      {currentQuestion ? (
        <div className="mb-6 border p-4 rounded shadow-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">{currentQuestion.question}</h2>
          <p className="text-sm mb-1"><strong>Category:</strong> {currentQuestion.category}</p>
          <p className="text-sm mb-4"><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>

          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`block border p-2 rounded cursor-pointer ${
                  selectedOption === option ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="quizOption"
                  value={option}
                  className="mr-2"
                  checked={selectedOption === index+1+""}
                  onChange={(e) => setSelectedOption(index+1+"")}
                />
                {option}
              </label>
            ))}
          </div>

          <button
            onClick={handleAnswer}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <p className="text-lg font-medium">Waiting for questions...</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
        <ul className="space-y-1">
          {score.map((item, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-100 p-2 rounded shadow-sm"
            >
              <span className="font-medium">{item.value}</span>
              <span>{item.score} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizComponent;
