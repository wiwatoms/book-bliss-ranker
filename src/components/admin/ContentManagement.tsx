
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Title, CoverImage } from '@/types';

interface ContentManagementProps {
  titles: Title[];
  covers: CoverImage[];
  onAddTitle: (title: string) => Promise<void>;
  onAddCover: (url: string) => Promise<void>;
  onDeactivateItem: (type: 'title' | 'cover', id: string) => Promise<void>;
  onReplaceCovers: () => Promise<void>;
  isReplacingCovers: boolean;
}

export function ContentManagement({
  titles,
  covers,
  onAddTitle,
  onAddCover,
  onDeactivateItem,
  onReplaceCovers,
  isReplacingCovers
}: ContentManagementProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const handleAddTitle = async () => {
    if (newTitle.trim()) {
      await onAddTitle(newTitle.trim());
      setNewTitle('');
    }
  };

  const handleAddCover = async () => {
    if (newCoverUrl.trim()) {
      await onAddCover(newCoverUrl.trim());
      setNewCoverUrl('');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Titel Management */}
      <Card>
        <CardHeader>
          <CardTitle>Titel verwalten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Neuen Titel eingeben..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button onClick={handleAddTitle} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {titles.map((title) => (
              <div 
                key={title.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  title.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{title.text}</p>
                  <p className="text-sm text-gray-600">
                    Global Score: {Math.round(title.globalScore)} | Votes: {title.voteCount}
                  </p>
                </div>
                {title.isActive && (
                  <Button 
                    onClick={() => onDeactivateItem('title', title.id)}
                    size="sm" 
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Management */}
      <Card>
        <CardHeader>
          <CardTitle>Cover verwalten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Cover-URL eingeben..."
              value={newCoverUrl}
              onChange={(e) => setNewCoverUrl(e.target.value)}
            />
            <Button onClick={handleAddCover} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            onClick={onReplaceCovers}
            className="w-full"
            variant="outline"
            disabled={isReplacingCovers}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isReplacingCovers ? 'Ersetze Cover...' : 'Cover durch neue ersetzen'}
          </Button>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {covers.map((cover) => (
              <div 
                key={cover.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  cover.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <img 
                    src={cover.imageUrl} 
                    alt="Cover"
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      Global Score: {Math.round(cover.globalScore)} | Votes: {cover.voteCount}
                    </p>
                  </div>
                </div>
                {cover.isActive && (
                  <Button 
                    onClick={() => onDeactivateItem('cover', cover.id)}
                    size="sm" 
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
