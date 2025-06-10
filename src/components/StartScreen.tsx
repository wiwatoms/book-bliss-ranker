
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, ArrowRight, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { User } from '@/types';

export function StartScreen() {
  const { setCurrentUser, setCurrentStep } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleStartRating = () => {
    setCurrentStep('name');
  };

  const handleAdminLogin = () => {
    if (username === 'tom' && password === 'datteln') {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrator',
        isAdmin: true,
        createdAt: new Date(),
        completedSteps: 4
      };
      setCurrentUser(adminUser);
      setCurrentStep('dashboard');
    } else {
      alert('Ungültige Anmeldedaten');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-4">
            Deine Meinung ist mir wichtig!
          </CardTitle>
          <p className="text-lg text-gray-600">
            Für mein Buchprojekt bitte ich um dein Feedback zu Titel und Cover. Danke!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showAdminLogin ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Wie funktioniert es?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
                    <span>Kurze Umfrage zu deinen Lesegewohnheiten</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
                    <span>12 Titel-Vergleiche bewerten</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
                    <span>12 Cover-Vergleiche bewerten</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
                    <span>Deine persönlichen und globalen Rankings ansehen</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleStartRating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
              >
                Als Bewerter starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAdminLogin(!showAdminLogin)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Settings className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">Admin-Login</h3>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Benutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdminLogin} className="flex-1">
                    Anmelden
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
