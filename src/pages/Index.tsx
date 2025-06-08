
import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { StartScreen } from '@/components/StartScreen';
import { NameInput } from '@/components/NameInput';
import { Survey } from '@/components/Survey';
import { ComparisonView } from '@/components/ComparisonView';
import { RankingView } from '@/components/RankingView';
import { AdminDashboard } from '@/components/AdminDashboard';

function AppContent() {
  const { currentStep } = useApp();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'start':
        return <StartScreen />;
      case 'name':
        return <NameInput />;
      case 'survey':
        return <Survey />;
      case 'titles':
        return <ComparisonView type="title" />;
      case 'covers':
        return <ComparisonView type="cover" />;
      case 'ranking':
        return <RankingView />;
      case 'dashboard':
        return <AdminDashboard />;
      default:
        return <StartScreen />;
    }
  };

  const showProgress = ['name', 'survey', 'titles', 'covers'].includes(currentStep);

  return (
    <Layout showProgress={showProgress}>
      {renderCurrentStep()}
    </Layout>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
