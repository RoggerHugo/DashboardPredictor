// src/app/pages/alumnos/alumno-form/alumno-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ESTADO_CIVIL, TURNOS, CARRERAS } from '../../../data/masters';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.scss'],
})
export class AlumnoFormComponent {
  alumnoForm: FormGroup;
  estadosCiviles = ESTADO_CIVIL;
  turnos = TURNOS;
  carreras = CARRERAS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AlumnoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Alumno | null
  ) {
    this.alumnoForm = this.fb.group({
      id: [data?.id ?? null],
      nombreCompleto: [data?.nombreCompleto ?? '', Validators.required],
      matricula: [data?.matricula ?? '', Validators.required],
      fechaNacimiento: [data?.fechaNacimiento ?? '', Validators.required],
      edad: [data?.edad ?? null, Validators.required],
      estadoCivil: [data?.estadoCivil ?? '', Validators.required],
      turno: [data?.turno ?? '', Validators.required],
      carrera: [data?.carrera ?? '', Validators.required],
      activo: [data?.activo ?? false],
      creadoEn: [data?.creadoEn ?? new Date().toISOString()],
    });
  }

  onSave() {
    if (this.alumnoForm.valid) {
      this.dialogRef.close(this.alumnoForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
