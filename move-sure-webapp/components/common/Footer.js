import { Home, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text bg-gradient-to-r from-blue-400 to-purple-400">
                MOVESURE
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Revolutionizing the moving industry with AI-powered solutions, verified professionals, 
              and unmatched customer service. Your journey to a new home starts here.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                <Facebook className="w-5 h-5" />,
                <Twitter className="w-5 h-5" />,
                <Instagram className="w-5 h-5" />,
                <Linkedin className="w-5 h-5" />
              ].map((icon, index) => (
                <div key={index} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <div className="text-white group-hover:scale-110 transition-transform duration-300">{icon}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-blue-400">Services</h4>
            <ul className="space-y-3">
              {[
                "AI Moving Planner",
                "Professional Movers",
                "Storage Solutions",
                "Packing Services",
                "Insurance Coverage",
                "Corporate Relocation"
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-purple-400">Company</h4>
            <ul className="space-y-3">
              {[
                "About MOVESURE",
                "Our Technology",
                "Careers",
                "Press & Media",
                "Partner Program",
                "Contact Us"
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="glass-effect rounded-2xl p-8 mb-12 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-2xl font-bold mb-2">Stay in the Loop</h4>
              <p className="text-gray-300">Get the latest updates on moving tips, technology, and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 md:w-64 px-4 py-3 rounded-l-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; 2025 MOVESURE. All rights reserved. | 
            <a href="#" className="hover:text-blue-400 transition-colors duration-300 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-blue-400 transition-colors duration-300 ml-1">Terms of Service</a>
          </p>
          <div className="flex items-center text-gray-400 text-sm">
            Made with <Heart className="w-4 h-4 text-red-400 mx-1" /> for better moving experiences
          </div>
        </div>
      </div>
    </footer>
  );
}