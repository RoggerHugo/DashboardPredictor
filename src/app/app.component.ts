import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  template: `
    <div class="container">
      <h1>Clasificador de riesgo de abandono académico </h1>

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
      next: (res: any) => {
        const token =
          typeof res === 'string'
            ? res
            : res?.token ?? res?.accessToken ?? res?.jwt;

        if (!token) {
          console.error('No llegó token en la respuesta:', res);
          alert('Login fallido: respuesta inválida');
          return;
        }

        localStorage.setItem('auth_token', token);
        this.isLoggedIn = true;                 
        this.router.navigate(['/reporte']);     
      },
      error: (err) => {
        console.error('Error login', err);
        alert('Login fallido');
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
