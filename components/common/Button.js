export default function Button({ children, variant = "primary", size = "md", onClick, href, className = "", icon = null, disabled = false }) {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 relative overflow-hidden group transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl focus:ring-indigo-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:opacity-20",
    
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-md hover:shadow-lg focus:ring-slate-300",
    
    outline: "border-2 border-indigo-500 bg-transparent text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-md hover:shadow-lg focus:ring-indigo-300 backdrop-blur-sm",
    
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl focus:ring-emerald-300",
    
    warning: "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl focus:ring-amber-300",
    
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl focus:ring-red-300",
    
    glass: "bg-white/80 backdrop-blur-lg text-slate-800 hover:bg-white/90 focus:ring-slate-300/50"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const content = (
    <>
      {icon && <span className="text-lg">{icon}</span>}
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </>
  );
  
  if (href && !disabled) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}