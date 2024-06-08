import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { JwtHelperService } from '@auth0/angular-jwt';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

  constructor(
    public jwtHelper: JwtHelperService,
    public router: Router
  ) {
    onAuthStateChanged(getAuth(this.firebaseApp), (user) => {
      if (!user) { this.signOut(); }
    });
  }

  async signIn(email: string, password: string) {
    const auth = getAuth(this.firebaseApp);
    return signInWithEmailAndPassword(auth, email, password).then(async (res) => {
      const token = await res.user.getIdToken();
      localStorage.setItem('jwt', token);
      return true;
    })
    .catch(() => {
      return false;
    });
  }

  signOut() {
    const auth = getAuth(this.firebaseApp);
    auth.signOut();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token || this.jwtHelper.isTokenExpired(token)) { return false; }
    const decoded = this.jwtHelper.decodeToken(token);
    if (!decoded.email) { return false; }
    return true;
  }

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
