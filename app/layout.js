import { AuthProvider } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

export const metadata = {
  title: 'MOVESURE - AI-Powered Moving Solutions',
  description: 'Revolutionizing the moving industry with AI-powered solutions, verified professionals, and unmatched customer service.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
