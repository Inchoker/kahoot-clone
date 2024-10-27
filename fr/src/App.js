import React from 'react';
import './App.css';
import EnglishTest from './components/EnglishTest';
import AddQuestion from "./components/AddQuestions";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

function App() {
  return (
      <div className="App">
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
      </div>
);
}

export default App;
