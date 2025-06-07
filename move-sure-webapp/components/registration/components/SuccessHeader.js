"use client";
import { PartyPopper, Sparkles, Trophy, Star } from 'lucide-react';

export default function SuccessHeader({ isSubmitted }) {
  return (
    <div className="relative text-center mb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full blur-3xl"></div>
      </div>
      
      {/* Success icon with animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden group">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {isSubmitted ? (
            <Trophy className="w-16 h-16 text-white animate-bounce" />
          ) : (
            <PartyPopper className="w-16 h-16 text-white animate-pulse" />
          )}
          
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-0 left-0 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-500"></div>
        </div>

        {/* Decorative stars */}
        <Star className="absolute top-4 left-1/3 w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
        <Star className="absolute top-8 right-1/3 w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
        <Sparkles className="absolute bottom-4 left-1/4 w-5 h-5 text-blue-400 animate-pulse" />
        <Sparkles className="absolute bottom-8 right-1/4 w-6 h-6 text-purple-400 animate-pulse delay-300" />
      </div>
      
      {/* Title with gradient text */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
        {isSubmitted ? '🎊 Registration Complete!' : '🎉 Welcome to MOVESURE!'}
      </h1>
      
      {/* Subtitle with typing effect */}
      <div className="max-w-2xl mx-auto">
        <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
          {isSubmitted ? (
            "🚀 Your business account has been successfully created and you're ready to start your journey with MOVESURE!"
          ) : (
            "Congratulations! Your business registration is ready. Let's finalize everything and get you started!"
          )}
        </p>
        
        {!isSubmitted && (
          <p className="text-lg text-gray-500">
            Click &quot;Complete Registration&quot; below to create your account in our system
          </p>
        )}
      </div>
    </div>
  );
}