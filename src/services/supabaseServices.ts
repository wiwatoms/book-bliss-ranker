
import { supabase } from '@/integrations/supabase/client';
import { User, Title, CoverImage, Vote, SurveyAnswers } from '@/types';

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
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
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
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
  },

  async getAllUsers(): Promise<User[]> {
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
  },

  async deleteAllUsers(): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error deleting all users:', error);
      return false;
    }
    return true;
  }
};

export const surveyService = {
  async saveSurveyAnswers(userId: string, answers: SurveyAnswers): Promise<boolean> {
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
  },

  async deleteAllSurveyAnswers(): Promise<boolean> {
    const { error } = await supabase
      .from('survey_answers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error deleting all survey answers:', error);
      return false;
    }
    return true;
  }
};

export const titleService = {
  async getAllTitles(): Promise<Title[]> {
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
  },

  async updateTitleScore(titleId: string, newScore: number, voteCount: number): Promise<boolean> {
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
  },

  async addTitle(text: string): Promise<Title | null> {
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
  },

  async deactivateTitle(titleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('titles')
      .update({ is_active: false })
      .eq('id', titleId);

    if (error) {
      console.error('Error deactivating title:', error);
      return false;
    }
    return true;
  },

  async deleteTitle(titleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('titles')
      .delete()
      .eq('id', titleId);

    if (error) {
      console.error('Error deleting title:', error);
      return false;
    }
    return true;
  },

  async deleteAllTitles(): Promise<boolean> {
    const { error } = await supabase
      .from('titles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error deleting all titles:', error);
      return false;
    }
    return true;
  }
};

export const coverService = {
  async getAllCovers(): Promise<CoverImage[]> {
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
  },

  async forceRefreshCovers(): Promise<CoverImage[]> {
    console.log('Force refreshing covers from database...');
    
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
  },

  async updateCoverScore(coverId: string, newScore: number, voteCount: number): Promise<boolean> {
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
  },

  async addCover(imageUrl: string): Promise<CoverImage | null> {
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
  },

  async deactivateCover(coverId: string): Promise<boolean> {
    const { error } = await supabase
      .from('covers')
      .update({ is_active: false })
      .eq('id', coverId);

    if (error) {
      console.error('Error deactivating cover:', error);
      return false;
    }
    return true;
  },

  async deleteCover(coverId: string): Promise<boolean> {
    const { error } = await supabase
      .from('covers')
      .delete()
      .eq('id', coverId);

    if (error) {
      console.error('Error deleting cover:', error);
      return false;
    }
    return true;
  },

  async deleteAllCovers(): Promise<boolean> {
    const { error } = await supabase
      .from('covers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error deleting all covers:', error);
      return false;
    }
    return true;
  }
};

export const voteService = {
  async saveVote(vote: Omit<Vote, 'id' | 'timestamp'> & { localWinnerScore: number; localLoserScore: number }): Promise<boolean> {
    const { data: roundData, error: roundError } = await supabase
      .from('voting_rounds')
      .select('id')
      .eq('is_active', true)
      .single();

    if (roundError || !roundData) {
      console.error('Error getting current voting round:', roundError);
      return false;
    }

    const { error } = await supabase
      .from('votes')
      .insert([{
        user_id: vote.userId,
        item_type: vote.itemType,
        winner_item_id: vote.winnerItemId,
        loser_item_id: vote.loserItemId,
        local_winner_score: vote.localWinnerScore,
        local_loser_score: vote.localLoserScore,
        voting_round_id: roundData.id
      }]);

    if (error) {
      console.error('Error saving vote:', error);
      return false;
    }
    return true;
  },

  async getAllVotes(): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching votes:', error);
      return [];
    }

    return data.map(vote => ({
      id: vote.id,
      userId: vote.user_id,
      itemType: vote.item_type as 'title' | 'cover',
      winnerItemId: vote.winner_item_id,
      loserItemId: vote.loser_item_id,
      timestamp: new Date(vote.timestamp)
    }));
  },

  async deleteAllVotes(): Promise<boolean> {
    const { error } = await supabase
      .from('votes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error deleting all votes:', error);
      return false;
    }
    return true;
  }
};

export const votingRoundService = {
  async getCurrentRound(): Promise<number> {
    const { data, error } = await supabase
      .from('voting_rounds')
      .select('round_number')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error getting current round:', error);
      return 1;
    }

    return data.round_number;
  },

  async startNewRound(): Promise<boolean> {
    try {
      console.log('Starting new voting round...');
      
      const { data: currentRound } = await supabase
        .from('voting_rounds')
        .select('round_number')
        .eq('is_active', true)
        .single();

      const { error: deactivateRoundError } = await supabase
        .from('voting_rounds')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateRoundError) {
        console.error('Error deactivating current round:', deactivateRoundError);
        return false;
      }

      const newRoundNumber = (currentRound?.round_number || 0) + 1;
      const { error: createRoundError } = await supabase
        .from('voting_rounds')
        .insert([{ round_number: newRoundNumber, is_active: true }]);

      if (createRoundError) {
        console.error('Error creating new round:', createRoundError);
        return false;
      }

      console.log(`Created new round ${newRoundNumber}`);

      // Reset global scores and vote counts for ALL titles and covers (not just active ones)
      const { error: resetTitlesError } = await supabase
        .from('titles')
        .update({ global_score: 1000, vote_count: 0 });

      if (resetTitlesError) {
        console.error('Error resetting titles:', resetTitlesError);
        return false;
      }

      const { error: resetCoversError } = await supabase
        .from('covers')
        .update({ global_score: 1000, vote_count: 0 });

      if (resetCoversError) {
        console.error('Error resetting covers:', resetCoversError);
        return false;
      }

      console.log('Successfully reset all scores and vote counts for all items');
      return true;
    } catch (error) {
      console.error('Error starting new round:', error);
      return false;
    }
  },

  async hardReset(): Promise<boolean> {
    try {
      console.log('Starting hard reset...');
      
      // Delete all votes
      await voteService.deleteAllVotes();
      
      // Delete all survey answers
      await surveyService.deleteAllSurveyAnswers();
      
      // Reset all voting rounds
      const { error: resetRoundsError } = await supabase
        .from('voting_rounds')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (resetRoundsError) {
        console.error('Error resetting voting rounds:', resetRoundsError);
        return false;
      }

      // Create initial round
      const { error: createInitialRoundError } = await supabase
        .from('voting_rounds')
        .insert([{ round_number: 1, is_active: true }]);

      if (createInitialRoundError) {
        console.error('Error creating initial round:', createInitialRoundError);
        return false;
      }

      // Reset all scores
      await supabase
        .from('titles')
        .update({ global_score: 1000, vote_count: 0 });

      await supabase
        .from('covers')
        .update({ global_score: 1000, vote_count: 0 });

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
  },

  async exportGlobalRankingsCSV(): Promise<string> {
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
  },

  async exportVotesCSV(): Promise<string> {
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
  }
};
