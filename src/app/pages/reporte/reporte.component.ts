import { Component, OnInit } from '@angular/core';
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
