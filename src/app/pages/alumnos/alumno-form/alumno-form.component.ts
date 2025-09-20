import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AlumnoService } from '../../../services/alumno.service';
import { ESTADO_CIVIL, TURNOS, CARRERAS } from '../../../data/masters';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <h2>Nuevo Alumno</h2>

    <form (ngSubmit)="guardar()">
      <label>Nombre Completo:</label>
      <input [(ngModel)]="alumno.nombreCompleto" name="nombreCompleto" required />

      <label>Matrícula:</label>
      <input [(ngModel)]="alumno.matricula" name="matricula" required />

      <label>Fecha Nacimiento:</label>
      <input type="date" [(ngModel)]="alumno.fechaNacimiento" name="fechaNacimiento" required />

      <label>Edad:</label>
      <input type="number" [(ngModel)]="alumno.edad" name="edad" required />

      <label>Estado Civil:</label>
      <select [(ngModel)]="alumno.estadoCivil" name="estadoCivil" required>
        <option *ngFor="let e of estadoCivilList" [value]="e">{{ e }}</option>
      </select>

      <label>Turno:</label>
      <select [(ngModel)]="alumno.turno" name="turno" required>
        <option *ngFor="let t of turnoList" [value]="t">{{ t }}</option>
      </select>

      <label>Carrera:</label>
      <select [(ngModel)]="alumno.carrera" name="carrera" required>
        <option *ngFor="let c of carreraList" [value]="c">{{ c }}</option>
      </select>

      <label>Activo:</label>
      <input type="checkbox" [(ngModel)]="alumno.activo" name="activo" />

      <div class="acciones">
        <button type="submit">Guardar</button>
        <button type="button" (click)="cerrar()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 8px; }
    label { font-weight: bold; }
    .acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
  `]
})
export class AlumnoFormComponent {
  alumno: Alumno = {
    id: 0,
    nombreCompleto: '',
    matricula: '',
    fechaNacimiento: '',
    edad: 0,
    estadoCivil: '',
    turno: '',
    carrera: '',
    activo: true,
    creadoEn: new Date().toISOString(),
  };

  estadoCivilList = ESTADO_CIVIL;
  turnoList = TURNOS;
  carreraList = CARRERAS;

  constructor(
    private dialogRef: MatDialogRef<AlumnoFormComponent>,
    private alumnoService: AlumnoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  guardar(): void {
    this.alumnoService.create(this.alumno).subscribe({
      next: (nuevo) => this.dialogRef.close(nuevo),
      error: (err) => console.error('Error al crear alumno', err),
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
