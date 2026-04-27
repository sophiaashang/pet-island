export type ChildId = 'yuanyuan' | 'xinbei';
export type TaskType = 'daily' | 'weekly';
export type TaskCategory = 'study' | 'sport' | 'life' | 'piano';
export type PetType = 'DUCKY' | 'WOLFY' | 'MEIMI' | 'LINGLING' | 'FIRE' | 'BUBBLE' | 'MOONFOX' | 'STARCUB';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type EvolutionStage = 0 | 1 | 2;
export type ItemType = 'food' | 'toy';
export type RoomTheme = 'grass' | 'wood' | 'cloud';

export interface MilestoneTask {
  id: string;
  name: string;
  icon: string;
  target: number;
  progress: number;
  coinReward: number;
  completed: boolean;
  rewardsClaimed: boolean;
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  type: TaskType;
  targetCount: number;
  currentCount: number;
  coinReward: number;
  forChild: ChildId;
  category: TaskCategory;
  isCountable: boolean;
  countableTarget?: number;
  dayOfWeek?: number[];
  completedToday: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  nickname: string;
  stage: EvolutionStage;
  hunger: number;
  mood: number;
  level: number;
  tasksCompleted: number;
  rarity: Rarity;
  speechLines: string[];
  currentLine: string;
  isNew: boolean;
  roomTheme?: RoomTheme;
  friendship?: number;
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  type: ItemType;
  price: number;
  effect: number;
  count: number;
}

export interface ChildStats {
  totalTasksCompleted: number;
  totalCoinsEarned: number;
  loginDays: number;
  lastLoginDate: string;
  currentStreak: number;
  friendshipEnergy: number;
}

export interface Milestone {
  progress: number;
  completed: boolean;
  rewardsClaimed: boolean;
}

export interface ChildProfile {
  name: string;
  avatar: string;
  pet: Pet;
  tasks: Task[];
  inventory: Item[];
  petsCollection: Pet[];
  totalCoins: number;
  stats: ChildStats;
  milestones: Record<string, Milestone>;
  visitingPet?: { pet: Pet; fromChildId: ChildId };
  activePetId?: string;
  _lastModified?: number;
}

export interface GachaPet {
  type: PetType; name: string; nickname: string; rarity: Rarity;
  rarityStars: string; speechLines: string[]; color: string;
}

export interface GameState {
  currentChild: ChildId;
  children: {
    yuanyuan: ChildProfile;
    xinbei: ChildProfile;
  };
}

// Learning types
export interface ReviewEntry {
  learnedDate: string; // ISO date string when learned
  nextReviewDate: string; // ISO date string for next review
  level: number; // 0=new, 1=1day, 2=2days, 3=4days, 4=7days, 5=15days, 6=30days (mastered)
  correctCount: number;
  incorrectCount: number;
}

export interface HanziWord {
  char: string;
  pinyin: string;
  word: string;
  emoji: string;
}

export interface PetWord {
  word: string;
  chinese: string;
  english: string;
  example: string;
}
