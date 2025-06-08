
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  BarChart3, 
  Users,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

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
    currentUser
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const handleAddTitle = () => {
    if (newTitle.trim()) {
      addTitle(newTitle.trim());
      setNewTitle('');
    }
  };

  const handleAddCover = () => {
    if (newCoverUrl.trim()) {
      addCover(newCoverUrl.trim());
      setNewCoverUrl('');
    }
  };

  const activeTitles = titles.filter(t => t.isActive);
  const activeCovers = covers.filter(c => c.isActive);
  const totalVotes = votes.length;

  // Get user name from vote ID (simple mapping for demo)
  const getUserName = (userId: string) => {
    if (userId === 'admin') return 'Administrator';
    if (currentUser && userId === currentUser.id) return currentUser.name;
    return `User ${userId.slice(-4)}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Verwaltung der Inhalte und Datenanalyse</p>
          </div>
          <Button 
            onClick={() => setCurrentStep('start')}
            variant="outline"
          >
            Zurück zur Startseite
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktive Titel</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTitles.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktive Cover</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCovers.length}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gesamt Stimmen</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktive Nutzer</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Inhalte verwalten</TabsTrigger>
            <TabsTrigger value="votes">Stimmen</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Titel Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Titel verwalten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Neuen Titel eingeben..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <Button onClick={handleAddTitle} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {titles.map((title) => (
                      <div 
                        key={title.id} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          title.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{title.text}</p>
                          <p className="text-sm text-gray-600">
                            Score: {Math.round(title.globalScore)} | Votes: {title.voteCount}
                          </p>
                        </div>
                        {title.isActive && (
                          <Button 
                            onClick={() => deactivateItem('title', title.id)}
                            size="sm" 
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cover Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover verwalten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cover-URL eingeben..."
                      value={newCoverUrl}
                      onChange={(e) => setNewCoverUrl(e.target.value)}
                    />
                    <Button onClick={handleAddCover} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {covers.map((cover) => (
                      <div 
                        key={cover.id} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          cover.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <img 
                            src={cover.imageUrl} 
                            alt="Cover"
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm text-gray-600">
                              Score: {Math.round(cover.globalScore)} | Votes: {cover.voteCount}
                            </p>
                          </div>
                        </div>
                        {cover.isActive && (
                          <Button 
                            onClick={() => deactivateItem('cover', cover.id)}
                            size="sm" 
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="votes">
            <Card>
              <CardHeader>
                <CardTitle>Stimmen-Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {votes.slice(-20).reverse().map((vote) => (
                    <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {vote.itemType === 'title' ? 'Titel' : 'Cover'} Bewertung
                        </p>
                        <p className="text-sm text-gray-600">
                          Nutzer: {getUserName(vote.userId)} | Gewinner: {vote.winnerItemId} | Verlierer: {vote.loserItemId}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(vote.timestamp).toLocaleDateString('de-DE')} {new Date(vote.timestamp).toLocaleTimeString('de-DE')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Daten exportieren</CardTitle>
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
                    onClick={() => exportCSV('votes')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Stimmen-Log (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
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
                        Diese Aktion wird alle globalen Cover als inaktiv markieren und das Stimmen-Log löschen. 
                        Private Nutzerdaten bleiben erhalten.
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
