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
    <div class="header">
        <!-- Encabezado global -->
      <header class="header">
        <h1>Clasificador de riesgo de abandono académico</h1>
        <img src="LogoTeschi.jpeg" alt="Logo del sistema" class="logo" />
        
      </header>
    </div>

    <div class="container">
      <!-- Login -->
      <div *ngIf="!isLoggedIn" class="login-box">
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

      <!-- Resto de la app -->
      <div *ngIf="isLoggedIn">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .container { 
      padding: 20px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      width: 400px;
      margin-bottom: 20px;
    }
    .login-box {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      max-width: 320px;
      width: 100%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    input {
      margin-bottom: 10px;
      width: 100%;
      padding: 6px;
    }
    button {
      width: 100%;
      padding: 8px;
      font-weight: bold;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #135ba1;
    }
  `],
})
export class AppComponent {
  username = 'admin';
  password = 'admin123';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
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
