
import { coverService } from '@/services/supabaseServices';

export const newCoverUrls = [
  '/lovable-uploads/3c479d03-7ac1-4718-a8bd-614567d8a30b.png',
  '/lovable-uploads/a0c563aa-ccb4-411d-b963-e0d252fbe4a0.png',
  '/lovable-uploads/f2798a0b-0feb-4114-a797-4a518e96d5ea.png',
  '/lovable-uploads/cfcff8ae-715c-489e-9a1b-32665e500df8.png',
  '/lovable-uploads/dc3087d1-931a-474d-9866-adddd0349563.png',
  '/lovable-uploads/09f4c8b2-10da-476c-9b43-d2bbe872d313.png',
  '/lovable-uploads/d1b16626-9a89-425c-aa31-f63034abb671.png',
  '/lovable-uploads/b47bf19e-438c-41e5-828b-fbfa3de15eca.png',
  '/lovable-uploads/c42376c1-2625-49eb-8ef9-66872271b400.png',
  '/lovable-uploads/2fe02c1e-cc1e-446e-bc22-8fe979d13eed.png'
];

export const replaceCoversWithNewOnes = async (): Promise<boolean> => {
  try {
    console.log('Starting cover replacement with clean database...');
    
    // The database has already been cleaned via SQL migration
    // Now we just need to force refresh the covers to update the cache
    console.log('Forcing refresh of covers to update cache...');
    await coverService.forceRefreshCovers();
    
    console.log('Cover replacement completed successfully');
    return true;
  } catch (error) {
    console.error('Error in cover replacement:', error);
    return false;
  }
};
