
import { coverService } from '@/services/supabaseServices';

export const newCoverUrls = [
  '/lovable-uploads/9f143092-f4d7-497b-9627-f903251abdb6.png',
  '/lovable-uploads/44b2e1b2-433c-474b-a66d-4aa780e46569.png',
  '/lovable-uploads/4d66823d-31c6-4f35-8550-90f31af71d49.png',
  '/lovable-uploads/2b1e421c-cdfa-47a9-b16b-854196c8ab39.png',
  '/lovable-uploads/9c45bfd4-0031-4204-847e-ee4b57fb0200.png',
  '/lovable-uploads/40b47248-ef40-424e-ad2b-3efeee28666c.png',
  '/lovable-uploads/afd81cd9-8e79-494d-9c22-00453cc48917.png',
  '/lovable-uploads/1f98e421-c047-468a-8657-175c4f548786.png',
  '/lovable-uploads/20277e10-9730-41e5-8642-92738a00c064.png',
  '/lovable-uploads/04ab7ac2-7fde-4fbe-a32b-469214c3e8bd.png'
];

export const replaceCoversWithNewOnes = async (): Promise<boolean> => {
  try {
    return await coverService.replaceAllCovers(newCoverUrls);
  } catch (error) {
    console.error('Error replacing covers:', error);
    return false;
  }
};
