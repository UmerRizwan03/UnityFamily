import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Consider adding an icon library like react-icons for the menu toggle
// import { HiMenu, HiX } from 'react-icons/hi';

// Receive showForm as a prop
const Navbar = ({ showForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State to track scroll

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) { // Change 50 to whatever scroll distance you prefer
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Updated styles for dark theme
  const linkBaseStyle = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50";
  const activeLinkStyle = "bg-accent-primary text-white shadow-md";
  // Modified inactiveLinkStyle to add hover effects
  const inactiveLinkStyle = "text-neutral-300 hover:bg-neutral-700 hover:text-white hover:scale-105 hover:shadow-glow-accent-primary transform"; // Added transform, hover:scale-105, hover:shadow-glow-accent-primary
  const mobileLinkStyle = "block w-full text-left"; // For consistent mobile link appearance

  return (
    // Dynamically change background and shadow based on scroll state
    // Add conditional class to hide the navbar when showForm is true
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${scrolled ? 'bg-neutral-900 shadow-xl border-b border-neutral-800' : 'bg-transparent border-b border-transparent'} ${showForm ? 'hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            {/* Updated Link className to use flex and items-center */}
            <Link to="/home" className="flex-shrink-0 group flex items-center space-x-2">
              {/* Placeholder for a logo - could be an SVG or an image */}
              <img className="h-10 w-auto" src="/unityLogo.png" alt="Unity Valiyangadi" />
              <span className="text-3xl font-bold text-gradient group-hover:brightness-110 transition-all duration-300">
                Unity Valiyangadi
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {/* NavLinks use the updated styles */}
              <NavLink to="/home" className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Home</NavLink>
              <NavLink to="/family-members" className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Members</NavLink>
              <NavLink to="/e-magazine" className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>E-Magazine</NavLink>
              <NavLink to="/about" className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>About</NavLink>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-neutral-800 inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Using simple SVG for now, consider react-icons for better icons */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state with transition */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-neutral-800 rounded-b-lg shadow-lg">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBaseStyle} ${mobileLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Home</NavLink>
          <NavLink to="/family-members" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBaseStyle} ${mobileLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Members</NavLink>
          <NavLink to="/e-magazine" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBaseStyle} ${mobileLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>E-Magazine</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBaseStyle} ${mobileLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>About</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;