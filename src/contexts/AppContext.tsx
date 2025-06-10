import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Title, CoverImage, Vote, AppStep, SurveyAnswers } from '@/types';
import { 
  userService, 
  titleService, 
  coverService, 
  voteService, 
  surveyService,
  exportService 
} from '@/services/supabaseServices';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

interface AppContextType {
  currentUser: User | null;
  currentStep: AppStep;
  titles: Title[];
  covers: CoverImage[];
  votes: Vote[];
  titleVotingRounds: number;
  coverVotingRounds: number;
  maxTitleRounds: number;
  maxCoverRounds: number;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setCurrentStep: (step: AppStep) => void;
  submitVote: (itemType: 'title' | 'cover', winnerId: string, loserId: string) => Promise<void>;
  addTitle: (text: string) => Promise<void>;
  addCover: (imageUrl: string) => Promise<void>;
  deactivateItem: (itemType: 'title' | 'cover', id: string) => Promise<void>;
  resetData: () => Promise<void>;
  exportCSV: (type: 'global' | 'local' | 'votes' | 'users') => Promise<void>;
  startNewSession: () => void;
  refreshRankings: () => Promise<void>;
  forceRefreshCovers: () => Promise<void>;
  saveSurveyAnswers: (answers: SurveyAnswers) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [titles, setTitles] = useState<Title[]>([]);
  const [covers, setCovers] = useState<CoverImage[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [titleVotingRounds, setTitleVotingRounds] = useState(0);
  const [coverVotingRounds, setCoverVotingRounds] = useState(0);
  const maxTitleRounds = 12;
  const maxCoverRounds = 12;
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from Supabase
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [titlesData, coversData, votesData] = await Promise.all([
        titleService.getAllTitles(),
        coverService.getAllCovers(),
        voteService.getAllVotes()
      ]);
      
      setTitles(titlesData);
      setCovers(coversData);
      setVotes(votesData);
      
      console.log('Loaded data from Supabase:', { titles: titlesData.length, covers: coversData.length, votes: votesData.length });
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRankings = async () => {
    console.log('Refreshing rankings from database...');
    await loadInitialData();
  };

  const forceRefreshCovers = async () => {
    console.log('Force refreshing covers specifically...');
    try {
      const freshCovers = await coverService.forceRefreshCovers();
      setCovers(freshCovers);
      console.log(`Force refreshed ${freshCovers.length} covers`);
    } catch (error) {
      console.error('Error force refreshing covers:', error);
    }
  };

  const setCurrentUser = async (user: User) => {
    setCurrentUserState(user);
    
    // Save or update user in database
    if (!user.id.startsWith('user-')) {
      // User already exists in DB
      await userService.updateUser(user.id, user);
    } else {
      // Create new user in DB
      const newUser = await userService.createUser(user);
      if (newUser) {
        setCurrentUserState(newUser);
      }
    }
  };

  const saveSurveyAnswers = async (answers: SurveyAnswers) => {
    if (currentUser) {
      await surveyService.saveSurveyAnswers(currentUser.id, answers);
    }
  };

  const startNewSession = () => {
    console.log('Starting new session - resetting local data only');
    setTitleVotingRounds(0);
    setCoverVotingRounds(0);
    
    // Reset only LOCAL scores for new user session, keep global scores intact
    setTitles(prev => prev.map(title => ({ ...title, localScore: 1000 })));
    setCovers(prev => prev.map(cover => ({ ...cover, localScore: 1000 })));
    
    setCurrentUserState(null);
    setCurrentStep('start');
  };

  const calculateNewScores = (winnerScore: number, loserScore: number, kFactor: number = 32) => {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));
    
    const newWinnerScore = winnerScore + kFactor * (1 - expectedWinner);
    const newLoserScore = loserScore + kFactor * (0 - expectedLoser);
    
