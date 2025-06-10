
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string | null>;
  onAddCover: (url: string) => Promise<void>;
  disabled?: boolean;
}

export function FileUpload({ onFileUpload, onAddCover, disabled }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Bitte wählen Sie eine Bilddatei aus');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Datei ist zu groß (max. 5MB)');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Bitte wählen Sie eine Datei aus');
      return;
    }

    setIsUploading(true);
    try {
      const url = await onFileUpload(selectedFile);
      if (url) {
        await onAddCover(url);
        toast.success('Cover erfolgreich hochgeladen');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        toast.error('Fehler beim Hochladen der Datei');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen der Datei');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          id="cover-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="flex-1"
        />
        {selectedFile && (
          <Button
            onClick={clearFile}
            size="sm"
            variant="outline"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {selectedFile && (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600 truncate">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </span>
          <Button
            onClick={handleUpload}
            size="sm"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Hochladen...' : 'Hochladen'}
          </Button>
        </div>
      )}
    </div>
  );
}
