import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AlumnoService, Alumno } from '../../../services/alumno.service';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <h2>Listado de Alumnos</h2>
    <button routerLink="/alumnos/nuevo">Nuevo Alumno</button>

    <table *ngIf="alumnos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Edad</th>
          <th>Turno</th>
          <th>Carrera</th>
          <th>Estado Civil</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of alumnos">
          <td>{{ a.nombreCompleto }}</td>
          <td>{{ a.matricula }}</td>
          <td>{{ a.edad }}</td>
          <td>{{ a.turno }}</td>
          <td>{{ a.carrera }}</td>
          <td>{{ a.estadoCivil }}</td>
          <td>{{ a.activo ? 'Sí' : 'No' }}</td>
          <td>
            <button [routerLink]="['/alumnos/editar', a.id]">Editar</button>
            <button [routerLink]="['/alumnos/detalle', a.id]">Detalle</button>
            <button (click)="toggleActivo(a)">{{ a.activo ? 'Inactivar' : 'Activar' }}</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="!alumnos">Cargando...</div>
  `,
})
export class AlumnoListComponent implements OnInit {
  alumnos: Alumno[] | null = null;

  constructor(private alumnoService: AlumnoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => (this.alumnos = data),
      error: (err) => console.error('Error al cargar alumnos:', err),
    });
  }

  toggleActivo(alumno: Alumno) {
    this.alumnoService.activarInactivar(alumno.id, !alumno.activo).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error al cambiar estado:', err),
    });
  }
}
