// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <h2 class="login-title">Iniciar Sesión</h2>

        <form (ngSubmit)="login()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="username" name="username" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input
              matInput
              [(ngModel)]="password"
              name="password"
              type="password"
              required
            />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="full-width"
            [disabled]="loading || !username || !password"
          >
            {{ loading ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f7fa;
      }
      .login-card {
        width: 350px;
        padding: 24px;
        text-align: center;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
      }
      .login-title {
        margin-bottom: 16px;
        font-weight: 500;
        color: #1976d2;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
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
