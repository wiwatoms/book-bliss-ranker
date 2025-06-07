
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Title, CoverImage, ComparisonPair } from '@/types';

interface ComparisonViewProps {
  type: 'title' | 'cover';
}

export function ComparisonView({ type }: ComparisonViewProps) {
  const { 
    titles, 
    covers, 
    submitVote, 
    setCurrentStep, 
    titleVotingRounds, 
    maxTitleRounds 
  } = useApp();
  
  const [currentPair, setCurrentPair] = useState<ComparisonPair<Title | CoverImage> | null>(null);

  const items = type === 'title' ? titles.filter(t => t.isActive) : covers.filter(c => c.isActive);

  const generateRandomPair = () => {
    if (items.length < 2) return null;
    
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return {
      itemA: shuffled[0],
      itemB: shuffled[1]
    };
  };

  useEffect(() => {
    setCurrentPair(generateRandomPair());
  }, [items.length]);

  const handleVote = (winnerId: string, loserId: string) => {
    submitVote(type, winnerId, loserId);
    setCurrentPair(generateRandomPair());
  };

  const handleViewRankings = () => {
    setCurrentStep('dashboard');
  };

  if (!currentPair) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">
              Nicht genügend {type === 'title' ? 'Titel' : 'Cover'} verfügbar
            </h3>
            <Button onClick={handleViewRankings}>
              Zu den Rankings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isTitle = type === 'title';
  const showProgress = isTitle && titleVotingRounds < maxTitleRounds;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isTitle ? 'Titel-Vergleich' : 'Cover-Vergleich'}
          </h1>
          <p className="text-gray-600">
            {isTitle 
              ? `Welcher Titel gefällt Ihnen besser? (${titleVotingRounds}/${maxTitleRounds})`
              : 'Welches Cover gefällt Ihnen besser?'
            }
          </p>
          {isTitle && showProgress && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(titleVotingRounds / maxTitleRounds) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option A */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => handleVote(currentPair.itemA.id, currentPair.itemB.id)}
          >
            <CardContent className="p-6">
              {isTitle ? (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {(currentPair.itemA as Title).text}
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                  >
                    Diesen Titel wählen
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={(currentPair.itemA as CoverImage).imageUrl} 
                      alt="Cover A"
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                  >
                    Dieses Cover wählen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Option B */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => handleVote(currentPair.itemB.id, currentPair.itemA.id)}
          >
            <CardContent className="p-6">
              {isTitle ? (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {(currentPair.itemB as Title).text}
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-purple-50 group-hover:border-purple-300"
                  >
                    Diesen Titel wählen
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={(currentPair.itemB as CoverImage).imageUrl} 
                      alt="Cover B"
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-purple-50 group-hover:border-purple-300"
                  >
                    Dieses Cover wählen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!isTitle && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleViewRankings}
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900"
            >
              <Eye className="w-4 h-4 mr-2" />
              Rankings anzeigen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
