import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Title, CoverImage, Vote, AppStep } from '@/types';

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
  submitVote: (itemType: 'title' | 'cover', winnerId: string, loserId: string) => void;
  addTitle: (text: string) => void;
  addCover: (imageUrl: string) => void;
  deactivateItem: (itemType: 'title' | 'cover', id: string) => void;
  resetData: () => void;
  exportCSV: (type: 'global' | 'local' | 'votes' | 'users') => void;
  startNewSession: () => void;
  refreshRankings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TITLES = [
  "Drei Minuten und ein ganzes Leben",
  "Der Duft, der bleibt", 
  "Fenster zur Wüste, Türen zum Meer",
  "Tradition ist, pünktlich zu sterben",
  "Jenseits von Datteln",
  "Oud & Uber"
];

const INITIAL_COVERS = [
  "/lovable-uploads/63aedc2d-1999-403e-9eac-337861cc7005.png",
  "/lovable-uploads/b15712d2-ed46-46a2-a635-27163a4e72c9.png",
  "/lovable-uploads/c6e372a2-a91c-4695-9551-c0862fcd0454.png",
  "/lovable-uploads/59cf56ab-bb9b-42fa-acb8-29ac889ed9db.png",
  "/lovable-uploads/f8f80ad0-569e-4d23-ad54-e2fb8247af42.png",
  "/lovable-uploads/ae9cff41-c9b6-49c9-aba9-c816e89bf1eb.png",
  "/lovable-uploads/f7946275-b18b-4765-90d2-afd81005f79e.png",
  "/lovable-uploads/22125e5f-725c-4b6b-9738-d3c544a03a90.png",
  "/lovable-uploads/4cdf6293-fd36-436f-a79f-78647c3edc33.png",
  "/lovable-uploads/2f95b6e8-e83a-43e9-b5a5-f5b4aac40180.png"
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [titles, setTitles] = useState<Title[]>([]);
  const [covers, setCovers] = useState<CoverImage[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [titleVotingRounds, setTitleVotingRounds] = useState(0);
  const [coverVotingRounds, setCoverVotingRounds] = useState(0);
  const maxTitleRounds = 12;
  const maxCoverRounds = 12;

  // Initialize data
  useEffect(() => {
    // Initialize titles
    const initialTitles: Title[] = INITIAL_TITLES.map((text, index) => ({
      id: `title-${index}`,
      text,
      globalScore: 1000,
      localScore: 1000,
      isActive: true,
      voteCount: 0
    }));

    // Initialize covers
    const initialCovers: CoverImage[] = INITIAL_COVERS.map((imageUrl, index) => ({
      id: `cover-${index}`,
      imageUrl,
      globalScore: 1000,
      localScore: 1000,
      isActive: true,
      voteCount: 0
    }));

    setTitles(initialTitles);
    setCovers(initialCovers);
  }, []);

  const startNewSession = () => {
    console.log('Starting new session - resetting vote counters and local scores for new user');
    setTitleVotingRounds(0);
    setCoverVotingRounds(0);
    
    // Reset local scores for new user session
    setTitles(prev => prev.map(title => ({ ...title, localScore: 1000 })));
    setCovers(prev => prev.map(cover => ({ ...cover, localScore: 1000 })));
    
    setCurrentUser(null);
    setCurrentStep('start');
  };

  const refreshRankings = () => {
    console.log('Refreshing rankings display - forcing re-render');
    // Force a re-render by updating the state
    setTitles(prev => [...prev]);
    setCovers(prev => [...prev]);
  };

  const calculateNewScores = (winnerScore: number, loserScore: number, kFactor: number = 32) => {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));
    
    const newWinnerScore = winnerScore + kFactor * (1 - expectedWinner);
    const newLoserScore = loserScore + kFactor * (0 - expectedLoser);
    
    return { newWinnerScore, newLoserScore };
  };

  const submitVote = (itemType: 'title' | 'cover', winnerId: string, loserId: string) => {
    if (!currentUser) return;

    console.log(`${currentUser.name} (${currentUser.id}) voted: ${itemType} winner: ${winnerId}, loser: ${loserId}`);

    const vote: Vote = {
      id: `vote-${Date.now()}-${Math.random()}`,
      userId: currentUser.id,
      itemType,
      winnerItemId: winnerId,
      loserItemId: loserId,
      timestamp: new Date()
    };

    setVotes(prev => [...prev, vote]);

    if (itemType === 'title') {
      setTitles(prev => prev.map(title => {
        if (title.id === winnerId) {
          const loser = prev.find(t => t.id === loserId);
          if (loser) {
            const { newWinnerScore: newGlobalScore } = calculateNewScores(title.globalScore, loser.globalScore);
            const { newWinnerScore: newLocalScore } = calculateNewScores(title.localScore, loser.localScore);
            return { 
              ...title, 
              globalScore: newGlobalScore, 
              localScore: newLocalScore, 
              voteCount: title.voteCount + 1 
            };
          }
        }
        if (title.id === loserId) {
          const winner = prev.find(t => t.id === winnerId);
          if (winner) {
            const { newLoserScore: newGlobalScore } = calculateNewScores(winner.globalScore, title.globalScore);
            const { newLoserScore: newLocalScore } = calculateNewScores(winner.localScore, title.localScore);
            return { 
              ...title, 
              globalScore: newGlobalScore, 
              localScore: newLocalScore, 
              voteCount: title.voteCount + 1 
            };
          }
        }
        return title;
      }));
      
      const newTitleRounds = titleVotingRounds + 1;
      setTitleVotingRounds(newTitleRounds);
      console.log(`Title voting round: ${newTitleRounds}/${maxTitleRounds}`);
      
      if (newTitleRounds >= maxTitleRounds) {
        console.log('Title voting completed, switching to covers');
        setCurrentStep('covers');
      }
    } else {
      setCovers(prev => prev.map(cover => {
        if (cover.id === winnerId) {
          const loser = prev.find(c => c.id === loserId);
          if (loser) {
            const { newWinnerScore: newGlobalScore } = calculateNewScores(cover.globalScore, loser.globalScore);
            const { newWinnerScore: newLocalScore } = calculateNewScores(cover.localScore, loser.localScore);
            return { 
              ...cover, 
              globalScore: newGlobalScore, 
              localScore: newLocalScore, 
              voteCount: cover.voteCount + 1 
            };
          }
        }
        if (cover.id === loserId) {
          const winner = prev.find(c => c.id === winnerId);
          if (winner) {
            const { newLoserScore: newGlobalScore } = calculateNewScores(winner.globalScore, cover.globalScore);
            const { newLoserScore: newLocalScore } = calculateNewScores(winner.localScore, cover.localScore);
            return { 
              ...cover, 
              globalScore: newGlobalScore, 
              localScore: newLocalScore, 
              voteCount: cover.voteCount + 1 
            };
          }
        }
        return cover;
      }));

      const newCoverRounds = coverVotingRounds + 1;
      setCoverVotingRounds(newCoverRounds);
      console.log(`Cover voting round: ${newCoverRounds}/${maxCoverRounds}`);
      
      if (newCoverRounds >= maxCoverRounds) {
        console.log('Cover voting completed, going to feedback');
        setCurrentStep('feedback');
      }
    }
  };

  const addTitle = (text: string) => {
    const newTitle: Title = {
      id: `title-${Date.now()}`,
      text,
      globalScore: 1000,
      localScore: 1000,
      isActive: true,
      voteCount: 0
    };
    setTitles(prev => [...prev, newTitle]);
  };

  const addCover = (imageUrl: string) => {
    const newCover: CoverImage = {
      id: `cover-${Date.now()}`,
      imageUrl,
      globalScore: 1000,
      localScore: 1000,
      isActive: true,
      voteCount: 0
    };
    setCovers(prev => [...prev, newCover]);
  };

  const deactivateItem = (itemType: 'title' | 'cover', id: string) => {
    if (itemType === 'title') {
      setTitles(prev => prev.map(title => 
        title.id === id ? { ...title, isActive: false } : title
      ));
    } else {
      setCovers(prev => prev.map(cover => 
        cover.id === id ? { ...cover, isActive: false } : cover
      ));
    }
  };

  const resetData = () => {
    setCovers(prev => prev.map(cover => ({ ...cover, isActive: false })));
    setVotes([]);
  };

  const exportCSV = (type: 'global' | 'local' | 'votes' | 'users') => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'global':
        csvContent = 'Type,ID,Text/URL,Score,Votes\n';
        titles.forEach(title => {
          csvContent += `Title,${title.id},"${title.text}",${title.globalScore.toFixed(2)},${title.voteCount}\n`;
        });
        covers.forEach(cover => {
          csvContent += `Cover,${cover.id},${cover.imageUrl},${cover.globalScore.toFixed(2)},${cover.voteCount}\n`;
        });
        filename = 'global-ranking.csv';
        break;
      case 'votes':
        csvContent = 'ID,User ID,User Name,Item Type,Winner ID,Loser ID,Timestamp\n';
        votes.forEach(vote => {
          const userName = vote.userId === 'admin' ? 'Administrator' : 
                          vote.userId === currentUser?.id ? currentUser?.name || 'Unknown' : 
                          `User ${vote.userId.slice(-4)}`;
          csvContent += `${vote.id},${vote.userId},"${userName}",${vote.itemType},${vote.winnerItemId},${vote.loserItemId},${vote.timestamp.toISOString()}\n`;
        });
        filename = 'votes-log.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
      refreshRankings
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
