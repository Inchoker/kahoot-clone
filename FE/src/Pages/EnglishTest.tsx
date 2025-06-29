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

  // Socket setup
  useEffect(() => {
    socket.on('question', (newQuestion: Question) => {
      setCurrentQuestion(newQuestion);
      setSelectedOption('');
    });

    socket.on('connect', () => {
      if (player) socket.emit('joinQuiz', 'quiz');
    });

    socket.on('disconnect', () => {
      setPlayer('left. Refresh to play');
    });

    socket.on('leaderboardUpdate', (newScore: ScoreItem[]) => {
      setScore(newScore.sort((a,b)=>b.score-a.score));
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
      setCurrentQuestion(null);
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
      handleNameSubmit();
    }
  };

  if (!player || player === 'left. Refresh to play') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Join the Quiz</h1>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 mb-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 !w-72"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter your name"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleNameSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col xl:flex-row xl:min-h-screen xl:w-full xl:overflow-hidden max-w-[1280px] mx-auto">
      
      {/* Left Panel - Question */}
      <div className="w-full xl:w-2/3 p-6 xl:p-12 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6 text-center xl:text-left text-gray-800">
          Quiz Time <span className="text-blue-600">({player})</span>
        </h1>

        {currentQuestion ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">{currentQuestion.question}</h2>
            <div className="text-sm text-gray-500 mb-4 flex gap-4">
              <p><strong>Category:</strong> {currentQuestion.category}</p>
              <p><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const value = (index + 1).toString();
                return (
                  <label
                    key={index}
                    className={`border p-3 rounded-lg text-gray-800 font-medium cursor-pointer transition ${
                      selectedOption === value
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quizOption"
                      value={value}
                      className="mr-2"
                      checked={selectedOption === value}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleAnswer}
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center text-lg font-medium text-gray-600">
            Waiting for questions...
          </div>
        )}
      </div>

      {/* Right Panel - Leaderboard */}
      <div className="w-full xl:w-1/3 bg-white p-6 xl:p-12 border-t xl:border-t-0 xl:border-l border-gray-200 flex flex-col justify-between min-h-[320px]">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center xl:text-left">Leaderboard</h2>
        <ul className="space-y-3 overflow-auto flex-grow">
          {score.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                <span className="text-gray-800">{item.value}</span>
              </div>
              <span className="text-gray-600">{item.score} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizComponent;
