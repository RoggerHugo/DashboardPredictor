import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="alumnos-shell">
      <header class="header">
        <h2>Gestión de Alumnos</h2>
        <nav>
          <a routerLink="/alumnos" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Listado
          </a>
          <a routerLink="/alumnos/nuevo" routerLinkActive="active">Nuevo</a>
        </nav>
      </header>

      <section class="content">
        <!-- aquí se renderizarán las rutas hijas:
             - '' -> alumno-list.component
             - 'nuevo' -> alumno-form.component
             - 'editar/:id' -> alumno-form.component
             - 'detalle/:id' -> alumno-detail.component
        -->
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [
    `
      .alumnos-shell { font-family: Arial, sans-serif; max-width: 1100px; margin: 0 auto; }
      .header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid #eee; }
      nav a { margin-right:12px; text-decoration:none; color:#0b5fff; font-weight:600; }
      nav a.active { text-decoration:underline; }
      .content { padding:16px 0; }
    `,
  ],
})
export class AlumnosComponent {}
