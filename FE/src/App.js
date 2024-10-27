import React, {createContext, useState} from 'react';
import './App.css';
import EnglishTest from './Components/EnglishTest';
import AddQuestion from "./Components/AddQuestions";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";

const PlayerContext = createContext();
function App() {
    const queryClient = new QueryClient();
    const [player,setPlayer] = useState(null);
  return (
      <div className="App">
          <QueryClientProvider client={queryClient}>
              <PlayerContext.Provider value={{player,setPlayer}}>
                  <Router>
                      <nav className="navbar">
                          <NavLink to="/" className="nav-link" activeClassName="active-link" exact>
                              Home
                          </NavLink>
                          <NavLink to="/add" className="nav-link" activeClassName="active-link">
                              Add more questions
                          </NavLink>
                      </nav>

                      <Routes>
                          <Route path="/" element={<EnglishTest />} />
                          <Route path="/add" element={<AddQuestion />} />
                      </Routes>
                  </Router>
              </PlayerContext.Provider>
          </QueryClientProvider>
      </div>
);
}

export default App;
export {PlayerContext};
