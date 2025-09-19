/* import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReporteService, Alumno } from './reporte.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Reporte de Alumnos</h2>

    <div *ngIf="!alumnos">Cargando...</div>

    <table *ngIf="alumnos" class="tabla-reporte">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Edad</th>
          <th>Turno</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of alumnos">
          <td>{{ a.nombreCompleto }}</td>
          <td>
            <a [routerLink]="['/detalle-reporte', a.matricula]">
              {{ a.matricula }}
            </a>
          </td>
          <td>{{ a.edad }}</td>
          <td>{{ a.turno }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
      .tabla-reporte {
        border-collapse: collapse;
        width: 100%;
      }
      .tabla-reporte th,
      .tabla-reporte td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      .tabla-reporte th {
        background-color: #f2f2f2;
        text-align: left;
      }
      a {
        color: #0b5fff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class ReporteComponent implements OnInit {
  alumnos: Alumno[] | null = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit() {
    this.reporteService.getAlumnos().subscribe({
      next: (data) => (this.alumnos = data),
      error: (err) => {
        console.error('Error al obtener alumnos', err);
        this.alumnos = []; 
        alert('Error al obtener alumnos, revisa la consola.');
      },
    });
  }
}
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReporteService } from './reporte.service';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <h2>Reporte de Alumnos</h2>

    <!-- Barra superior: búsqueda -->
    <div style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
      <input
        type="text"
        placeholder="Buscar por nombre, matrícula, carrera, turno o estado civil..."
        [(ngModel)]="searchTerm"
        (input)="aplicarFiltros()"
        style="padding:6px; width:420px;"
      />
      <span *ngIf="alumnos?.length">Mostrando {{ filteredAlumnos.length }} resultados</span>
    </div>

    <div *ngIf="!alumnos">Cargando...</div>

    <div *ngIf="alumnos">
      <table *ngIf="paginatedAlumnos.length; else noResults" class="tabla-reporte">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Matrícula</th>
            <th>Fecha Nacimiento</th>
            <th>Edad</th>
            <th>Estado Civil</th>
            <th>Turno</th>
            <th>Carrera</th>
            <th>Activo</th>
            <th>Creado En</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of paginatedAlumnos">
            <td>
              <!-- ID como enlace a la página de predicción (ruta preparada) -->
              <a [routerLink]="['/prediccion', a.id]">{{ a.id }}</a>
            </td>
            <td>{{ a.nombreCompleto }}</td>
            <td>
              <!-- Mantengo el enlace anterior para matrícula si quieres usarlo -->
              <a [routerLink]="['/detalle-reporte', a.matricula]">{{ a.matricula }}</a>
            </td>
            <td>{{ a.fechaNacimiento | date:'yyyy-MM-dd' }}</td>
            <td>{{ a.edad }}</td>
            <td>{{ a.estadoCivil }}</td>
            <td>{{ a.turno }}</td>
            <td>{{ a.carrera }}</td>
            <td>{{ a.activo ? 'Sí' : 'No' }}</td>
            <td>{{ a.creadoEn | date:'short' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="paginacion" *ngIf="totalPages > 1">
        <button (click)="cambiarPagina(currentPage - 1)" [disabled]="currentPage === 1">◀ Anterior</button>

        <ng-container *ngFor="let p of pageNumbers">
          <button
            (click)="cambiarPagina(p)"
            [class.active]="p === currentPage"
          >
            {{ p }}
          </button>
        </ng-container>

        <button (click)="cambiarPagina(currentPage + 1)" [disabled]="currentPage === totalPages">Siguiente ▶</button>
      </div>
    </div>

    <ng-template #noResults>
      <div>No se encontraron registros que coincidan con la búsqueda.</div>
    </ng-template>
  `,
  styles: [
    `
      .tabla-reporte {
        border-collapse: collapse;
        width: 100%;
      }
      .tabla-reporte th,
      .tabla-reporte td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      .tabla-reporte th {
        background-color: #f2f2f2;
        text-align: left;
      }
      a { color: #0b5fff; text-decoration: none; }
      a:hover { text-decoration: underline; }

      .paginacion {
        margin-top: 12px;
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .paginacion button {
        padding: 6px 10px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .paginacion button.active {
        background: #0b5fff;
        color: white;
        border-color: #0b5fff;
      }
      .paginacion button[disabled] {
        opacity: 0.5;
        cursor: default;
      }
    `,
  ],
})
export class ReporteComponent implements OnInit {
  alumnos: Alumno[] | null = null;
  filteredAlumnos: Alumno[] = [];

  // Búsqueda y paginación
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;

  constructor(private reporteService: ReporteService) {}

  ngOnInit() {
    this.reporteService.getAlumnos().subscribe({
      next: (data) => {
        // asumimos que getAlumnos devuelve los campos requeridos
        this.alumnos = data;
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error al obtener alumnos', err);
        this.alumnos = [];
        alert('Error al obtener alumnos, revisa la consola.');
      },
    });
  }

  aplicarFiltros() {
    if (!this.alumnos) {
      this.filteredAlumnos = [];
      return;
    }

    const term = this.searchTerm?.trim().toLowerCase() ?? '';

    if (term === '') {
      this.filteredAlumnos = [...this.alumnos];
    } else {
      this.filteredAlumnos = this.alumnos.filter((a) => {
        return (
          (a.nombreCompleto ?? '').toLowerCase().includes(term) ||
          (a.matricula ?? '').toLowerCase().includes(term) ||
          (a.carrera ?? '').toLowerCase().includes(term) ||
          (a.turno ?? '').toLowerCase().includes(term) ||
          (a.estadoCivil ?? '').toLowerCase().includes(term) ||
          String(a.id).includes(term)
        );
      });
    }

    // reset página al aplicar filtro
    this.currentPage = 1;
  }

  get paginatedAlumnos(): Alumno[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAlumnos.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAlumnos.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  cambiarPagina(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    // opcional: desplazar hacia arriba del listado
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
