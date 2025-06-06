import Button from '@/components/common/Button';
import { Rocket, HelpCircle, PartyPopper } from 'lucide-react';

export default function RegistrationComplete({ data }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <PartyPopper className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to MOVESURE!</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your account has been successfully created. You can now access your dashboard and start managing your business.
      </p>
      
      <div className="space-y-4">
        <Button variant="primary" size="lg" href="/dashboard" icon={<Rocket className="w-5 h-5" />}>
          Go to Dashboard
        </Button>
        <Button variant="outline" size="lg" href="/help" icon={<HelpCircle className="w-5 h-5" />}>
          Need Help Getting Started?
        </Button>
      </div>
    </div>
  );
}