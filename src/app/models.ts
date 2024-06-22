export interface Notification {
  message: string;
  success: boolean;
}

export interface Action {
  direction: boolean;
  card: Card;
}

export type CardType = 'masculine' | 'feminine' | 'neuter' | 'verb' | 'other';

export interface Card {
  id: number;
  goal: string;
  base: string;
  type: CardType;
  goal_sent_1: string;
  base_sent_1: string;
  goal_sent_2: string;
  base_sent_2: string;
  starred: boolean;
}
