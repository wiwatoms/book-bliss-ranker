export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
  surveyAnswers?: SurveyAnswers;
  completedSteps: number; // 0-5 (0: nicht begonnen, 1: Name, 2: Umfrage, 3: Titel, 4: Cover, 5: Feedback)
  feedback?: string;
}

export interface SurveyAnswers {
  readingHabits: string[]; // Multiple choice: "Nein/kaum", "E-Book", "Gedruckt"
  interestLevel: number; // 1-10 Skala
}

export interface Title {
  id: string;
  text: string;
  globalScore: number;
  localScore: number;
  isActive: boolean;
  voteCount: number;
}

export interface CoverImage {
  id: string;
  imageUrl: string;
  globalScore: number;
  localScore: number;
  isActive: boolean;
  voteCount: number;
}

export interface Vote {
  id: string;
  userId: string;
  itemType: 'title' | 'cover';
  winnerItemId: string;
  loserItemId: string;
  timestamp: Date;
}

export interface ComparisonPair<T> {
  itemA: T;
  itemB: T;
}

export type AppStep = 'start' | 'name' | 'survey' | 'titles' | 'covers' | 'feedback' | 'ranking' | 'dashboard';
