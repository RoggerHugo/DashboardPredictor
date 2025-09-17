import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AlumnoService, Alumno } from '../../../services/alumno.service';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  template: `
    <h2>{{ isEdit ? 'Editar Alumno' : 'Nuevo Alumno' }}</h2>
    <form *ngIf="alumno" (ngSubmit)="guardar()">
      <label>Nombre:</label>
      <input [(ngModel)]="alumno.nombreCompleto" name="nombreCompleto" required /><br />

      <label>Matrícula:</label>
      <input [(ngModel)]="alumno.matricula" name="matricula" required /><br />

      <label>Edad:</label>
      <input [(ngModel)]="alumno.edad" name="edad" type="number" required /><br />

      <label>Turno:</label>
      <select [(ngModel)]="alumno.turno" name="turno" required>
        <option *ngFor="let t of turnos" [value]="t">{{ t }}</option>
      </select><br />

      <label>Carrera:</label>
      <select [(ngModel)]="alumno.carrera" name="carrera" required>
        <option *ngFor="let c of carreras" [value]="c">{{ c }}</option>
      </select><br />

      <label>Estado Civil:</label>
      <select [(ngModel)]="alumno.estadoCivil" name="estadoCivil" required>
        <option *ngFor="let e of estadosCiviles" [value]="e">{{ e }}</option>
      </select><br />

      <label>Activo:</label>
      <input type="checkbox" [(ngModel)]="alumno.activo" name="activo" /><br />

      <button type="submit">Guardar</button>
    </form>

    <div *ngIf="!alumno">Cargando...</div>
  `,
})
export class AlumnoFormComponent implements OnInit {
  alumno: Partial<Alumno> = { activo: true };
  isEdit = false;
  id: number | null = null;

  // Tablas maestras internas
  turnos = ['Matutino', 'Vespertino', 'Nocturno'];
  carreras = [
    'Ing. en Animación Digital y Efectos Visuales',
    'Ing. en Sistemas',
    'Ing. Industrial',
  ];
  estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];

  constructor(
    private alumnoService: AlumnoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.alumnoService.getAlumno(this.id).subscribe({
        next: (data) => (this.alumno = data),
        error: (err) => console.error('Error al cargar alumno:', err),
      });
    }
  }

  guardar() {
    if (this.isEdit && this.id) {
      this.alumnoService.actualizarAlumno(this.id, this.alumno).subscribe({
        next: () => this.router.navigate(['/alumnos']),
        error: (err) => console.error('Error al actualizar alumno:', err),
      });
    } else {
      this.alumnoService.crearAlumno(this.alumno).subscribe({
        next: () => this.router.navigate(['/alumnos']),
        error: (err) => console.error('Error al crear alumno:', err),
      });
    }
  }
}
