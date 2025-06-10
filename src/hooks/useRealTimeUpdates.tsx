
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export function useRealTimeUpdates() {
  const { refreshRankings, forceRefreshCovers } = useApp();

  useEffect(() => {
    // Set up real-time subscriptions for covers
    const coversChannel = supabase
      .channel('covers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'covers'
        },
        (payload) => {
          console.log('Covers changed:', payload);
          // Trigger refresh with a small delay to ensure consistency
          setTimeout(() => {
            forceRefreshCovers();
          }, 100);
        }
      )
      .subscribe();

    // Set up real-time subscriptions for titles
    const titlesChannel = supabase
      .channel('titles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'titles'
        },
        (payload) => {
          console.log('Titles changed:', payload);
          setTimeout(() => {
            refreshRankings();
          }, 100);
        }
      )
      .subscribe();

    // Set up real-time subscriptions for votes
    const votesChannel = supabase
      .channel('votes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          console.log('New vote:', payload);
          setTimeout(() => {
            refreshRankings();
          }, 100);
        }
      )
      .subscribe();

    // Set up real-time subscriptions for voting rounds
    const roundsChannel = supabase
      .channel('rounds-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voting_rounds'
        },
        (payload) => {
          console.log('Voting rounds changed:', payload);
          setTimeout(() => {
            refreshRankings();
          }, 100);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(coversChannel);
      supabase.removeChannel(titlesChannel);
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(roundsChannel);
    };
  }, [refreshRankings, forceRefreshCovers]);
}
