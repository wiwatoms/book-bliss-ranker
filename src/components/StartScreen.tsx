
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function StartScreen() {
  const { setCurrentStep } = useApp();

  const handleStartAsUser = () => {
    setCurrentStep('name');
  };

  const handleAdminLogin = () => {
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image & Title Ranker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bewerten Sie Buchtitel und Cover-Bilder durch spielerische paarweise Vergleiche.
            Helfen Sie dabei, die attraktivsten Designs zu ermitteln!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200" onClick={handleStartAsUser}>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Als Bewerter starten</h3>
              <p className="text-gray-600 mb-6">
                Nehmen Sie an der Bewertung teil und helfen Sie dabei, die besten Titel und Cover zu finden.
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200" onClick={handleAdminLogin}>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin-Login</h3>
              <p className="text-gray-600 mb-6">
                Verwalten Sie Inhalte, analysieren Sie Daten und exportieren Sie Ergebnisse.
              </p>
              <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                Admin-Bereich
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Einfache Schritte</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Titel-Vergleiche</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Cover-Bewertungen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
