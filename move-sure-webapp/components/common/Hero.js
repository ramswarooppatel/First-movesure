import Button from "./Button";
import { 
  Sparkles, 
  Rocket, 
  Users, 
  CheckCircle, 
  Headphones, 
  Building, 
  Factory, 
  Store, 
  ShoppingBag, 
  Landmark,
  LogIn,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-800/30 rounded-full filter blur-3xl opacity-40 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200 dark:bg-cyan-800/30 rounded-full filter blur-3xl opacity-40 dark:opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-800/30 rounded-full filter blur-3xl opacity-30 dark:opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Enhanced Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 6}s`
          }}
        ></div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-8 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent font-bold">NEW</span>
            <span className="mx-2">•</span>
            AI-Powered Moving Assistant
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Transform Your Journey with{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                MOVESURE
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 rounded-lg blur-lg opacity-30 animate-pulse"></div>
            </span>
          </h1>

          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the future of relocation with our{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent font-semibold">AI-powered ecosystem</span>. 
            From intelligent planning to seamless execution, we've revolutionized every aspect of your moving journey.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="primary" 
              size="lg" 
              href="/register"
              icon={<Rocket className="w-5 h-5" />}
              className="min-w-[220px] animate-pulse-glow"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="glass" 
              size="lg" 
              href="/login"
              icon={<LogIn className="w-5 h-5" />}
              className="min-w-[220px]"
            >
              Welcome Back
            </Button>
          </div>

        {/* Enhanced Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                      { number: "AI-Powered", label: "Moving Technology", icon: <Sparkles className="w-8 h-8" />, color: "green" },
                      { number: "Fast", label: "Implementation", icon: <Rocket className="w-8 h-8" />, color: "indigo" },
                      { number: "24/7", label: "Customer Support", icon: <Headphones className="w-8 h-8" />, color: "cyan" }
                    ].map((stat, index) => (
                      <div 
                        key={index} 
                        className="glass-effect rounded-2xl p-8 text-center group hover:bg-white/90 dark:hover:bg-slate-800/50 transition-all duration-300 border border-slate-200/50 dark:border-slate-600/30 shadow-lg hover:shadow-xl animate-bounce-in"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="text-indigo-500 dark:text-indigo-400 mb-3 flex justify-center">{stat.icon}</div>
                        <div className={`text-3xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                          {stat.number}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Trust Indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 opacity-60">
            <span className="text-sm text-slate-500 dark:text-slate-400">Trusted by leading companies:</span>
            {[
              <Building className="w-6 h-6" />,
              <Factory className="w-6 h-6" />,
              <Store className="w-6 h-6" />,
              <ShoppingBag className="w-6 h-6" />,
              <Landmark className="w-6 h-6" />
            ].map((icon, index) => (
              <div 
                key={index}
                className="w-8 h-8 flex items-center justify-center text-slate-400 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-500 dark:text-slate-400 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 font-medium">Discover More</span>
          <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}