export default function FeatureCard({ icon, title, description, gradient = "from-indigo-500 to-cyan-500", delay = 0 }) {
  return (
    <div 
      className="group relative theme-card backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border hover:border-indigo-200/50 dark:hover:border-indigo-400/30 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
      
      {/* Icon Container */}
      <div className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
        <span className="text-3xl filter drop-shadow-sm">{icon}</span>
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl animate-pulse"></div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold theme-text-primary mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="theme-text-secondary leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
        {description}
      </p>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
        <span className="text-sm">→</span>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 dark:bg-indigo-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-8 right-8 w-1 h-1 bg-cyan-400 dark:bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce" style={{animationDelay: '0.2s'}}></div>
      <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-purple-400 dark:bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce" style={{animationDelay: '0.4s'}}></div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-b-2xl overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      </div>
    </div>
  );
}