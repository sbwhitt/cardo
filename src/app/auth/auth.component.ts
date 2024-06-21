import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loading = false;

  signInForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    const creds = {
      email: this.signInForm.controls.email.value,
      password: this.signInForm.controls.password.value,
    };
    if (!creds.email || !creds.password) { return; }
    this.loading = true;
    this.authService.signIn(creds.email, creds.password).then((success) => {
      success ?
        this.router.navigate(['']) :
        this.loading = false;
    });
  }
}
