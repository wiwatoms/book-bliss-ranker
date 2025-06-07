
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, BarChart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function RankingView() {
  const { titles, covers, setCurrentStep } = useApp();
  const [activeTab, setActiveTab] = useState('titles');

  const sortedTitles = [...titles]
    .filter(t => t.isActive)
    .sort((a, b) => b.globalScore - a.globalScore);

  const sortedCovers = [...covers]
    .filter(c => c.isActive)
    .sort((a, b) => b.globalScore - a.globalScore);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">{index + 1}</div>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 1:
        return 'border-l-4 border-gray-400 bg-gray-50';
      case 2:
        return 'border-l-4 border-amber-600 bg-amber-50';
      default:
        return 'border-l-4 border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
            <BarChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Globale Rankings</h1>
          <p className="text-gray-600">
            Die aktuellen Bewertungsergebnisse aller Teilnehmer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Titel Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Titel-Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedTitles.map((title, index) => (
                  <div 
                    key={title.id}
                    className={`p-4 rounded-lg ${getRankColor(index)} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankIcon(index)}
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {title.text}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {title.voteCount} Bewertungen
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {Math.round(title.globalScore)}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cover Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-blue-500" />
                Cover-Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedCovers.map((cover, index) => (
                  <div 
                    key={cover.id}
                    className={`p-4 rounded-lg ${getRankColor(index)} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankIcon(index)}
                        <div className="flex items-center gap-3">
                          <img 
                            src={cover.imageUrl} 
                            alt={`Cover ${index + 1}`}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Cover #{index + 1}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {cover.voteCount} Bewertungen
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {Math.round(cover.globalScore)}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => setCurrentStep('covers')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Weiter bewerten
          </Button>
        </div>
      </div>
    </div>
  );
}
