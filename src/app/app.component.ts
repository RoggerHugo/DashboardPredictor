import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  template: `
    <div class="container">
      <h1>TesisIA - Sistema de Alumnos</h1>

      <!-- Login -->
      <div *ngIf="!isLoggedIn">
        <h2>Login</h2>
        <form (ngSubmit)="login()">
          <label>Usuario:</label>
          <input [(ngModel)]="username" name="username" required />
          <br />
          <label>Contraseña:</label>
          <input [(ngModel)]="password" name="password" type="password" required />
          <br />
          <button type="submit">Ingresar</button>
        </form>
      </div>

      <!-- Contenido protegido -->
      <div *ngIf="isLoggedIn">
        <button (click)="logout()">Cerrar sesión</button>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .container { padding: 20px; }
      input { margin-bottom: 10px; }
    `,
  ],
})
export class AppComponent {
  username = 'admin';
  password = 'admin123';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    // Verificar si ya hay token al iniciar la app
    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        // token ya es string, no es objeto
        localStorage.setItem('auth_token', token);
        console.log('Token guardado en localStorage:', token);
        this.isLoggedIn = true;
        this.router.navigate(['/reporte']);
      },
      error: (err) => {
        console.error('Login fallido', err);
        alert('Login fallido. Revisa usuario/contraseña.');
      },
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.username = '';
    this.password = '';
    this.router.navigate(['/login']);
  }
}
