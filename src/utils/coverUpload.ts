
import { coverService } from '@/services/supabaseServices';

export const newCoverUrls = [
  '/lovable-uploads/22125e5f-725c-4b6b-9738-d3c544a03a90.png',
  '/lovable-uploads/2f95b6e8-e83a-43e9-b5a5-f5b4aac40180.png',
  '/lovable-uploads/4cdf6293-fd36-436f-a79f-78647c3edc33.png',
  '/lovable-uploads/59cf56ab-bb9b-42fa-acb8-29ac889ed9db.png',
  '/lovable-uploads/63aedc2d-1999-403e-9eac-337861cc7005.png',
  '/lovable-uploads/ae9cff41-c9b6-49c9-aba9-c816e89bf1eb.png',
  '/lovable-uploads/b15712d2-ed46-46a2-a635-27163a4e72c9.png',
  '/lovable-uploads/c6e372a2-a91c-4695-9551-c0862fcd0454.png',
  '/lovable-uploads/f7946275-b18b-4765-90d2-afd81005f79e.png',
  '/lovable-uploads/f8f80ad0-569e-4d23-ad54-e2fb8247af42.png'
];

export const replaceCoversWithNewOnes = async (): Promise<boolean> => {
  try {
    return await coverService.replaceAllCovers(newCoverUrls);
  } catch (error) {
    console.error('Error replacing covers:', error);
    return false;
  }
};
