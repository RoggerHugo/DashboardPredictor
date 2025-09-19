// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <h2>Login</h2>

    <form (ngSubmit)="login()">
      <label>Usuario:</label>
      <input [(ngModel)]="username" name="username" required />

      <br />

      <label>Contraseña:</label>
      <input [(ngModel)]="password" name="password" type="password" required />

      <br />

      <button type="submit" [disabled]="loading || !username || !password">
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.loading) return;
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        
        this.loading = false;
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        this.loading = false;
        console.error('[LOGIN] error', err);
        alert(err?.error?.message ?? 'Login fallido');
      },
    });
  }
}
