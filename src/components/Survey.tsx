
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ClipboardList } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { SurveyAnswers } from '@/types';

export function Survey() {
  const [readingHabits, setReadingHabits] = useState<string[]>([]);
  const [interestLevel, setInterestLevel] = useState([5]);
  const { currentUser, setCurrentUser, setCurrentStep } = useApp();

  const readingOptions = [
    { id: 'none', label: 'Nein/kaum' },
    { id: 'ebook', label: 'E-Book' },
    { id: 'printed', label: 'Gedruckt' }
  ];

  const handleReadingHabitChange = (optionId: string, checked: boolean) => {
    if (checked) {
      if (readingHabits.length < 2) {
        setReadingHabits(prev => [...prev, optionId]);
      }
    } else {
      setReadingHabits(prev => prev.filter(id => id !== optionId));
    }
  };

  const handleSubmit = () => {
    if (currentUser && readingHabits.length > 0) {
      const surveyAnswers: SurveyAnswers = {
        readingHabits,
        interestLevel: interestLevel[0]
      };
      
      const updatedUser = {
        ...currentUser,
        surveyAnswers,
        completedSteps: 2
      };
      
      setCurrentUser(updatedUser);
      setCurrentStep('titles');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Kurze Umfrage</CardTitle>
          <p className="text-gray-600">
            Zwei kurze Fragen zu Ihren Lesegewohnheiten
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              1. Liest Du Literatur / Belletristik?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              (Maximal 2 Antworten möglich)
            </p>
            <div className="space-y-3">
              {readingOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={readingHabits.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleReadingHabitChange(option.id, checked as boolean)
                    }
                    disabled={!readingHabits.includes(option.id) && readingHabits.length >= 2}
                  />
                  <label htmlFor={option.id} className="text-sm font-medium">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              2. Würdest Du noch mehr ähnliche Geschichten lesen / hören wollen?
            </h3>
            <div className="space-y-4">
              <Slider
                value={interestLevel}
                onValueChange={setInterestLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 (Gar nicht)</span>
                <span className="font-semibold">Aktuell: {interestLevel[0]}</span>
                <span>10 (Sehr gerne)</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            disabled={readingHabits.length === 0}
          >
            Weiter zur Titel-Bewertung
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
