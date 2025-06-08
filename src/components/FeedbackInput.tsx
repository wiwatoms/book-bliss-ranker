
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ArrowRight, SkipForward } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function FeedbackInput() {
  const { currentUser, setCurrentUser, setCurrentStep } = useApp();
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        feedback: feedback.trim(),
        completedSteps: 5
      };
      setCurrentUser(updatedUser);
    }
    setCurrentStep('ranking');
  };

  const handleSkip = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        completedSteps: 5
      };
      setCurrentUser(updatedUser);
    }
    setCurrentStep('ranking');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl mb-2">Fast geschafft!</CardTitle>
          <p className="text-gray-600">
            Noch etwas, das Dir aufgefallen ist oder Du mitgeben möchtest?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              placeholder="Dein Feedback (optional)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] text-base"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Überspringen
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              Weiter zu den Ergebnissen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
