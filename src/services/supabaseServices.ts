import { supabase } from '@/integrations/supabase/client';
import { User, Title, CoverImage, Vote, SurveyAnswers } from '@/types';
import { storageService } from './storageService';

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          is_admin: userData.isAdmin,
          completed_steps: userData.completedSteps,
          feedback: userData.feedback
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        isAdmin: data.is_admin,
        createdAt: new Date(data.created_at),
        completedSteps: data.completed_steps,
        feedback: data.feedback
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          completed_steps: updates.completedSteps,
          feedback: updates.feedback
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return false;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data.map(user => ({
        id: user.id,
        name: user.name,
        isAdmin: user.is_admin,
        createdAt: new Date(user.created_at),
        completedSteps: user.completed_steps,
        feedback: user.feedback
      }));
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  },

  async deleteAllUsers(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error deleting all users:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteAllUsers:', error);
      return false;
    }
  }
};

export const surveyService = {
  async saveSurveyAnswers(userId: string, answers: SurveyAnswers): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('survey_answers')
        .insert([{
          user_id: userId,
          reading_habits: answers.readingHabits,
          interest_level: answers.interestLevel
        }]);

      if (error) {
        console.error('Error saving survey answers:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in saveSurveyAnswers:', error);
      return false;
    }
  },

  async deleteAllSurveyAnswers(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('survey_answers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error deleting all survey answers:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteAllSurveyAnswers:', error);
      return false;
    }
  }
};

export const titleService = {
  async getAllTitles(): Promise<Title[]> {
    try {
      const { data, error } = await supabase
        .from('titles')
        .select('*')
        .order('global_score', { ascending: false });

      if (error) {
        console.error('Error fetching titles:', error);
        return [];
      }

      return data.map(title => ({
        id: title.id,
        text: title.text,
        globalScore: Number(title.global_score),
        localScore: 1000,
        isActive: title.is_active,
        voteCount: title.vote_count
      }));
    } catch (error) {
      console.error('Error in getAllTitles:', error);
      return [];
    }
  },

  async updateTitleScore(titleId: string, newScore: number, voteCount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('titles')
        .update({
          global_score: newScore,
          vote_count: voteCount
        })
        .eq('id', titleId);

      if (error) {
        console.error('Error updating title score:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in updateTitleScore:', error);
      return false;
    }
  },

  async addTitle(text: string): Promise<Title | null> {
    try {
      const { data, error } = await supabase
        .from('titles')
        .insert([{ text }])
        .select()
        .single();

      if (error) {
        console.error('Error adding title:', error);
        return null;
      }

      return {
        id: data.id,
        text: data.text,
        globalScore: Number(data.global_score),
        localScore: 1000,
        isActive: data.is_active,
        voteCount: data.vote_count
      };
    } catch (error) {
      console.error('Error in addTitle:', error);
      return null;
    }
  },

  async deactivateTitle(titleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('titles')
        .update({ is_active: false })
        .eq('id', titleId);

      if (error) {
        console.error('Error deactivating title:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deactivateTitle:', error);
      return false;
    }
  },

  async deleteTitle(titleId: string): Promise<boolean> {
    try {
      // First delete all votes related to this title
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .or(`winner_item_id.eq.${titleId},loser_item_id.eq.${titleId}`);

      if (votesError) {
        console.error('Error deleting title votes:', votesError);
      }

      // Then delete the title
      const { error } = await supabase
        .from('titles')
        .delete()
        .eq('id', titleId);

      if (error) {
        console.error('Error deleting title:', error);
        return false;
      }
      
      console.log('Title deleted successfully:', titleId);
      return true;
    } catch (error) {
      console.error('Error in deleteTitle:', error);
      return false;
    }
  },

  async deleteAllTitles(): Promise<boolean> {
    try {
      // First delete all votes related to titles
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .eq('item_type', 'title');

      if (votesError) {
        console.error('Error deleting title votes:', votesError);
      }

      // Then delete all titles
      const { error } = await supabase
        .from('titles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error deleting all titles:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteAllTitles:', error);
      return false;
    }
  }
};

