"use client";
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import Button from '@/components/common/Button';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => router.back()}
            variant="primary"
            className="w-full"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="w-full"
            icon={<Home className="w-4 h-4" />}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}