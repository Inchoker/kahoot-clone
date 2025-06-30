import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import './App.css';
import EnglishTest from './Pages/EnglishTest';
import AddQuestions from "./Pages/AddQuestions";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

interface PlayerContextType {
  player: string | null;
  setPlayer: Dispatch<SetStateAction<string | null>>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function App() {
  const queryClient = new QueryClient();
  const [player, setPlayer] = useState<string | null>(null);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <PlayerContext.Provider value={{ player, setPlayer }}>
          <Router>
            <nav className="navbar">
              <NavLink to="/" className="nav-link" end>
                Home
              </NavLink>
              <NavLink to="/add" className="nav-link">
                Add more questions
              </NavLink>
            </nav>
            <Routes>
              <Route path="/" element={<EnglishTest />} />
              <Route path="/add" element={<AddQuestions />} />
            </Routes>
          </Router>
        </PlayerContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
export { PlayerContext, PlayerContextType };
