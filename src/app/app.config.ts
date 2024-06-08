import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      BrowserAnimationsModule,
      JwtModule.forRoot({
        config: {
            tokenGetter: () => localStorage.getItem('jwt'),
            allowedDomains: [],
            disallowedRoutes: [],
        },
    }),
    ])
  ]
};
