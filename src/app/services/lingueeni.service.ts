import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class LingueeniService {
  urlBase = 'https://lingueeni.onrender.com/api/v2';

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) { }

  async getTranslationFromBase(query: string) {
    const params = new URLSearchParams({
      query,
      src: 'en',
      dst: 'de'
    }).toString();
    this.http.get(`${this.urlBase}/translations?${params}`).subscribe((res) => console.log(res));
  }
}
