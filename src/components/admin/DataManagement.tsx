
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RotateCcw, Trash2, AlertTriangle, Database } from 'lucide-react';
import { toast } from 'sonner';

interface DataManagementProps {
  onStartNewRound: () => Promise<void>;
  onHardReset: () => Promise<void>;
  onDeleteAllVotes: () => Promise<void>;
  onDeleteAllSurveyAnswers: () => Promise<void>;
  onDeleteAllUsers: () => Promise<void>;
  onDeleteAllTitles: () => Promise<void>;
  onDeleteAllCovers: () => Promise<void>;
  isStartingNewRound: boolean;
  currentRound: number;
}

export function DataManagement({
  onStartNewRound,
  onHardReset,
  onDeleteAllVotes,
  onDeleteAllSurveyAnswers,
  onDeleteAllUsers,
  onDeleteAllTitles,
  onDeleteAllCovers,
  isStartingNewRound,
  currentRound
}: DataManagementProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteAction = async (action: () => Promise<void>, successMessage: string) => {
    setIsProcessing(true);
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      toast.error('Fehler beim Löschen der Daten');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voting Round Management */}
      <Card>
        <CardHeader>
          <CardTitle>Abstimmungsrunden-Verwaltung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Aktuelle Runde: {currentRound}</h4>
            <p className="text-sm text-blue-800">
              Eine neue Runde startet setzt alle globalen Rankings zurück, aber behält alle historischen Daten.
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Neue Abstimmungsrunde starten
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Abstimmungsrunde starten</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Dies startet Runde {currentRound + 1} und setzt alle globalen Rankings zurück. 
                  Alle bisherigen Stimmen bleiben erhalten und werden in den CSV-Exporten nach Runden getrennt.
                </p>
                <div className="flex gap-2 justify-end">
                  <DialogTrigger asChild>
                    <Button variant="outline">Abbrechen</Button>
                  </DialogTrigger>
                  <Button 
                    onClick={onStartNewRound}
                    disabled={isStartingNewRound}
                  >
                    {isStartingNewRound ? 'Starte neue Runde...' : 'Neue Runde starten'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Granular Data Deletion */}
      <Card>
        <CardHeader>
          <CardTitle>Daten selektiv löschen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alle Stimmen löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alle Stimmen löschen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dies löscht alle Abstimmungsdaten permanent. Rankings werden zurückgesetzt.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Abbrechen</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteAction(onDeleteAllVotes, 'Alle Stimmen gelöscht')}
                      >
                        Stimmen löschen
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alle Umfrage-Antworten löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alle Umfrage-Antworten löschen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dies löscht alle Umfrage-Daten permanent.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Abbrechen</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteAction(onDeleteAllSurveyAnswers, 'Alle Umfrage-Antworten gelöscht')}
                      >
                        Umfragen löschen
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alle Nutzer löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alle Nutzer löschen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dies löscht alle Nutzer-Profile permanent.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Abbrechen</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteAction(onDeleteAllUsers, 'Alle Nutzer gelöscht')}
                      >
                        Nutzer löschen
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alle Titel löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alle Titel löschen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dies löscht alle Titel permanent.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Abbrechen</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteAction(onDeleteAllTitles, 'Alle Titel gelöscht')}
                      >
                        Titel löschen
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alle Cover löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alle Cover löschen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dies löscht alle Cover permanent.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Abbrechen</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteAction(onDeleteAllCovers, 'Alle Cover gelöscht')}
                      >
                        Cover löschen
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Complete Reset */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Kompletter Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Kompletter Hard-Reset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kompletter Hard-Reset bestätigen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ ACHTUNG: Diese Aktion ist IRREVERSIBEL!</p>
                </div>
                <p className="text-gray-600">
                  Ein Hard-Reset löscht ALLE Daten:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Alle Stimmen und Abstimmungsrunden</li>
                  <li>Alle Umfrage-Antworten</li>
                  <li>Resettet alle Scores auf Standardwerte</li>
                  <li>Erstellt eine neue Runde 1</li>
                </ul>
                <p className="text-sm text-gray-500">
                  Titel, Cover und Nutzer-Profile bleiben erhalten.
                </p>
                <div className="flex gap-2 justify-end">
                  <DialogTrigger asChild>
                    <Button variant="outline">Abbrechen</Button>
                  </DialogTrigger>
                  <Button 
                    variant="destructive"
                    onClick={onHardReset}
                    disabled={isProcessing}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Reset läuft...' : 'Hard-Reset durchführen'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