export const coverService = {
  async getAllCovers(): Promise<CoverImage[]> {
    try {
      const { data, error } = await supabase
        .from('covers')
        .select('*')
        .order('global_score', { ascending: false });

      if (error) {
        console.error('Error fetching covers:', error);
        return [];
      }

      return data.map(cover => ({
        id: cover.id,
        imageUrl: cover.image_url,
        globalScore: Number(cover.global_score),
        localScore: 1000,
        isActive: cover.is_active,
        voteCount: cover.vote_count
      }));
    } catch (error) {
      console.error('Error in getAllCovers:', error);
      return [];
    }
  },

  async forceRefreshCovers(): Promise<CoverImage[]> {
    console.log('Force refreshing covers from database...');
    
    try {
      const timestamp = Date.now();
      const { data, error } = await supabase
        .from('covers')
        .select('*')
        .eq('is_active', true)
        .order('global_score', { ascending: false });

      if (error) {
        console.error('Error force refreshing covers:', error);
        return [];
      }

      console.log(`Force refresh found ${data.length} active covers`);
      
      return data.map(cover => ({
        id: cover.id,
        imageUrl: `${cover.image_url}?v=${timestamp}`,
        globalScore: Number(cover.global_score),
        localScore: 1000,
        isActive: cover.is_active,
        voteCount: cover.vote_count
      }));
    } catch (error) {
      console.error('Error in forceRefreshCovers:', error);
      return [];
    }
  },

  async updateCoverScore(coverId: string, newScore: number, voteCount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('covers')
        .update({
          global_score: newScore,
          vote_count: voteCount
        })
        .eq('id', coverId);

      if (error) {
        console.error('Error updating cover score:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in updateCoverScore:', error);
      return false;
    }
  },

  async addCover(imageUrl: string): Promise<CoverImage | null> {
    try {
      const { data, error } = await supabase
        .from('covers')
        .insert([{ image_url: imageUrl }])
        .select()
        .single();

      if (error) {
        console.error('Error adding cover:', error);
        return null;
      }

      return {
        id: data.id,
        imageUrl: data.image_url,
        globalScore: Number(data.global_score),
        localScore: 1000,
        isActive: data.is_active,
        voteCount: data.vote_count
      };
    } catch (error) {
      console.error('Error in addCover:', error);
      return null;
    }
  },

  async deactivateCover(coverId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('covers')
        .update({ is_active: false })
        .eq('id', coverId);

      if (error) {
        console.error('Error deactivating cover:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deactivateCover:', error);
      return false;
    }
  },

  async deleteCover(coverId: string): Promise<boolean> {
    try {
      console.log('Starting cover deletion process for ID:', coverId);
      
      // First get the cover to extract the image URL for storage deletion
      const { data: coverData, error: fetchError } = await supabase
        .from('covers')
        .select('image_url')
        .eq('id', coverId)
        .single();

      if (fetchError) {
        console.error('Error fetching cover for deletion:', fetchError);
        return false;
      }

      console.log('Cover data to delete:', coverData);

      // Delete related votes first
      console.log('Deleting related votes...');
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .or(`winner_item_id.eq.${coverId},loser_item_id.eq.${coverId}`);

      if (votesError) {
        console.error('Error deleting cover votes:', votesError);
      }

      // Delete from storage first if it's a Supabase storage URL
      if (coverData?.image_url && coverData.image_url.includes('supabase')) {
        console.log('Deleting from Supabase storage:', coverData.image_url);
        const storageDeleted = await storageService.deleteFile(coverData.image_url);
        if (!storageDeleted) {
          console.warn('Failed to delete cover file from storage, but continuing with database deletion');
        } else {
          console.log('Successfully deleted from storage');
        }
      } else {
        console.log('URL is not a Supabase storage URL, skipping storage deletion');
      }

      // Delete from database
      console.log('Deleting from database...');
      const { error } = await supabase
        .from('covers')
        .delete()
        .eq('id', coverId);

      if (error) {
        console.error('Error deleting cover from database:', error);
        return false;
      }

      console.log('Cover deleted successfully from database:', coverId);
      return true;
    } catch (error) {
      console.error('Error in deleteCover:', error);
      return false;
    }
  },

  async deleteAllCovers(): Promise<boolean> {
    try {
      console.log('Starting bulk cover deletion...');
      
      // Get all cover URLs for storage deletion
      const { data: covers, error: fetchError } = await supabase
        .from('covers')
        .select('image_url');

      if (fetchError) {
        console.error('Error fetching covers for bulk deletion:', fetchError);
      }

      // Delete related votes first
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .eq('item_type', 'cover');

      if (votesError) {
        console.error('Error deleting cover votes:', votesError);
      }

      // Delete from database first
      const { error } = await supabase
        .from('covers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error deleting all covers from database:', error);
        return false;
      }

      // Delete from storage
      if (covers && covers.length > 0) {
        const storageUrls = covers
          .map(c => c.image_url)
          .filter(url => url && url.includes('supabase'));
        
        if (storageUrls.length > 0) {
          console.log('Deleting', storageUrls.length, 'files from storage');
          const deleted = await storageService.deleteFiles(storageUrls);
          if (!deleted) {
            console.warn('Failed to delete some cover files from storage, but database entries were removed');
          }
        }
      }

      console.log('All covers deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteAllCovers:', error);
      return false;
    }
  }
};

