
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const storageService = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File, bucket: string = 'covers'): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log(`Uploading file: ${fileName} to bucket: ${bucket}`);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('Upload successful, public URL:', publicUrlData.publicUrl);
      
      return { 
        success: true, 
        url: publicUrlData.publicUrl 
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown upload error' 
      };
    }
  },

  /**
   * Delete a file from Supabase Storage by extracting filename from URL
   */
  async deleteFile(url: string, bucket: string = 'covers'): Promise<boolean> {
    try {
      // Extract filename from Supabase Storage URL
      // URL format: https://project.supabase.co/storage/v1/object/public/bucket/filename
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log(`Attempting to delete file: ${fileName} from bucket: ${bucket}`);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      console.log('File deleted successfully from storage');
      return true;
    } catch (error) {
      console.error('Storage delete error:', error);
      return false;
    }
  },

  /**
   * Delete multiple files from Supabase Storage
   */
  async deleteFiles(urls: string[], bucket: string = 'covers'): Promise<boolean> {
    try {
      // Extract filenames from URLs
      const fileNames = urls.map(url => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      }).filter(fileName => fileName && fileName.length > 0);
      
      if (fileNames.length === 0) {
        console.log('No valid filenames to delete');
        return true;
      }
      
      console.log(`Deleting files: ${fileNames.join(', ')} from bucket: ${bucket}`);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove(fileNames);

      if (error) {
        console.error('Bulk delete error:', error);
        return false;
      }

      console.log('Files deleted successfully from storage');
      return true;
    } catch (error) {
      console.error('Storage bulk delete error:', error);
      return false;
    }
  }
};
