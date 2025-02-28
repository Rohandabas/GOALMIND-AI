import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Home from './components/Home';
import GoalTracker from './components/GoalTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/goals" 
          element={
            <SignedIn>
              <GoalTracker />
            </SignedIn>
          }
        />
        <Route 
          path="/goals" 
          element={
            <SignedOut>
              <Navigate to="/" replace />
            </SignedOut>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;