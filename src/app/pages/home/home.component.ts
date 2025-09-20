import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="home-container">
      <h1>Bienvenido al Sistema de Predicción Académica</h1>

      <nav class="home-nav">
        <a routerLink="/reporte" class="home-link">📊 Ver Reporte</a>
        <a routerLink="/alumnos" class="home-link">👨‍🎓 Gestión de Alumnos</a>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f5f7fa;
    }

    h1 {
      margin-bottom: 2rem;
      color: #0b5fff;
      text-align: center;
    }

    .home-nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 300px;
      text-align: center;
    }

    .home-link {
      display: block;
      padding: 12px 20px;
      background-color: #0b5fff;
      color: white;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
      transition: background-color 0.3s, transform 0.2s;
    }

    .home-link:hover {
      background-color: #094ecb;
      transform: translateY(-2px);
    }
  `]
})
export class HomeComponent {}
