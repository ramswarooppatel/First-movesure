import FeatureCard from "./FeatureCard";
import Button from "./Button";
import { Bot, Truck, Smartphone, Shield, Crown, Zap, Sparkles, Target } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Planning",
      description: "Smart algorithms analyze your needs and create personalized moving plans with optimal timelines and cost predictions.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Verified Pro Network",
      description: "Connect with our network of verified, insured professional movers. Background-checked and rated by real customers.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Smart Tracking",
      description: "Real-time GPS tracking, photo updates, and instant notifications. Know exactly where your belongings are at all times.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Complete Protection",
      description: "Comprehensive insurance coverage with instant claims processing. Your valuables are protected with industry-leading security.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Premium Experience",
      description: "White-glove service with dedicated move coordinators, priority support, and luxury amenities throughout your journey.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Everything",
      description: "Get quotes in seconds, book services instantly, and receive real-time updates. The fastest moving platform ever built.",
      gradient: "from-yellow-500 to-red-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-800/30 rounded-full filter blur-3xl opacity-40 dark:opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-800/30 rounded-full filter blur-3xl opacity-40 dark:opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6 border border-blue-200 dark:border-blue-700/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black theme-text-primary mb-6">
            Why Choose{" "}
            <span className="gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
              MOVESURE
            </span>
            ?
          </h2>
          
          <p className="text-xl theme-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of moving technology with features designed to make your relocation seamless, secure, and stress-free.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 dark:border-gray-700/50 shadow-lg dark:shadow-2xl">
            <h3 className="text-3xl font-bold theme-text-primary mb-4">
              Ready to Experience the Future of Moving?
            </h3>
            <p className="theme-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their moving experience with MOVESURE.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              href="/register"
              icon={<Target className="w-5 h-5" />}
              className="animate-glow"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}