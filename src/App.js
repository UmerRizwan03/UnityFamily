import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Remove useLocation import from App.js
// import useLocation from 'react-router-dom'; // REMOVE THIS LINE
// Remove Navbar and Footer imports from App.js as they are now in LayoutWrapper
// import Navbar from './Navbar'; // REMOVE THIS LINE
// import Footer from './Footer'; // REMOVE THIS LINE

import HomePage from './HomePage';
import EMagazine from './EMagazine';
import FamilyMembersPage from './FamilyMembersPage';
import About from './About';
import LoginPage from './LoginPage';
import LayoutWrapper from './LayoutWrapper'; // Import the new LayoutWrapper component

// Ensure your main CSS (index.css or App.css) is imported, usually in src/index.js
// import './index.css';

const App = () => {
  const [showForm, setShowForm] = useState(false); // Add state for form visibility
  // Remove useLocation hook from App component
  // const location = useLocation(); // REMOVE THIS LINE
  // Remove isLoginPage logic from App component
  // const isLoginPage = location.pathname === '/'; // REMOVE THIS LINE

  return (
    <Router>
      {/* Define CSS variables for dynamic height calculations */}
      <style>{`
        :root {
          --navbar-height: 5rem; /* 80px, adjust if Navbar height changes */
          --footer-height: 4rem; /* 64px, adjust if Footer height changes */
        }
      `}</style>
      {/* Wrap the Routes and main content with LayoutWrapper */}
      <LayoutWrapper showForm={showForm}>
        {/* The page components will now handle their own specific backgrounds */}
        <Routes>
          {/* Change HomePage path to /home */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/e-magazine" element={<EMagazine />} />
          {/* Pass showForm and setShowForm to FamilyMembersPage */}
          <Route path="/family-members" element={<FamilyMembersPage showForm={showForm} setShowForm={setShowForm} />} />
          <Route path="/about" element={<About />} />
          {/* Set the Login page as the default route */}
          <Route path="/" element={<LoginPage />} />
          {/* You can add a 404 Not Found route here later */}
        </Routes>
      </LayoutWrapper>
      {/* Remove Footer from here as it's now in LayoutWrapper */}
      {/*
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-slate-300 text-center p-6 shadow-inner" style={{height: 'var(--footer-height)'}}>
        <p className="text-sm">&copy; {new Date().getFullYear()} Unity Valiyangadi. All rights reserved.</p>
        <p className="text-xs mt-1">Designed with care.</p>
      </footer>
      */}
    </Router>
  );
};

export default App;
