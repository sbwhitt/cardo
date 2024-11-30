import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from './language.service';
import { NotificationsService } from './notifications.service';

export interface Example {
  dst: string;
  src: string;
}

export interface Translation {
  text: string;
  pos: string;
  examples: Example[];
}

export interface LingueeResult {
  featured: boolean;
  text: string;
  pos: string;
  translations: Translation[];
}

@Injectable({
  providedIn: 'root'
})
export class LingueeniService {
  primaryUrlBase = 'http://lingueeni.duckdns.org:8000/api/v2';
  secondaryUrlBase = 'https://lingueeni.onrender.com/api/v2';

  loaded = false;

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
  ) {}

  public async load(): Promise<boolean> {
    try {
      const res = !!await firstValueFrom(
        this.http.get<any>(`${this.primaryUrlBase}/translations?query=hello&src=en&dst=de`)
      );
      res ?
        this.notificationsService.push({message: 'Linguee loaded!', success: true}) :
        this.notificationsService.push({message: 'Couldn\'t load Linguee!', success: false});
      return res;
    }
    catch (err) {
      this.notificationsService.push({message: 'Couldn\'t load Linguee!', success: false});
      return false;
    }
  }

  public async getTranslationFromBase(query: string): Promise<Translation | null> {
    const base = await this.languageService.getBase();
    const goal = await this.languageService.getGoal();
    return this.getTranslation(query, base, goal);
  }

  public async getTranslationFromGoal(query: string): Promise<Translation | null> {
    const base = await this.languageService.getGoal();
    const goal = await this.languageService.getBase();
    return this.getTranslation(query, base, goal);
  }

  private async getTranslation(query: string, base: string, goal: string): Promise<Translation | null> {
    const params = new URLSearchParams({
      query,
      src: base,
      dst: goal
    }).toString();

    const results = await firstValueFrom(
      this.http.get<LingueeResult[]>(`${this.primaryUrlBase}/translations?${params}`)
    );

    this.notificationsService.push({
      message: 'Translation loaded!',
      success: true
    });

    return this.pickTranslation(results);
  }

  private pickTranslation(results: LingueeResult[]): Translation | null {
    const translations = results.filter((res) => {
      return res.featured && res.translations.length;
    })
    .map((res) => res.translations)
    .flat();

    const withExamples = translations.filter((trans) => trans.examples.length);
    if (withExamples.length) {
      return withExamples[0];
    }

    return translations.length ? translations[0] : null;
  }

}
