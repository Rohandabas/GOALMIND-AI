import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { FaRocket, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4 overflow-x-hidden">
      {/* Navbar - Full width, fixed at top, clean and modern */}
      <nav className="w-full p-4 bg-gray-950/80 backdrop-blur-sm shadow-lg rounded-lg fixed top-0 left-0 right-0 z-50 transform animate-fadeIn">
        <div className="flex justify-between items-center mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center">
            <span className="mr-2">🚀</span> GoalMind AI
          </h1>
          <div>
            <SignedOut>
              <SignInButton
                mode="modal"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-10 h-10',
                  },
                }}
                className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Main content - Centered, animated, and engaging */}
      <main className="text-center mt-20 mb-20 max-w-3xl mx-auto transform animate-slideDown">
        <h1 className="text-6xl font-extrabold text-blue-300 mb-8 drop-shadow-md flex justify-center items-center">
          <FaRocket className="mr-4 text-yellow-400 animate-pulse" /> GoalMind AI
        </h1>
        <p className="text-xl text-gray-200 mb-4 font-medium leading-relaxed">
          Boost your productivity with AI-powered goal planning
        </p>
        <p className="text-xl text-gray-300 mb-10 font-medium leading-relaxed">
          Track your weekly goals, get smart suggestions, and stay motivated with advanced AI insights
        </p>

        {/* Feature highlights with icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
            <FaLightbulb className="text-blue-400 text-3xl mb-4 animate-bounce" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Smart Suggestions</h3>
            <p className="text-gray-400 text-sm">Get AI-driven goal ideas tailored to your needs.</p>
          </div>
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
            <FaCheckCircle className="text-green-400 text-3xl mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm">Monitor your goals and celebrate achievements.</p>
          </div>
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
            <FaRocket className="text-yellow-400 text-3xl mb-4 animate-bounce" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Motivation Boost</h3>
            <p className="text-gray-400 text-sm">Stay inspired with personalized rewards and tips.</p>
          </div>
        </div>

        {/* Call-to-Action Button */}
        <SignedIn>
          <button
            onClick={() => window.location.href = '/goals'}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Make Goals
          </button>
        </SignedIn>
        <SignedOut>
          <SignInButton
            mode="modal"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Login to Make Goals
          </SignInButton>
        </SignedOut>
      </main>

      {/* Footer - Simple and fixed at bottom */}
      <footer className="w-full p-4 bg-gray-950/80 backdrop-blur-sm shadow-lg rounded-lg fixed bottom-0 left-0 right-0 z-50 transform animate-fadeIn">
        <p className="text-gray-400 text-center text-sm">© 2025 GoalMind AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;