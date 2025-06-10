
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCw, RotateCcw, Trash2, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { votingRoundService } from '@/services/supabaseServices';
import { replaceCoversWithNewOnes } from '@/utils/coverUpload';
import { AdminStatistics } from './admin/AdminStatistics';
import { ContentManagement } from './admin/ContentManagement';
import { VotesLog } from './admin/VotesLog';

export function AdminDashboard() {
  const { 
    titles, 
    covers, 
    votes, 
    addTitle, 
    addCover, 
    deactivateItem, 
    resetData, 
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
  }, []);

  const loadCurrentRound = async () => {
    const round = await votingRoundService.getCurrentRound();
    setCurrentRound(round);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Starting comprehensive refresh...');
    
    // Force refresh covers specifically
    await forceRefreshCovers();
    
    // Then refresh rankings
    await refreshRankings();
    await loadCurrentRound();
    
    console.log('Comprehensive refresh completed');
    setIsRefreshing(false);
  };

  const handleStartNewRound = async () => {
    setIsStartingNewRound(true);
    console.log('Attempting to start new round...');
    const success = await votingRoundService.startNewRound();
    if (success) {
      console.log('New round started successfully');
      await loadCurrentRound();
      await handleRefresh(); // Use the improved refresh
    } else {
      console.error('Failed to start new round');
    }
    setIsStartingNewRound(false);
  };

  const handleReplaceCovers = async () => {
    setIsReplacingCovers(true);
    console.log('Starting comprehensive cover replacement...');
    const success = await replaceCoversWithNewOnes();
    if (success) {
      console.log('Covers replaced successfully, forcing refresh...');
      await handleRefresh(); // Use the improved refresh
    } else {
      console.error('Failed to replace covers');
    }
    setIsReplacingCovers(false);
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
            <TabsTrigger value="votes">Stimmen</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <ContentManagement
              titles={titles}
              covers={covers}
              onAddTitle={addTitle}
              onAddCover={addCover}
              onDeactivateItem={deactivateItem}
              onReplaceCovers={handleReplaceCovers}
              isReplacingCovers={isReplacingCovers}
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 w-full">
                      <RotateCcw className="w-4 h-4" />
                      Neue Abstimmungsrunde starten
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Neue Abstimmungsrunde starten</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Dies startet eine neue Abstimmungsrunde und setzt alle globalen Rankings zurück. 
                        Alle bisherigen Stimmen bleiben erhalten und werden in den CSV-Exporten nach Runden getrennt.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <DialogTrigger asChild>
                          <Button variant="outline">Abbrechen</Button>
                        </DialogTrigger>
                        <Button 
                          onClick={handleStartNewRound}
                          disabled={isStartingNewRound}
                        >
                          {isStartingNewRound ? 'Starte neue Runde...' : 'Neue Runde starten'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2 w-full">
                      <Trash2 className="w-4 h-4" />
                      Daten-Reset durchführen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Daten-Reset bestätigen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Diese Aktion wird alle aktiven Cover als inaktiv markieren. 
                        Titel, Nutzer-Daten und das Stimmen-Log bleiben erhalten.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <DialogTrigger asChild>
                          <Button variant="outline">Abbrechen</Button>
                        </DialogTrigger>
                        <Button 
                          variant="destructive" 
                          onClick={resetData}
                        >
                          Reset durchführen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
