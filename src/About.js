import React from 'react';

const About = () => {
  return (
    // Updated container for dark background and padding
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 flex flex-col items-center">
      {/* Added margin top to account for fixed navbar */}
      <header className="max-w-7xl mx-auto text-center mb-12 md:mb-16 mt-24">
        {/* Updated text color to text-gradient for dark theme */}
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3 md:mb-4">About Our Family</h1>
        {/* Updated text color to neutral-300 for dark theme */}
        <p className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base">Learn about the history and purpose of our family community.</p>
      </header>

      <main className="flex-grow w-full max-w-7xl text-neutral-300">
        {/* Placeholder for About content */}
        <section className="bg-neutral-800/50 rounded-lg shadow-lg p-6 md:p-8 border border-neutral-700 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Our History</h3>
            <p>
              // ... Add your history text here ...
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Our Mission</h3>
            <p>
              // ... Add your mission text here ...
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          {/* Add more sections as needed */}
          <div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">The Family Tree Project</h3>
            <p>
              // ... Add details about the project here ...
              This application is designed to help us visualize and preserve our family connections and history for future generations.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;