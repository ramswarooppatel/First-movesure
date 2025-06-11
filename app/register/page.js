"use client";
import { useState } from 'react';
import RegistrationWizard from '@/components/registration/RegistrationWizard';
import Loader from '@/components/common/Loader';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {isLoading && <Loader isLoading={isLoading} message="Setting up your account..." />}
      <RegistrationWizard onLoadingChange={setIsLoading} />
    </div>
  );
}