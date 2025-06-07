
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Title, CoverImage, Vote, AppStep } from '@/types';

interface AppContextType {
  currentUser: User | null;
  currentStep: AppStep;
  titles: Title[];
  covers: CoverImage[];
  votes: Vote[];
  titleVotingRounds: number;
  maxTitleRounds: number;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setCurrentStep: (step: AppStep) => void;
  submitVote: (itemType: 'title' | 'cover', winnerId: string, loserId: string) => void;
  addTitle: (text: string) => void;
  addCover: (imageUrl: string) => void;
  deactivateItem: (itemType: 'title' | 'cover', id: string) => void;
  resetData: () => void;
  exportCSV: (type: 'global' | 'local' | 'votes' | 'users') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TITLES = [
  "Die Geheimnisse des verlassenen Turms",
  "Schatten über der goldenen Stadt",
  "Das Flüstern der vergessenen Wälder",
  "Im Labyrinth der Zeit",
  "Der letzte Wächter des Lichts",
  "Zwischen den Welten"
];

const INITIAL_COVERS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=450&fit=crop",
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [titles, setTitles] = useState<Title[]>([]);
  const [covers, setCovers] = useState<CoverImage[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [titleVotingRounds, setTitleVotingRounds] = useState(0);
  const maxTitleRounds = 12;

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

  const calculateNewScores = (winnerScore: number, loserScore: number, kFactor: number = 32) => {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));
    
    const newWinnerScore = winnerScore + kFactor * (1 - expectedWinner);
    const newLoserScore = loserScore + kFactor * (0 - expectedLoser);
    
    return { newWinnerScore, newLoserScore };
  };

  const submitVote = (itemType: 'title' | 'cover', winnerId: string, loserId: string) => {
    if (!currentUser) return;

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
            const { newWinnerScore } = calculateNewScores(title.globalScore, loser.globalScore);
            return { ...title, globalScore: newWinnerScore, localScore: newWinnerScore, voteCount: title.voteCount + 1 };
          }
        }
        if (title.id === loserId) {
          const winner = prev.find(t => t.id === winnerId);
          if (winner) {
            const { newLoserScore } = calculateNewScores(winner.globalScore, title.globalScore);
            return { ...title, globalScore: newLoserScore, localScore: newLoserScore, voteCount: title.voteCount + 1 };
          }
        }
        return title;
      }));
      
      setTitleVotingRounds(prev => prev + 1);
      
      if (titleVotingRounds + 1 >= maxTitleRounds) {
        setCurrentStep('covers');
      }
    } else {
      setCovers(prev => prev.map(cover => {
        if (cover.id === winnerId) {
          const loser = prev.find(c => c.id === loserId);
          if (loser) {
            const { newWinnerScore } = calculateNewScores(cover.globalScore, loser.globalScore);
            return { ...cover, globalScore: newWinnerScore, localScore: newWinnerScore, voteCount: cover.voteCount + 1 };
          }
        }
        if (cover.id === loserId) {
          const winner = prev.find(c => c.id === winnerId);
          if (winner) {
            const { newLoserScore } = calculateNewScores(winner.globalScore, cover.globalScore);
            return { ...cover, globalScore: newLoserScore, localScore: newLoserScore, voteCount: cover.voteCount + 1 };
          }
        }
        return cover;
      }));
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
        csvContent = 'ID,User ID,Item Type,Winner ID,Loser ID,Timestamp\n';
        votes.forEach(vote => {
          csvContent += `${vote.id},${vote.userId},${vote.itemType},${vote.winnerItemId},${vote.loserItemId},${vote.timestamp.toISOString()}\n`;
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
      maxTitleRounds,
      setCurrentUser,
      setCurrentStep,
      submitVote,
      addTitle,
      addCover,
      deactivateItem,
      resetData,
      exportCSV
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
