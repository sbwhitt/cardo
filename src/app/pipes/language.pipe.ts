import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'language',
  standalone: true
})
export class LanguagePipe implements PipeTransform {

  constructor(
    private languageService: LanguageService
  ) {}

  private name(code: string): string {
    switch(code) {
      case "en-us":
        return "English";
      case "es":
        return "Spanish";
      case "de":
        return "German";
      default:
        return "Unknown";
    }
  }

  async transform(value: 'base' | 'goal'): Promise<string> {
    switch(value) {
      case 'base': {
        const lang = this.name(await this.languageService.getBase());
        if (lang === 'Unknown') { return "Base"; }
        return lang;
      }
      case 'goal': {
        const lang = this.name(await this.languageService.getGoal());
        if (lang === 'Unknown') { return "Goal"; }
        return lang;
      }
      default:
        return 'Unknown';
    }
  }

}
