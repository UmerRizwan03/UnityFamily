import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FamilyTree from './pages/FamilyTree';
import EMagazine from './pages/EMagazine';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto py-4">
          <Routes>
            <Route path="/" element={<FamilyTree />} />
            <Route path="/tree" element={<FamilyTree />} />
            <Route path="/e-magazine" element={<EMagazine />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