    return { newWinnerScore, newLoserScore };
  };

  const submitVote = async (itemType: 'title' | 'cover', winnerId: string, loserId: string) => {
    if (!currentUser) return;

    console.log(`${currentUser.name} (${currentUser.id}) voted: ${itemType} winner: ${winnerId}, loser: ${loserId}`);

    if (itemType === 'title') {
      const winner = titles.find(t => t.id === winnerId);
      const loser = titles.find(t => t.id === loserId);
      
      if (winner && loser) {
        const { newWinnerScore: newGlobalWinnerScore, newLoserScore: newGlobalLoserScore } = 
          calculateNewScores(winner.globalScore, loser.globalScore);
        const { newWinnerScore: newLocalWinnerScore, newLoserScore: newLocalLoserScore } = 
          calculateNewScores(winner.localScore, loser.localScore);

        // Update local state
        setTitles(prev => prev.map(title => {
          if (title.id === winnerId) {
            return { 
              ...title, 
              globalScore: newGlobalWinnerScore, 
              localScore: newLocalWinnerScore, 
              voteCount: title.voteCount + 1 
            };
          }
          if (title.id === loserId) {
            return { 
              ...title, 
              globalScore: newGlobalLoserScore, 
              localScore: newLocalLoserScore, 
              voteCount: title.voteCount + 1 
            };
          }
          return title;
        }));

        // Save to database
        await Promise.all([
          titleService.updateTitleScore(winnerId, newGlobalWinnerScore, winner.voteCount + 1),
          titleService.updateTitleScore(loserId, newGlobalLoserScore, loser.voteCount + 1),
          voteService.saveVote({
            userId: currentUser.id,
            itemType,
            winnerItemId: winnerId,
            loserItemId: loserId,
            localWinnerScore: newLocalWinnerScore,
            localLoserScore: newLocalLoserScore
          })
        ]);
      }
      
      const newTitleRounds = titleVotingRounds + 1;
      setTitleVotingRounds(newTitleRounds);
      
      if (newTitleRounds >= maxTitleRounds) {
        console.log('Title voting completed, switching to covers');
        setCurrentStep('covers');
      }
    } else {
      const winner = covers.find(c => c.id === winnerId);
      const loser = covers.find(c => c.id === loserId);
      
      if (winner && loser) {
        const { newWinnerScore: newGlobalWinnerScore, newLoserScore: newGlobalLoserScore } = 
          calculateNewScores(winner.globalScore, loser.globalScore);
        const { newWinnerScore: newLocalWinnerScore, newLoserScore: newLocalLoserScore } = 
          calculateNewScores(winner.localScore, loser.localScore);

        // Update local state
        setCovers(prev => prev.map(cover => {
          if (cover.id === winnerId) {
            return { 
              ...cover, 
              globalScore: newGlobalWinnerScore, 
              localScore: newLocalWinnerScore, 
              voteCount: cover.voteCount + 1 
            };
          }
          if (cover.id === loserId) {
            return { 
              ...cover, 
              globalScore: newGlobalLoserScore, 
              localScore: newLocalLoserScore, 
              voteCount: cover.voteCount + 1 
            };
          }
          return cover;
        }));

        // Save to database
        await Promise.all([
          coverService.updateCoverScore(winnerId, newGlobalWinnerScore, winner.voteCount + 1),
          coverService.updateCoverScore(loserId, newGlobalLoserScore, loser.voteCount + 1),
          voteService.saveVote({
            userId: currentUser.id,
            itemType,
            winnerItemId: winnerId,
            loserItemId: loserId,
            localWinnerScore: newLocalWinnerScore,
            localLoserScore: newLocalLoserScore
          })
        ]);
      }

      const newCoverRounds = coverVotingRounds + 1;
      setCoverVotingRounds(newCoverRounds);
      
      if (newCoverRounds >= maxCoverRounds) {
        console.log('Cover voting completed, going to feedback');
        setCurrentStep('feedback');
      }
    }
  };

  const addTitle = async (text: string) => {
    const newTitle = await titleService.addTitle(text);
    if (newTitle) {
      setTitles(prev => [...prev, newTitle]);
    }
  };

  const addCover = async (imageUrl: string) => {
    const newCover = await coverService.addCover(imageUrl);
    if (newCover) {
      setCovers(prev => [...prev, newCover]);
    }
  };

  const deactivateItem = async (itemType: 'title' | 'cover', id: string) => {
    if (itemType === 'title') {
      const success = await titleService.deactivateTitle(id);
      if (success) {
        setTitles(prev => prev.map(title => 
          title.id === id ? { ...title, isActive: false } : title
        ));
      }
    } else {
      const success = await coverService.deactivateCover(id);
      if (success) {
        setCovers(prev => prev.map(cover => 
          cover.id === id ? { ...cover, isActive: false } : cover
        ));
      }
    }
  };

  const resetData = async () => {
    // This would deactivate all covers in the database
    const activeCovers = covers.filter(c => c.isActive);
    for (const cover of activeCovers) {
      await coverService.deactivateCover(cover.id);
    }
    await loadInitialData();
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCSV = async (type: 'global' | 'local' | 'votes' | 'users') => {
    setIsLoading(true);
    try {
      let csvContent = '';
      let filename = '';

      switch (type) {
        case 'global':
          csvContent = await exportService.exportGlobalRankingsCSV();
          filename = 'global-ranking.csv';
          break;
        case 'votes':
          csvContent = await exportService.exportVotesCSV();
          filename = 'votes-log.csv';
          break;
        case 'users':
          csvContent = await exportService.exportAllUsersCSV();
          filename = 'all-users-data.csv';
          break;
        case 'local':
          // Local rankings based on current user session
          csvContent = 'Type,ID,Text/URL,Local Score\n';
          titles.forEach(title => {
            csvContent += `Title,"${title.id}","${title.text}",${title.localScore.toFixed(2)}\n`;
          });
          covers.forEach(cover => {
            csvContent += `Cover,"${cover.id}","${cover.imageUrl}",${cover.localScore.toFixed(2)}\n`;
          });
          filename = 'local-ranking.csv';
          break;
      }

      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add real-time updates
  useRealTimeUpdates();

  return (
    <AppContext.Provider value={{
      currentUser,
      currentStep,
      titles,
      covers,
      votes,
      titleVotingRounds,
      coverVotingRounds,
      maxTitleRounds,
      maxCoverRounds,
      setCurrentUser,
      setCurrentStep,
      submitVote,
      addTitle,
      addCover,
      deactivateItem,
      resetData,
      exportCSV,
      startNewSession,
      refreshRankings,
      forceRefreshCovers,
      saveSurveyAnswers
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
