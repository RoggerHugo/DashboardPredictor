import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { Alumno } from '../../../models/alumno.model';
import { AlumnoService } from '../../../services/alumno.service';
import { ESTADO_CIVIL, CARRERAS, TURNOS } from '../../../data/masters'; 

@Component({
  selector: 'app-alumno-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  template: `
    <h2>{{ alumno.id && alumno.id > 0 ? 'Editar Alumno' : 'Nuevo Alumno' }}</h2>

    <form (ngSubmit)="guardar()" style="display:flex; flex-direction:column; gap:8px; max-width:700px;">
      <label>
        Nombre completo
        <input matInput name="nombreCompleto" [(ngModel)]="alumno.nombreCompleto" required />
      </label>

      <label>
        Matrícula
        <input matInput name="matricula" [(ngModel)]="alumno.matricula" required />
      </label>

      <label>
        Fecha de nacimiento
        <input matInput type="date" name="fechaNacimiento" [(ngModel)]="alumno.fechaNacimiento" />
      </label>

      <label>
        Edad
        <input matInput type="number" name="edad" [(ngModel)]="alumno.edad" />
      </label>

      <label>
        Estado civil
        <select name="estadoCivil" [(ngModel)]="alumno.estadoCivil">
          <option *ngFor="let e of estados" [value]="e.nombre">{{ e.nombre }}</option>
        </select>
      </label>

      <label>
        Turno
        <select name="turno" [(ngModel)]="alumno.turno">
          <option *ngFor="let t of turnos" [value]="t.nombre">{{ t.nombre }}</option>
        </select>
      </label>

      <label>
        Carrera
        <select name="carrera" [(ngModel)]="alumno.carrera">
          <option *ngFor="let c of carreras" [value]="c.nombre">{{ c.nombre }}</option>
        </select>
      </label>

      <label style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" name="activo" [(ngModel)]="alumno.activo" />
        Activo
      </label>

      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
        <button mat-button type="button" (click)="cerrar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit">Guardar</button>
      </div>
    </form>
  `,
  styles: [
    `
      h2 { margin-bottom: 12px; }
      label { display:block; }
      input, select { width:100%; padding:6px; margin-top:4px; box-sizing:border-box; }
    `,
  ],
})
export class AlumnoFormModalComponent {
  estados = ESTADO_CIVIL ?? [];
  carreras = CARRERAS ?? [];
  turnos = TURNOS ?? [];

  // Valores por defecto que cumplen la interfaz Alumno
  alumno: Alumno = {
    id: 0,
    nombreCompleto: '',
    matricula: '',
    fechaNacimiento: new Date().toISOString().split('T')[0], // yyyy-MM-dd
    edad: 18,
    estadoCivil: this.estados.length ? this.estados[0].nombre : 'Soltero',
    turno: this.turnos.length ? this.turnos[0].nombre : 'Matutino',
    carrera: this.carreras.length ? this.carreras[0].nombre : 'Ing. de Sistemas',
    activo: true,
    creadoEn: new Date().toISOString()
  };

  constructor(
    private alumnoService: AlumnoService,
    private dialogRef: MatDialogRef<AlumnoFormModalComponent>
  ) {}

  guardar() {
    // Si el objeto ya tiene id > 0, asumo actualización, sino creación
    if (this.alumno.id && this.alumno.id > 0) {
      // usa el método update/create que tengas en tu servicio
      this.alumnoService.update(this.alumno).subscribe({
        next: () => this.dialogRef.close('ok'),
        error: (err) => {
          console.error('Error al actualizar alumno', err);
          alert('Error al actualizar alumno');
        }
      });
    } else {
      this.alumnoService.create(this.alumno).subscribe({
        next: () => this.dialogRef.close('ok'),
        error: (err) => {
          console.error('Error al crear alumno', err);
          alert('Error al crear alumno');
        }
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
