import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

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
      <button type="submit">Ingresar</button>
    </form>
  `,
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        console.log('Token guardado:', token);
        this.router.navigate(['/reporte']);
      },
      error: (err) => {
        console.error('Error login', err);
        alert('Login fallido');
      },
    });
  }
}
