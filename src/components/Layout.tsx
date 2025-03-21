/**
 * Layout Component
 * Provides the main layout structure with dynamic height adjustment
 */
import { ReactNode } from 'react';
import Nav from './Nav';
import { useBackground } from '../context/BackgroundContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { backgroundImage, isLoading } = useBackground();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navigation */}
      <Nav />
      
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage})` 
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pt-16">
        {children}
      </main>
    </div>
  );
} 