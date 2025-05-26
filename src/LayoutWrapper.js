import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
// Assuming Footer is part of App.js structure, we'll keep it there for now
// import Footer from './Footer'; // If you had a separate Footer component

const LayoutWrapper = ({ children, showForm }) => {
  const location = useLocation(); // Get the current location

  // Determine if the current route is the login page
  const isLoginPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased">
      {/* Conditionally render Navbar based on the route */}
      {!isLoginPage && <Navbar showForm={showForm} />}

      {/* Render the main content passed as children */}
      <main className="flex-grow bg-slate-100">
        {children}
      </main>

      {/* Conditionally render Footer based on the route */}
      {!isLoginPage && (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-slate-300 text-center p-6 shadow-inner" style={{height: 'var(--footer-height)'}}>
          <p className="text-sm">&copy; {new Date().getFullYear()} Unity Valiyangadi. All rights reserved.</p>
          <p className="text-xs mt-1">Designed with care.</p>
        </footer>
      )}
    </div>
  );
};

export default LayoutWrapper;