export const voteService = {
  async getAllVotes(): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        voting_round_id
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching votes:', error);
      throw error;
    }

    return (data || []).map(vote => ({
      id: vote.id,
      userId: vote.user_id,
      itemType: vote.item_type as 'title' | 'cover',
      winnerItemId: vote.winner_item_id,
      loserItemId: vote.loser_item_id,
      timestamp: new Date(vote.timestamp)
    }));
  },

  async saveVote(vote: {
    userId: string;
    itemType: 'title' | 'cover';
    winnerItemId: string;
    loserItemId: string;
    localWinnerScore: number;
    localLoserScore: number;
  }): Promise<boolean> {
    try {
      // Get current round
      const currentRound = await votingRoundService.getCurrentRound();
      const { data: roundData } = await supabase
        .from('voting_rounds')
        .select('id')
        .eq('round_number', currentRound)
        .eq('is_active', true)
        .single();

      if (!roundData) {
        throw new Error('No active voting round found');
      }

      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: vote.userId,
          item_type: vote.itemType,
          winner_item_id: vote.winnerItemId,
          loser_item_id: vote.loserItemId,
          local_winner_score: vote.localWinnerScore,
          local_loser_score: vote.localLoserScore,
          voting_round_id: roundData.id
        });

      if (error) {
        console.error('Error saving vote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveVote:', error);
      return false;
    }
  },

  async deleteAllVotes(): Promise<boolean> {
    try {
      console.log('Deleting all votes and resetting scores and vote counts...');
      
      // First, reset all title scores to 1000 AND vote counts to 0
      const { error: titleError } = await supabase
        .from('titles')
        .update({ 
          vote_count: 0,
          global_score: 1000
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

      if (titleError) {
        console.error('Error resetting title scores and vote counts:', titleError);
        throw titleError;
      }

      // Reset all cover scores to 1000 AND vote counts to 0
      const { error: coverError } = await supabase
        .from('covers')
        .update({ 
          vote_count: 0,
          global_score: 1000
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

      if (coverError) {
        console.error('Error resetting cover scores and vote counts:', coverError);
        throw coverError;
      }

      // Finally, delete all votes
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (votesError) {
        console.error('Error deleting votes:', votesError);
        throw votesError;
      }

      console.log('Successfully deleted all votes and reset scores and vote counts');
      return true;
    } catch (error) {
      console.error('Error in deleteAllVotes:', error);
      return false;
    }
  }
};

export const votingRoundService = {
  async getCurrentRound(): Promise<number> {
    const { data, error } = await supabase
      .from('voting_rounds')
      .select('round_number')
      .eq('is_active', true)
      .order('round_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current round:', error);
      return 1;
    }

    return data?.round_number || 1;
  },

  async startNewRound(): Promise<boolean> {
    try {
      console.log('Starting new voting round...');
      
      // Deactivate current round
      const { error: deactivateError } = await supabase
        .from('voting_rounds')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating current round:', deactivateError);
        throw deactivateError;
      }

      // Get the next round number
      const { data: maxRoundData, error: maxRoundError } = await supabase
        .from('voting_rounds')
        .select('round_number')
        .order('round_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxRoundError) {
        console.error('Error getting max round number:', maxRoundError);
        throw maxRoundError;
      }

      const nextRoundNumber = (maxRoundData?.round_number || 0) + 1;

      // Create new round
      const { error: createError } = await supabase
        .from('voting_rounds')
        .insert({
          round_number: nextRoundNumber,
          is_active: true
        });

      if (createError) {
        console.error('Error creating new round:', createError);
        throw createError;
      }

      // Reset all global scores to 1000 and vote counts to 0
      const { error: titleResetError } = await supabase
        .from('titles')
        .update({ 
          global_score: 1000,
          vote_count: 0
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (titleResetError) {
        console.error('Error resetting title scores:', titleResetError);
        throw titleResetError;
      }

      const { error: coverResetError } = await supabase
        .from('covers')
        .update({ 
          global_score: 1000,
          vote_count: 0
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (coverResetError) {
        console.error('Error resetting cover scores:', coverResetError);
        throw coverResetError;
      }

      console.log(`Successfully started round ${nextRoundNumber}`);
      return true;
    } catch (error) {
      console.error('Error starting new round:', error);
      return false;
    }
  },

  async hardReset(): Promise<boolean> {
    try {
      console.log('Performing hard reset...');
      
      // Delete all votes
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (votesError) {
        console.error('Error deleting votes:', votesError);
        throw votesError;
      }

      // Delete all survey answers
      const { error: surveyError } = await supabase
        .from('survey_answers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (surveyError) {
        console.error('Error deleting survey answers:', surveyError);
        throw surveyError;
      }

      // Delete all voting rounds
      const { error: roundsError } = await supabase
        .from('voting_rounds')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (roundsError) {
        console.error('Error deleting voting rounds:', roundsError);
        throw roundsError;
      }

      // Reset all scores to 1000 and vote counts to 0
      const { error: titleResetError } = await supabase
        .from('titles')
        .update({ 
          global_score: 1000,
          vote_count: 0
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (titleResetError) {
        console.error('Error resetting title scores:', titleResetError);
        throw titleResetError;
      }

      const { error: coverResetError } = await supabase
        .from('covers')
        .update({ 
          global_score: 1000,
          vote_count: 0
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (coverResetError) {
        console.error('Error resetting cover scores:', coverResetError);
        throw coverResetError;
      }

      // Create new round 1
      const { error: createRoundError } = await supabase
        .from('voting_rounds')
        .insert({
          round_number: 1,
          is_active: true
        });

      if (createRoundError) {
        console.error('Error creating new round 1:', createRoundError);
        throw createRoundError;
      }

      console.log('Hard reset completed successfully');
      return true;
    } catch (error) {
      console.error('Error during hard reset:', error);
      return false;
    }
  }
};

export const exportService = {
  async exportAllUsersCSV(): Promise<string> {
    try {
      const users = await userService.getAllUsers();
      const votes = await voteService.getAllVotes();
      const surveyData = await supabase.from('survey_answers').select('*');

      let csvContent = 'User ID,Name,Admin,Created At,Completed Steps,Feedback,Total Votes,Survey Reading Habits,Survey Interest Level\n';
      
      for (const user of users) {
        const userVotes = votes.filter(v => v.userId === user.id);
        const survey = surveyData.data?.find(s => s.user_id === user.id);
        
        csvContent += `"${user.id}","${user.name}",${user.isAdmin},"${user.createdAt.toISOString()}",${user.completedSteps},"${user.feedback || ''}",${userVotes.length},"${survey?.reading_habits?.join(';') || ''}",${survey?.interest_level || ''}\n`;
      }
      
      return csvContent;
    } catch (error) {
      console.error('Error in exportAllUsersCSV:', error);
      return '';
    }
  },

  async exportGlobalRankingsCSV(): Promise<string> {
    try {
      const titles = await titleService.getAllTitles();
      const covers = await coverService.getAllCovers();
      const currentRound = await votingRoundService.getCurrentRound();

      let csvContent = 'Type,ID,Text/URL,Global Score,Vote Count,Is Active,Voting Round\n';
      
      titles.forEach(title => {
        csvContent += `Title,"${title.id}","${title.text}",${title.globalScore.toFixed(2)},${title.voteCount},${title.isActive},${currentRound}\n`;
      });
      
      covers.forEach(cover => {
        csvContent += `Cover,"${cover.id}","${cover.imageUrl}",${cover.globalScore.toFixed(2)},${cover.voteCount},${cover.isActive},${currentRound}\n`;
      });
      
      return csvContent;
    } catch (error) {
      console.error('Error in exportGlobalRankingsCSV:', error);
      return '';
    }
  },

  async exportVotesCSV(): Promise<string> {
    try {
      const votes = await voteService.getAllVotes();
      const users = await userService.getAllUsers();
      
      const { data: votesWithRounds } = await supabase
        .from('votes')
        .select(`
          *,
          voting_rounds!inner(round_number)
        `)
        .order('timestamp', { ascending: false });
      
      let csvContent = 'Vote ID,User ID,User Name,Item Type,Winner Item ID,Loser Item ID,Timestamp,Voting Round\n';
      
      votesWithRounds?.forEach(vote => {
        const user = users.find(u => u.id === vote.user_id);
        const roundNumber = vote.voting_rounds?.round_number || 1;
        csvContent += `"${vote.id}","${vote.user_id}","${user?.name || 'Unknown'}","${vote.item_type}","${vote.winner_item_id}","${vote.loser_item_id}","${vote.timestamp}",${roundNumber}\n`;
      });
      
      return csvContent;
    } catch (error) {
      console.error('Error in exportVotesCSV:', error);
      return '';
    }
  }
};
