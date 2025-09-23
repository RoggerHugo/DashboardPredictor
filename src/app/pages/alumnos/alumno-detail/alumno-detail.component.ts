import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AlumnoService } from '../../../services/alumno.service';
import { Alumno } from '../../../models/alumno.model';
import { TURNOS, CARRERAS, ESTADO_CIVIL } from '../../../data/masters';

@Component({
  selector: 'app-alumno-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Detalle de Alumno</h2>
    <div *ngIf="alumno">
      <p><strong>Nombre:</strong> {{ alumno.nombreCompleto }}</p>
      <p><strong>Matrícula:</strong> {{ alumno.matricula }}</p>
      <p><strong>Edad:</strong> {{ alumno.edad }}</p>
      <p><strong>Turno:</strong> {{ alumno.turno }}</p>
      <p><strong>Carrera:</strong> {{ alumno.carrera }}</p>
      <p><strong>Estado Civil:</strong> {{ alumno.estadoCivil }}</p>
      <p><strong>Activo:</strong> {{ alumno.activo ? 'Sí' : 'No' }}</p>
      <p><strong>Creado en:</strong> {{ alumno.creadoEn | date:'short' }}</p>
    </div>

    <div *ngIf="!alumno">Cargando...</div>
    <button routerLink="/alumnos">Volver al listado</button>
  `,
})
export class AlumnoDetailComponent implements OnInit {
  alumno: Alumno | null = null;
  id: number | null = null;

  // Asignar los datos importados a las propiedades del componente
  turnos = TURNOS;
  carreras = CARRERAS;
  estadosCiviles = ESTADO_CIVIL;

  constructor(private alumnoService: AlumnoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.alumnoService.getAlumno(this.id).subscribe({
        next: (data) => {
          this.alumno = data;
        },
        error: (err) => console.error('Error al cargar detalle del alumno:', err),
      });
    }
  }
}
