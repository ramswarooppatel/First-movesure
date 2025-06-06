import Button from '@/components/common/Button';

export default function RegistrationComplete({ data }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🎉</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to MOVESURE!</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your account has been successfully created. You can now access your dashboard and start managing your business.
      </p>
      
      <div className="space-y-4">
        <Button variant="primary" size="lg" href="/dashboard" icon="🚀">
          Go to Dashboard
        </Button>
        <Button variant="outline" size="lg" href="/help">
          Need Help Getting Started?
        </Button>
      </div>
    </div>
  );
}