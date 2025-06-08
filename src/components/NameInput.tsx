
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function NameInput() {
  const [name, setName] = useState('');
  const { setCurrentUser, setCurrentStep } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        isAdmin: false,
        createdAt: new Date(),
        completedSteps: 1
      };
      setCurrentUser(user);
      setCurrentStep('survey');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Willkommen!</CardTitle>
          <p className="text-gray-600">
            Bitte gib deinen Namen ein, um zu beginnen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={!name.trim()}
            >
              Weiter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
