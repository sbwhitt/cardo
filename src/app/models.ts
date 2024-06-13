export interface Action {
  direction: boolean;
  card: Card;
}

export interface Card {
  id: number;
  german: string;
  english: string;
  type: 'masculine' | 'feminine' | 'neuter' | 'verb' | 'other';
  ger_sent_1: string;
  eng_sent_1: string;
  ger_sent_2: string;
  eng_sent_2: string;
  starred: boolean;
}
