import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { ReporteService } from './reporte.service';
import { Alumno } from '../../models/alumno.model';
import { PrediccionService } from '../../services/prediccion.service';
import { ApiResponse } from '../../models/prediccion.model';
import { PrediccionDetailComponent } from '../prediccion/prediccion-detail.component';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="reporte-container">
      <div class="header-bar">
        <h2>Reporte de Alumnos con Riesgo de Abandono</h2>
        <button mat-stroked-button color="primary" (click)="irHome()">
          <mat-icon>home</mat-icon> Inicio
        </button>
      </div>
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <mat-icon>search</mat-icon>
        <input
          matInput
          placeholder="Buscar por nombre, matrícula, carrera, turno o estado civil..."
          [(ngModel)]="searchTerm"
          (input)="aplicarFiltros()"
        />
        <span *ngIf="alumnos?.length" class="resultado">
          Mostrando {{ filteredAlumnos.length }} resultados
        </span>
      </div>

      <div *ngIf="!alumnos" class="cargando">Cargando alumnos...</div>

      <div *ngIf="alumnos">
        <table mat-table [dataSource]="paginatedAlumnos" class="mat-elevation-z8 tabla-reporte">

          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let a">
              <a href="javascript:void(0)" (click)="verPrediccion(a.id)">{{ a.id }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="nombreCompleto">
            <th mat-header-cell *matHeaderCellDef>Nombre Completo</th>
            <td mat-cell *matCellDef="let a">{{ a.nombreCompleto }}</td>
          </ng-container>

          <ng-container matColumnDef="matricula">
            <th mat-header-cell *matHeaderCellDef>Matrícula</th>
            <td mat-cell *matCellDef="let a">{{ a.matricula }}</td>
          </ng-container>

          <ng-container matColumnDef="edad">
            <th mat-header-cell *matHeaderCellDef>Edad</th>
            <td mat-cell *matCellDef="let a">{{ a.edad }}</td>
          </ng-container>

          <ng-container matColumnDef="estadoCivil">
            <th mat-header-cell *matHeaderCellDef>Estado Civil</th>
            <td mat-cell *matCellDef="let a">{{ a.estadoCivil }}</td>
          </ng-container>

          <ng-container matColumnDef="turno">
            <th mat-header-cell *matHeaderCellDef>Turno</th>
            <td mat-cell *matCellDef="let a">{{ a.turno }}</td>
          </ng-container>

          <ng-container matColumnDef="carrera">
            <th mat-header-cell *matHeaderCellDef>Carrera</th>
            <td mat-cell *matCellDef="let a">{{ a.carrera }}</td>
          </ng-container>

          <ng-container matColumnDef="activo">
            <th mat-header-cell *matHeaderCellDef>Activo</th>
            <td mat-cell *matCellDef="let a">{{ a.activo ? 'Sí' : 'No' }}</td>
          </ng-container>

          <ng-container matColumnDef="creadoEn">
            <th mat-header-cell *matHeaderCellDef>Creado En</th>
            <td mat-cell *matCellDef="let a">{{ a.creadoEn | date:'short' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>

        <!-- Paginación -->
        <div class="paginacion" *ngIf="totalPages > 1">
          <button mat-button (click)="cambiarPagina(currentPage - 1)" [disabled]="currentPage === 1">
            ◀ Anterior
          </button>

          <ng-container *ngFor="let p of pageNumbers">
            <button mat-button (click)="cambiarPagina(p)" [color]="p===currentPage?'primary':''">{{ p }}</button>
          </ng-container>

          <button mat-button (click)="cambiarPagina(currentPage + 1)" [disabled]="currentPage === totalPages">
            Siguiente ▶
          </button>
        </div>
      </div>

      <ng-template #noResults>
        <div class="no-results">No se encontraron registros que coincidan con la búsqueda.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reporte-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .header-bar { 
      display:flex; 
      align-items:center; 
      justify-content:space-between; 
      margin-bottom: 16px; }

    h2 {
      text-align: center;
      color: #0b5fff;
      margin-bottom: 1.5rem;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .search-bar mat-icon {
      color: #0b5fff;
    }

    .search-bar input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .resultado {
      margin-left: 16px;
      font-weight: bold;
      color: #555;
    }

    .cargando, .no-results {
      text-align: center;
      margin-top: 20px;
      color: #777;
    }

    table.tabla-reporte {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }

    th.mat-header-cell, td.mat-cell {
      padding: 8px 12px;
      text-align: left;
    }

    th.mat-header-cell {
      background-color: #0b5fff;
      color: white;
      font-weight: bold;
    }

    tr.mat-row:nth-child(even) {
      background-color: #f5f7fa;
    }

    a {
      color: #0b5fff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .paginacion {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin-top: 16px;
    }
  `]
})
export class ReporteComponent implements OnInit {
  alumnos: Alumno[] | null = null;
  filteredAlumnos: Alumno[] = [];
  columnas: string[] = ['id','nombreCompleto','matricula','edad','estadoCivil','turno','carrera','activo','creadoEn'];

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;

  constructor(
    private reporteService: ReporteService,
    private prediccionService: PrediccionService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.reporteService.getAlumnos().subscribe({
      next: (data) => {
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
    if (!this.alumnos) { this.filteredAlumnos = []; return; }

    const term = this.searchTerm?.trim().toLowerCase() ?? '';
    this.filteredAlumnos = term === '' ? [...this.alumnos]
      : this.alumnos.filter(a => 
          (a.nombreCompleto ?? '').toLowerCase().includes(term) ||
          (a.matricula ?? '').toLowerCase().includes(term) ||
          (a.carrera ?? '').toLowerCase().includes(term) ||
          (a.turno ?? '').toLowerCase().includes(term) ||
          (a.estadoCivil ?? '').toLowerCase().includes(term) ||
          String(a.id).includes(term)
        );

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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  cambiarPagina(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  verPrediccion(id: number) {
    this.prediccionService.getPrediccion(id).subscribe({
      // La función espera 'ApiResponse'
      next: (response: ApiResponse) => {
        this.dialog.open(PrediccionDetailComponent, {
          width: '600px',
          // Pasamos el objeto de respuesta COMPLETO al diálogo
          data: response
        });
      },
      error: (err) => {
        console.error('Error al obtener predicción', err);
        alert('Error al obtener detalle de la predicción.');
      }
    });
  }

    irHome(): void {
    this.router.navigate(['/home']); // 👈 Ahora va al menú principal
  }
}
