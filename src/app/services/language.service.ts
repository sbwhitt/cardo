import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private base!: string;
  private goal!: string;

  constructor(
    private dbService: DbService
  ) {}

  async getBase(): Promise<string> {
    if (this.base) { return this.base; }
    const lang = await this.dbService.getBaseLanguage();
    if (typeof lang === 'string') {
      this.base = lang;
      return lang;
    }
    return "";
  }

  async getGoal(): Promise<string> {
    if (this.goal) { return this.goal; }
    const lang = await this.dbService.getGoalLanguage();
    if (typeof lang === 'string') {
      this.goal = lang;
      return lang;
    }
    return "";
  }
}
