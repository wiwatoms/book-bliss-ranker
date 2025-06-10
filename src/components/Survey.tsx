
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function Survey() {
  const { currentUser, setCurrentUser, setCurrentStep, saveSurveyAnswers } = useApp();
  const [readingHabits, setReadingHabits] = useState<string[]>([]);
  const [interestLevel, setInterestLevel] = useState<number>(5);

  const handleReadingHabitChange = (habit: string, checked: boolean) => {
    if (checked) {
      setReadingHabits(prev => [...prev, habit]);
    } else {
      setReadingHabits(prev => prev.filter(h => h !== habit));
    }
  };

  const handleSubmit = async () => {
    if (currentUser) {
      const surveyAnswers = {
        readingHabits,
        interestLevel
      };

      const updatedUser = {
        ...currentUser,
        surveyAnswers,
        completedSteps: 2
      };

      setCurrentUser(updatedUser);
      await saveSurveyAnswers(surveyAnswers);
    }
    setCurrentStep('titles');
  };

  const readingOptions = [
    'Ich lese sehr wenig',
    'E-Book', 
    'Gedrucktes Buch'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl mb-2">Kurze Umfrage</CardTitle>
          <p className="text-gray-600">
            Hilf uns, dich besser kennenzulernen. Dies dauert nur wenige Sekunden.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label className="text-base font-medium mb-4 block">
              Wie liest du normalerweise? (Mehrfachauswahl möglich)
            </Label>
            <div className="space-y-3">
              {readingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={option}
                    checked={readingHabits.includes(option)}
                    onCheckedChange={(checked) => handleReadingHabitChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">
              Ganz ehrlich: Wie interessiert wärst du, ähnliche Geschichten zu lesen / zu hören? (1 = gar nicht, 10 = sehr)
            </Label>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={interestLevel}
                onChange={(e) => setInterestLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 - Gar nicht</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{interestLevel}</span>
                </div>
                <span>10 - Sehr interessiert</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            disabled={readingHabits.length === 0}
          >
            Weiter zur Bewertung
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
