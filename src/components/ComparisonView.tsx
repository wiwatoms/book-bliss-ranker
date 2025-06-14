
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
    maxTitleRounds,
    coverVotingRounds,
    maxCoverRounds
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
  const currentRounds = isTitle ? titleVotingRounds : coverVotingRounds;
  const maxRounds = isTitle ? maxTitleRounds : maxCoverRounds;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {isTitle ? 'Titel-Vergleich' : 'Cover-Vergleich'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isTitle 
              ? `Welcher Titel gefällt Ihnen besser? (${currentRounds}/${maxRounds})`
              : `Welches Cover gefällt Ihnen besser? (${currentRounds}/${maxRounds})`
            }
          </p>
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentRounds / maxRounds) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile optimized layout for covers */}
        {!isTitle ? (
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 max-w-4xl mx-auto">
            {/* Option A - Mobile first */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleVote(currentPair.itemA.id, currentPair.itemB.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={(currentPair.itemA as CoverImage).imageUrl} 
                      alt="Cover A"
                      className="w-full h-64 md:h-96 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                  >
                    Dieses Cover wählen (A)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Option B - Mobile first */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleVote(currentPair.itemB.id, currentPair.itemA.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={(currentPair.itemB as CoverImage).imageUrl} 
                      alt="Cover B"
                      className="w-full h-64 md:h-96 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-purple-50 group-hover:border-purple-300"
                  >
                    Dieses Cover wählen (B)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Desktop layout for titles */
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option A */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleVote(currentPair.itemA.id, currentPair.itemB.id)}
            >
              <CardContent className="p-6">
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
              </CardContent>
            </Card>

            {/* Option B */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleVote(currentPair.itemB.id, currentPair.itemA.id)}
            >
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-6 md:mt-8">
          <Button 
            onClick={handleViewRankings}
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="w-4 h-4 mr-2" />
            Rankings anzeigen
          </Button>
        </div>

        {/* Mobile helper text for covers */}
        {!isTitle && (
          <div className="text-center mt-4 text-sm text-gray-500 md:hidden">
            Scrollen Sie nach unten um das zweite Cover zu sehen
          </div>
        )}
      </div>
    </div>
  );
}
