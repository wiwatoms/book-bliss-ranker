
import React from 'react';
import { useApp } from '@/contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  showProgress?: boolean;
}

export function Layout({ children, showProgress = false }: LayoutProps) {
  const { 
    currentStep, 
    titleVotingRounds, 
    maxTitleRounds, 
    coverVotingRounds, 
    maxCoverRounds 
  } = useApp();

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'name':
        return 12.5; // 1/8
      case 'survey':
        return 25; // 2/8
      case 'titles':
        return 25 + (titleVotingRounds / maxTitleRounds) * 37.5; // 2/8 + up to 3/8
      case 'covers':
        return 62.5 + (coverVotingRounds / maxCoverRounds) * 37.5; // 5/8 + up to 3/8
      case 'dashboard':
        return 100;
      default:
        return 0;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'name':
        return 'Schritt 1 von 4: Name eingeben';
      case 'survey':
        return 'Schritt 2 von 4: Umfrage';
      case 'titles':
        return `Schritt 3 von 4: Titel bewerten (${titleVotingRounds}/${maxTitleRounds})`;
      case 'covers':
        return `Schritt 4 von 4: Cover bewerten (${coverVotingRounds}/${maxCoverRounds})`;
      case 'dashboard':
        return 'Bewertung abgeschlossen - Ergebnisse';
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
            {currentStep === 'titles' && (
              <div className="mt-2 text-xs text-gray-600">
                Nach {maxTitleRounds} Titel-Bewertungen geht es automatisch zu den Cover-Bewertungen
              </div>
            )}
            {currentStep === 'covers' && (
              <div className="mt-2 text-xs text-gray-600">
                Nach {maxCoverRounds} Cover-Bewertungen sehen Sie die Ergebnisse
              </div>
            )}
          </div>
        </div>
      )}
      
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
