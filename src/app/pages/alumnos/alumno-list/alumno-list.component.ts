import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { Alumno } from '../../../models/alumno.model';
import { AlumnoService } from '../../../services/alumno.service';
import { AlumnoFormModalComponent } from '../alumno-form/alumno-form-modal.component';

import { ESTADO_CIVIL, TURNOS, CARRERAS } from '../../../data/masters';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="acciones-superiores">
      <button mat-raised-button color="primary" (click)="abrirModalNuevo()">
        <mat-icon>add</mat-icon> Nuevo Alumno
      </button>
    </div>

    <table mat-table [dataSource]="alumnos" class="mat-elevation-z8 full-width">

      <!-- ID -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let a">{{ a.id }}</td>
      </ng-container>

      <!-- Nombre Completo -->
      <ng-container matColumnDef="nombreCompleto">
        <th mat-header-cell *matHeaderCellDef>Nombre Completo</th>
        <td mat-cell *matCellDef="let a">
          <input [(ngModel)]="a.nombreCompleto" [readonly]="!a.editando" />
        </td>
      </ng-container>

      <!-- Matrícula -->
      <ng-container matColumnDef="matricula">
        <th mat-header-cell *matHeaderCellDef>Matrícula</th>
        <td mat-cell *matCellDef="let a">
          <input [(ngModel)]="a.matricula" [readonly]="!a.editando" />
        </td>
      </ng-container>

      <!-- Fecha Nacimiento -->
      <ng-container matColumnDef="fechaNacimiento">
        <th mat-header-cell *matHeaderCellDef>Fecha Nacimiento</th>
        <td mat-cell *matCellDef="let a">
          <input type="date" [(ngModel)]="a.fechaNacimiento" [disabled]="!a.editando" />
        </td>
      </ng-container>

      <!-- Edad -->
      <ng-container matColumnDef="edad">
        <th mat-header-cell *matHeaderCellDef>Edad</th>
        <td mat-cell *matCellDef="let a">
          <input type="number" [(ngModel)]="a.edad" [readonly]="!a.editando" />
        </td>
      </ng-container>

      <!-- Estado Civil -->
      <ng-container matColumnDef="estadoCivil">
        <th mat-header-cell *matHeaderCellDef>Estado Civil</th>
        <td mat-cell *matCellDef="let a">
          <select [(ngModel)]="a.estadoCivil" [disabled]="!a.editando">
            <option *ngFor="let e of estadoCivilList" [value]="e.nombre">
              {{ e.nombre }}
            </option>
          </select>
        </td>
      </ng-container>

      <!-- Turno -->
      <ng-container matColumnDef="turno">
        <th mat-header-cell *matHeaderCellDef>Turno</th>
        <td mat-cell *matCellDef="let a">
          <select [(ngModel)]="a.turno" [disabled]="!a.editando">
            <option *ngFor="let t of turnoList" [value]="t.nombre">
              {{ t.nombre }}
            </option>
          </select>
        </td>
      </ng-container>

      <!-- Carrera -->
      <ng-container matColumnDef="carrera">
        <th mat-header-cell *matHeaderCellDef>Carrera</th>
        <td mat-cell *matCellDef="let a">
          <select [(ngModel)]="a.carrera" [disabled]="!a.editando">
            <option *ngFor="let c of carreraList" [value]="c.nombre">
              {{ c.nombre }}
            </option>
          </select>
        </td>
      </ng-container>

      <!-- Activo -->
      <ng-container matColumnDef="activo">
        <th mat-header-cell *matHeaderCellDef>Activo</th>
        <td mat-cell *matCellDef="let a">
          <input type="checkbox" [(ngModel)]="a.activo" [disabled]="!a.editando" />
        </td>
      </ng-container>

      <!-- Creado En -->
      <ng-container matColumnDef="creadoEn">
        <th mat-header-cell *matHeaderCellDef>Creado En</th>
        <td mat-cell *matCellDef="let a">{{ a.creadoEn | date:'short' }}</td>
      </ng-container>

      <!-- Acciones -->
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let a">
          <button mat-icon-button color="primary" *ngIf="!a.editando" (click)="editar(a)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="accent" *ngIf="a.editando" (click)="guardar(a)">
            <mat-icon>save</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="eliminar(a.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <!-- Header y Rows -->
      <tr mat-header-row *matHeaderRowDef="columnas"></tr>
      <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`
    .full-width { width: 100%; margin-top: 16px; }
    .acciones-superiores { display: flex; justify-content: flex-end; margin-bottom: 12px; }
    input, select { width: 100%; border: none; background: transparent; }
    input[readonly], select[disabled] { color: #444; background: transparent; }
    input:focus, select:focus { outline: 1px solid #1976d2; background: #eef6ff; }
  `]
})
export class AlumnoListComponent implements OnInit {
  alumnos: Alumno[] = [];
  columnas: string[] = [
    'id','nombreCompleto','matricula','fechaNacimiento','edad',
    'estadoCivil','turno','carrera','activo','creadoEn','acciones'
  ];

  estadoCivilList = ESTADO_CIVIL;
  turnoList = TURNOS;
  carreraList = CARRERAS;

  constructor(private alumnoService: AlumnoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => (this.alumnos = data.map(a => ({ ...a, editando: false }))),
      error: (err) => console.error('Error cargando alumnos', err),
    });
  }

  editar(alumno: any): void {
    alumno.editando = true;
  }

  guardar(alumno: any): void {
    alumno.editando = false;
    this.alumnoService.update(alumno).subscribe({
      next: (a) => console.log('Alumno actualizado', a),
      error: (err) => console.error('Error actualizando', err),
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este alumno?')) {
      this.alumnoService.inactivar(id).subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(a => a.id !== id);
        },
        error: (err) => console.error('Error eliminando alumno', err),
      });
    }
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(AlumnoFormModalComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe((nuevoAlumno: Alumno | null) => {
      if (nuevoAlumno) {
        this.alumnos.push({ ...nuevoAlumno, editando: false });
        this.alumnos = [...this.alumnos]; // refrescar tabla
      }
    });
  }
}
