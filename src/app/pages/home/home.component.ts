import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Bienvenido al sistema TesisIA</h1>
    <nav>
      <ul>
        <li><a routerLink="/reporte">📊 Ver Reporte</a></li>
        <li><a routerLink="/alumnos">👨‍🎓 CRUD Alumno</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    h1 { margin-bottom: 1rem; }
    nav ul { list-style: none; padding: 0; }
    nav li { margin: 0.5rem 0; }
    nav a { text-decoration: none; font-weight: bold; }
  `]
})
export class HomeComponent {}
