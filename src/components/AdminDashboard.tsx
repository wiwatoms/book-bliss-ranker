
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
    try {
      const round = await votingRoundService.getCurrentRound();
      setCurrentRound(round);
    } catch (error) {
      console.error('Error loading current round:', error);
    }
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
      toast.success('Daten erfolgreich aktualisiert');
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
    try {
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
    } catch (error) {
      console.error('Error starting new round:', error);
      toast.error('Fehler beim Starten der neuen Runde');
    } finally {
      setIsStartingNewRound(false);
    }
  };

  const handleReplaceCovers = async () => {
    setIsReplacingCovers(true);
    console.log('Starting cover replacement...');
    try {
      const success = await replaceCoversWithNewOnes();
      if (success) {
        console.log('Covers replaced successfully, forcing refresh...');
        await handleRefresh();
        toast.success('Cover erfolgreich ersetzt');
      } else {
        console.error('Failed to replace covers');
        toast.error('Fehler beim Ersetzen der Cover');
      }
    } catch (error) {
      console.error('Error replacing covers:', error);
      toast.error('Fehler beim Ersetzen der Cover');
    } finally {
      setIsReplacingCovers(false);
    }
  };

  const handleDeleteItem = async (type: 'title' | 'cover', id: string) => {
    try {
      console.log(`Attempting to delete ${type} with id: ${id}`);
      
      if (type === 'title') {
        const success = await titleService.deleteTitle(id);
        if (!success) {
          throw new Error('Failed to delete title');
        }
      } else {
        const success = await coverService.deleteCover(id);
        if (!success) {
          throw new Error('Failed to delete cover');
        }
      }
      
      console.log(`Successfully deleted ${type}: ${id}`);
      await handleRefresh();
      toast.success(`${type === 'title' ? 'Titel' : 'Cover'} erfolgreich gelöscht`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Fehler beim Löschen des ${type === 'title' ? 'Titels' : 'Covers'}`);
    }
  };

  const handleHardReset = async () => {
    try {
      console.log('Starting hard reset...');
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

  // Wrapper functions to convert Promise<boolean> to Promise<void>
  const handleDeleteAllVotes = async (): Promise<void> => {
    try {
      console.log('Deleting all votes...');
      const success = await voteService.deleteAllVotes();
      if (success) {
        await handleRefresh();
        toast.success('Alle Stimmen gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Stimmen');
      }
    } catch (error) {
      console.error('Error deleting votes:', error);
      toast.error('Fehler beim Löschen der Stimmen');
    }
  };

  const handleDeleteAllSurveyAnswers = async (): Promise<void> => {
    try {
      console.log('Deleting all survey answers...');
      const success = await surveyService.deleteAllSurveyAnswers();
      if (success) {
        await handleRefresh();
        toast.success('Alle Umfrageantworten gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Umfrageantworten');
      }
    } catch (error) {
      console.error('Error deleting survey answers:', error);
      toast.error('Fehler beim Löschen der Umfrageantworten');
    }
  };

  const handleDeleteAllUsers = async (): Promise<void> => {
    try {
      console.log('Deleting all users...');
      const success = await userService.deleteAllUsers();
      if (success) {
        await handleRefresh();
        toast.success('Alle Nutzer gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Nutzer');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Fehler beim Löschen der Nutzer');
    }
  };

  const handleDeleteAllTitles = async (): Promise<void> => {
    try {
      console.log('Deleting all titles...');
      const success = await titleService.deleteAllTitles();
      if (success) {
        await handleRefresh();
        toast.success('Alle Titel gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Titel');
      }
    } catch (error) {
      console.error('Error deleting titles:', error);
      toast.error('Fehler beim Löschen der Titel');
    }
  };

  const handleDeleteAllCovers = async (): Promise<void> => {
    try {
      console.log('Deleting all covers...');
      const success = await coverService.deleteAllCovers();
      if (success) {
        await handleRefresh();
        toast.success('Alle Cover gelöscht');
      } else {
        toast.error('Fehler beim Löschen der Cover');
      }
    } catch (error) {
      console.error('Error deleting covers:', error);
      toast.error('Fehler beim Löschen der Cover');
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
          <TabsList className="grid w-full grid-cols-4">
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
              isReplacingCovers={isReplacingCovers}
            />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement
              onStartNewRound={handleStartNewRound}
              onHardReset={handleHardReset}
              onDeleteAllVotes={handleDeleteAllVotes}
              onDeleteAllSurveyAnswers={handleDeleteAllSurveyAnswers}
              onDeleteAllUsers={handleDeleteAllUsers}
              onDeleteAllTitles={handleDeleteAllTitles}
              onDeleteAllCovers={handleDeleteAllCovers}
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
