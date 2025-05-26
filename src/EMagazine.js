import React from 'react';

const EMagazine = () => {
  return (
    // Updated container for dark background and padding
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 flex flex-col items-center">
      {/* Added margin top to account for fixed navbar */}
      <header className="max-w-7xl mx-auto text-center mb-12 md:mb-16 mt-24">
        {/* Updated text color to text-gradient for dark theme */}
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3 md:mb-4">E-Magazine</h1>
        {/* Updated text color to neutral-300 for dark theme */}
        <p className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base">Explore our collection of family e-magazines.</p>
      </header>

      <main className="flex-grow w-full max-w-7xl">
        {/* Placeholder for E-Magazine content */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Magazine Card Placeholder */}
          <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Magazine Title 1</h3>
            <p className="text-neutral-400 text-sm mb-4">Short description of the magazine issue or article.</p>
            <button className="btn btn-primary">Read Now</button>
          </div>
          {/* Add more magazine cards here */}
          <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Magazine Title 2</h3>
            <p className="text-neutral-400 text-sm mb-4">Short description of the magazine issue or article.</p>
            <button className="btn btn-primary">Read Now</button>
          </div>
           <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Magazine Title 3</h3>
            <p className="text-neutral-400 text-sm mb-4">Short description of the magazine issue or article.</p>
            <button className="btn btn-primary">Read Now</button>
          </div>
        </section>
        {/* You can add pagination, filtering, etc. here */}
      </main>
    </div>
  );
};

export default EMagazine;