import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { AlumnoService } from '../../../services/alumno.service';
import { ESTADO_CIVIL, TURNOS, CARRERAS } from '../../../data/masters';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './alumno-form.component.html',
  styles: [`
    .form-container {
      position: relative;
      z-index: 10;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class AlumnoFormComponent implements OnInit {
  
  alumnoForm: FormGroup;

  estadosCiviles = ESTADO_CIVIL;
  turnos = TURNOS;
  carreras = CARRERAS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AlumnoFormComponent>,
    private alumnoService: AlumnoService,
    @Inject(MAT_DIALOG_DATA) public data?: Alumno
  ) {
    this.alumnoForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      matricula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(1)]],
      estadoCivilId: [null, Validators.required],
      turnoId: [null, Validators.required],
      carreraId: [null, Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
   if (this.data) {
    const estadoCivil = typeof this.data.estadoCivil === 'string'
      ? this.estadosCiviles.find(e => e.nombre === this.data?.estadoCivil)?.id
      : this.data.estadoCivil; // si ya es id

    const turno = typeof this.data.turno === 'string'
      ? this.turnos.find(t => t.nombre === this.data?.turno)?.id
      : this.data.turno;

    const carrera = typeof this.data.carrera === 'string'
      ? this.carreras.find(c => c.nombre === this.data?.carrera)?.id
      : this.data.carrera;

    this.alumnoForm.patchValue({
      ...this.data,
      estadoCivilId: estadoCivil,
      turnoId: turno,
      carreraId: carrera
    });
    }
  }

  onSelectionChange(event: MatSelectChange, controlName: string): void {
    console.log(`✅ Cambio en '${controlName}'. Nuevo valor: ${event.value}`);
  }

  onSave(): void {
    if (this.alumnoForm.invalid) {
      console.error('El formulario es inválido.');
      this.alumnoForm.markAllAsTouched();
      return;
    }

    const formValues = this.alumnoForm.value;

    // 🚀 Solo incluimos el id del alumno (si existe) + valores del formulario
    const alumnoParaGuardar: Alumno = {
      id: this.data?.id, 
      ...formValues
    };

    console.log('Payload final que se enviará a la API:', alumnoParaGuardar);

    const request = this.data
      ? this.alumnoService.update(alumnoParaGuardar)
      : this.alumnoService.create(alumnoParaGuardar);

    request.subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error('Error al guardar alumno:', err),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
