
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Upload, AlertTriangle } from 'lucide-react';
import { Title, CoverImage } from '@/types';
import { FileUpload } from './FileUpload';
import { toast } from 'sonner';

interface ContentManagementProps {
  titles: Title[];
  covers: CoverImage[];
  onAddTitle: (title: string) => Promise<void>;
  onAddCover: (url: string) => Promise<void>;
  onDeactivateItem: (type: 'title' | 'cover', id: string) => Promise<void>;
  onDeleteItem: (type: 'title' | 'cover', id: string) => Promise<void>;
  onReplaceCovers: () => Promise<void>;
  onFileUpload: (file: File) => Promise<string | null>;
  isReplacingCovers: boolean;
}

export function ContentManagement({
  titles,
  covers,
  onAddTitle,
  onAddCover,
  onDeactivateItem,
  onDeleteItem,
  onReplaceCovers,
  onFileUpload,
  isReplacingCovers
}: ContentManagementProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const handleAddTitle = async () => {
    if (newTitle.trim()) {
      await onAddTitle(newTitle.trim());
      setNewTitle('');
      toast.success('Titel hinzugefügt');
    }
  };

  const handleAddCover = async () => {
    if (newCoverUrl.trim()) {
      await onAddCover(newCoverUrl.trim());
      setNewCoverUrl('');
      toast.success('Cover hinzugefügt');
    }
  };

  const handleDeleteTitle = async (id: string) => {
    await onDeleteItem('title', id);
    toast.success('Titel gelöscht');
  };

  const handleDeleteCover = async (id: string) => {
    await onDeleteItem('cover', id);
    toast.success('Cover gelöscht');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Titel Management */}
      <Card>
        <CardHeader>
          <CardTitle>Titel verwalten ({titles.filter(t => t.isActive).length} aktiv)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Neuen Titel eingeben..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
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
                <div className="flex gap-1">
                  {title.isActive && (
                    <Button 
                      onClick={() => onDeactivateItem('title', title.id)}
                      size="sm" 
                      variant="outline"
                      title="Deaktivieren"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        title="Permanent löschen"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Titel permanent löschen</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Möchten Sie den Titel "{title.text}" permanent löschen? 
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="flex gap-2 justify-end">
                          <DialogTrigger asChild>
                            <Button variant="outline">Abbrechen</Button>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDeleteTitle(title.id)}
                            >
                              Permanent löschen
                            </Button>
                          </DialogTrigger>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Management */}
      <Card>
        <CardHeader>
          <CardTitle>Cover verwalten ({covers.filter(c => c.isActive).length} aktiv)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Datei hochladen</h4>
            <FileUpload 
              onFileUpload={onFileUpload}
              onAddCover={onAddCover}
              disabled={isReplacingCovers}
            />
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Cover-URL eingeben..."
              value={newCoverUrl}
              onChange={(e) => setNewCoverUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCover()}
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
                <div className="flex gap-1">
                  {cover.isActive && (
                    <Button 
                      onClick={() => onDeactivateItem('cover', cover.id)}
                      size="sm" 
                      variant="outline"
                      title="Deaktivieren"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        title="Permanent löschen"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cover permanent löschen</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Möchten Sie dieses Cover permanent löschen? 
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="flex gap-2 justify-end">
                          <DialogTrigger asChild>
                            <Button variant="outline">Abbrechen</Button>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDeleteCover(cover.id)}
                            >
                              Permanent löschen
                            </Button>
                          </DialogTrigger>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
