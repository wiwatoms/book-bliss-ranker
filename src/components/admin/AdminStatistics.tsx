
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ImageIcon, BarChart3, Users } from 'lucide-react';

interface AdminStatisticsProps {
  activeTitlesCount: number;
  activeCoversCount: number;
  totalVotes: number;
  currentRound: number;
}

export function AdminStatistics({ 
  activeTitlesCount, 
  activeCoversCount, 
  totalVotes, 
  currentRound 
}: AdminStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Titel</p>
              <p className="text-2xl font-bold text-gray-900">{activeTitlesCount}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Cover</p>
              <p className="text-2xl font-bold text-gray-900">{activeCoversCount}</p>
            </div>
            <ImageIcon className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gesamt Stimmen</p>
              <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abstimmungsrunde</p>
              <p className="text-2xl font-bold text-gray-900">{currentRound}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
