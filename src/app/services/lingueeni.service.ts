import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class LingueeniService {
  primaryUrlBase = 'http://lingueeni.duckdns.org:8000/api/v2';
  secondaryUrlBase = 'https://lingueeni.onrender.com/api/v2';

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) { }

  async getTranslationFromBase(query: string) {
    const base = await this.languageService.getBase();
    const goal = await this.languageService.getGoal();
    const params = new URLSearchParams({
      query,
      src: base,
      dst: goal
    }).toString();
    this.http.get(`${this.primaryUrlBase}/translations?${params}`).subscribe((res) => console.log(res));
  }
}
