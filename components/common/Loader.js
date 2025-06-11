"use client";
import { useState, useEffect } from "react";

export default function Loader({ isLoading = true, message = "Loading MOVESURE..." }) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const loadingTips = [
    "🚀 Initializing industry-grade software...",
    "📊 Loading your billing dashboard...",
    "⚡ Connecting to cloud infrastructure...",
    "🔄 Syncing latest updates...",
    "💼 Preparing business solutions...",
    "🛡️ Securing your data...",
    "✨ Almost ready for takeoff!"
  ];

  useEffect(() => {
    if (isLoading) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
      }, 2000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(tipInterval);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-blue-400/30 rounded-lg animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-purple-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 text-4xl animate-float">💼</div>
        <div className="absolute top-32 right-32 text-3xl animate-float" style={{animationDelay: '1s'}}>📊</div>
        <div className="absolute bottom-40 left-40 text-3xl animate-float" style={{animationDelay: '2s'}}>⚡</div>
        <div className="absolute bottom-20 right-20 text-4xl animate-float" style={{animationDelay: '1.5s'}}>🚀</div>
        <div className="absolute top-1/3 right-1/6 text-3xl animate-float" style={{animationDelay: '0.5s'}}>🔄</div>
        <div className="absolute bottom-1/3 left-1/8 text-3xl animate-float" style={{animationDelay: '2.5s'}}>💡</div>

        {/* Animated Doodles */}
        <svg className="absolute top-16 left-1/2 w-20 h-20 text-blue-400/40 animate-draw" viewBox="0 0 100 100">
          <path 
            d="M20,50 Q50,20 80,50 Q50,80 20,50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="animate-dash"
          />
        </svg>

        <svg className="absolute bottom-32 right-1/3 w-16 h-16 text-purple-400/40 animate-draw" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="animate-dash"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="animate-dash"
            style={{animationDelay: '0.5s'}}
          />
        </svg>

        {/* Code Brackets */}
        <div className="absolute top-1/4 right-1/5 text-6xl text-green-400/30 animate-pulse">{ }</div>
        <div className="absolute bottom-1/4 left-1/5 text-5xl text-yellow-400/30 animate-pulse" style={{animationDelay: '1s'}}>{`</ >`}</div>
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* MOVESURE Logo Animation */}
        <div className="mb-12">
          <div className="relative">
            {/* Logo Container */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600">M</span>
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>

            {/* Company Name */}
            <h1 className="text-4xl font-black text-white mb-2">
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-purple-400">
                MOVESURE
              </span>
            </h1>
            <p className="text-blue-300 text-sm font-medium mb-8">Industry-Grade Business Solutions</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"></div>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-white/80 text-sm font-medium">
            {Math.round(Math.min(progress, 100))}% Complete
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <p className="text-white/90 text-lg font-medium mb-2 animate-fade-in-up">
            {loadingTips[currentTip]}
          </p>
          <p className="text-white/60 text-sm">
            Please wait while we prepare your experience...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Feature Icons Grid */}
        <div className="mt-12 grid grid-cols-5 gap-4 opacity-60">
          {['📊', '💼', '⚡', '🔄', '🛡️'].map((icon, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-lg animate-pulse"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Animated Version Info */}
      <div className="absolute bottom-6 left-6 text-white/40 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>v2.1.4 • Live Updates Enabled</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 text-white/40 text-xs">
        <div className="flex items-center space-x-2">
          <span>Powered by MOVESURE.IO</span>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}