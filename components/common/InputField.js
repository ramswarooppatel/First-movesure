export default function InputField({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = "",
  maxLength,
  disabled = false,
  error = null,
  icon = null,
  helpText = null
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label className="block text-gray-900 font-semibold mb-2 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 text-base transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${icon ? 'pl-10' : ''} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
          } ${
            disabled ? 'bg-slate-100 cursor-not-allowed opacity-50' : ''
          }`}
          required={required}
        />
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500 animate-slide-in-right">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="mt-2 text-sm text-slate-500">
          {helpText}
        </div>
      )}
    </div>
  );
}