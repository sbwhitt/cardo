export interface Action {
  direction: boolean;
  card: Card;
}

export interface Card {
  id: number;
  goal: string;
  base: string;
  type: 'masculine' | 'feminine' | 'neuter' | 'verb' | 'other';
  goal_sent_1: string;
  base_sent_1: string;
  goal_sent_2: string;
  base_sent_2: string;
  starred: boolean;
}
