
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { votingRoundService, titleService, coverService, voteService, surveyService, userService } from '@/services/supabaseServices';
import { replaceCoversWithNewOnes } from '@/utils/coverUpload';
import { AdminStatistics } from './admin/AdminStatistics';
import { ContentManagement } from './admin/ContentManagement';
import { DataManagement } from './admin/DataManagement';
import { VotesLog } from './admin/VotesLog';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { 
    titles, 
    covers, 
    votes, 
    addTitle, 
    addCover, 
    deactivateItem, 
    exportCSV,
    setCurrentStep,
    currentUser,
    refreshRankings,
    forceRefreshCovers
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isStartingNewRound, setIsStartingNewRound] = useState(false);
  const [isReplacingCovers, setIsReplacingCovers] = useState(false);

  useEffect(() => {
    loadCurrentRound();
    handleRefresh();
  }, []);

  const loadCurrentRound = async () => {
    const round = await votingRoundService.getCurrentRound();
    setCurrentRound(round);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Starting comprehensive refresh...');
    
    try {
      console.log('Step 1: Force refreshing covers...');
      await forceRefreshCovers();
      
      console.log('Step 2: Refreshing rankings...');
      await refreshRankings();
      
      console.log('Step 3: Reloading round info...');
      await loadCurrentRound();
      
      console.log('Comprehensive refresh completed successfully');
    } catch (error) {
      console.error('Error during refresh:', error);
      toast.error('Fehler beim Aktualisieren der Daten');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStartNewRound = async () => {
    setIsStartingNewRound(true);
    console.log('Attempting to start new round...');
    const success = await votingRoundService.startNewRound();
    if (success) {
      console.log('New round started successfully');
      await loadCurrentRound();
      await handleRefresh();
      toast.success(`Neue Runde ${currentRound + 1} gestartet`);
    } else {
      console.error('Failed to start new round');
      toast.error('Fehler beim Starten der neuen Runde');
    }
    setIsStartingNewRound(false);
  };

  const handleReplaceCovers = async () => {
    setIsReplacingCovers(true);
    console.log('Starting cover replacement...');
    const success = await replaceCoversWithNewOnes();
    if (success) {
      console.log('Covers replaced successfully, forcing refresh...');
      await handleRefresh();
      toast.success('Cover erfolgreich ersetzt');
    } else {
      console.error('Failed to replace covers');
      toast.error('Fehler beim Ersetzen der Cover');
    }
    setIsReplacingCovers(false);
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      // Create a simple URL for uploaded files
      // In a real app, you'd upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);
      
      // For now, we'll simulate an upload by creating a data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleDeleteItem = async (type: 'title' | 'cover', id: string) => {
    try {
      if (type === 'title') {
        await titleService.deleteTitle(id);
      } else {
        await coverService.deleteCover(id);
      }
      await handleRefresh();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Fehler beim Löschen des ${type === 'title' ? 'Titels' : 'Covers'}`);
    }
  };

  const handleHardReset = async () => {
    try {
      const success = await votingRoundService.hardReset();
      if (success) {
        await handleRefresh();
        toast.success('Hard-Reset erfolgreich durchgeführt');
      } else {
        toast.error('Fehler beim Hard-Reset');
      }
    } catch (error) {
      console.error('Error during hard reset:', error);
      toast.error('Fehler beim Hard-Reset');
    }
  };

  const activeTitles = titles.filter(t => t.isActive);
  const activeCovers = covers.filter(c => c.isActive);
  const totalVotes = votes.length;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Verwaltung der Inhalte und Datenanalyse - Runde {currentRound}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Aktualisierung...' : 'Daten aktualisieren'}
            </Button>
            <Button 
              onClick={() => setCurrentStep('start')}
              variant="outline"
            >
              Zurück zur Startseite
            </Button>
          </div>
        </div>

        <AdminStatistics 
          activeTitlesCount={activeTitles.length}
          activeCoversCount={activeCovers.length}
          totalVotes={totalVotes}
          currentRound={currentRound}
        />

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Inhalte verwalten</TabsTrigger>
            <TabsTrigger value="data">Daten verwalten</TabsTrigger>
            <TabsTrigger value="votes">Stimmen</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <ContentManagement
              titles={titles}
              covers={covers}
              onAddTitle={addTitle}
              onAddCover={addCover}
              onDeactivateItem={deactivateItem}
              onDeleteItem={handleDeleteItem}
              onReplaceCovers={handleReplaceCovers}
              onFileUpload={handleFileUpload}
              isReplacingCovers={isReplacingCovers}
            />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement
              onStartNewRound={handleStartNewRound}
              onHardReset={handleHardReset}
              onDeleteAllVotes={() => voteService.deleteAllVotes()}
              onDeleteAllSurveyAnswers={() => surveyService.deleteAllSurveyAnswers()}
              onDeleteAllUsers={() => userService.deleteAllUsers()}
              onDeleteAllTitles={() => titleService.deleteAllTitles()}
              onDeleteAllCovers={() => coverService.deleteAllCovers()}
              isStartingNewRound={isStartingNewRound}
              currentRound={currentRound}
            />
          </TabsContent>

          <TabsContent value="votes">
            <VotesLog votes={votes} currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Daten exportieren</CardTitle>
                <p className="text-sm text-gray-600">
                  Exportiere verschiedene Datentypen als CSV-Dateien
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => exportCSV('global')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Globales Ranking (CSV)
                  </Button>
                  
                  <Button 
                    onClick={() => exportCSV('local')}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Lokales Ranking (CSV)
                  </Button>
                  
                  <Button 
                    onClick={() => exportCSV('votes')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Alle Stimmen (CSV)
                  </Button>

                  <Button 
                    onClick={() => exportCSV('users')}
                    className="flex items-center gap-2"
                    variant="secondary"
                  >
                    <Download className="w-4 h-4" />
                    Alle Nutzer-Daten (CSV)
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">CSV-Inhalte:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li><strong>Globales Ranking:</strong> Titel/Cover mit globalen Scores und Abstimmungsanzahl (inkl. Runde)</li>
                    <li><strong>Lokales Ranking:</strong> Titel/Cover mit lokalen Scores der aktuellen Session</li>
                    <li><strong>Alle Stimmen:</strong> Vollständiges Log aller Abstimmungen mit Nutzer-Info und Runde</li>
                    <li><strong>Alle Nutzer-Daten:</strong> Nutzer-Profile, Umfrage-Antworten und Abstimmungsstatistiken</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
