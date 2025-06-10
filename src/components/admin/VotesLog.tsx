
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, User } from '@/types';

interface VotesLogProps {
  votes: Vote[];
  currentUser: User | null;
}

export function VotesLog({ votes, currentUser }: VotesLogProps) {
  const getUserName = (userId: string) => {
    if (userId === 'admin') return 'Administrator';
    if (currentUser && userId === currentUser.id) return currentUser.name;
    return `User ${userId.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stimmen-Log (letzte 20)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {votes.slice(-20).reverse().map((vote) => (
            <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {vote.itemType === 'title' ? 'Titel' : 'Cover'} Bewertung
                </p>
                <p className="text-sm text-gray-600">
                  Nutzer: {getUserName(vote.userId)} | Gewinner: {vote.winnerItemId.slice(-4)} | Verlierer: {vote.loserItemId.slice(-4)}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(vote.timestamp).toLocaleDateString('de-DE')} {new Date(vote.timestamp).toLocaleTimeString('de-DE')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
