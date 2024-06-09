export interface Card {
  german: string;
  english: string;
  type: 'masculine' | 'feminine' | 'verb' | 'other';
  ger_sent_1: string;
  eng_sent_1: string;
  ger_sent_2: string;
  eng_sent_2: string;
  viewed: boolean;
}
