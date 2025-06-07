
import React from 'react';
import { useApp } from '@/contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  showProgress?: boolean;
}

export function Layout({ children, showProgress = false }: LayoutProps) {
  const { currentStep, titleVotingRounds, maxTitleRounds } = useApp();

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'name':
        return 25;
      case 'survey':
        return 50;
      case 'titles':
        return 50 + (titleVotingRounds / maxTitleRounds) * 25;
      case 'covers':
      case 'dashboard':
        return 100;
      default:
        return 0;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'name':
        return 'Schritt 1 von 3: Name eingeben';
      case 'survey':
        return 'Schritt 2 von 3: Umfrage';
      case 'titles':
        return `Schritt 3 von 3: Titel bewerten (${titleVotingRounds}/${maxTitleRounds})`;
      case 'covers':
        return 'Cover bewerten';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showProgress && (
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">{getStepText()}</h2>
              <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
