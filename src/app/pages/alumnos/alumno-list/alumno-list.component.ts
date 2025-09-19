// src/app/pages/alumnos/alumno-list/alumno-list.component.ts
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { AlumnoService } from '../../../services/alumno.service';
import { Alumno } from '../../../models/alumno.model';
import { AlumnoFormComponent } from '../alumno-form/alumno-form.component';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  templateUrl: './alumno-list.component.html',
  styleUrls: ['./alumno-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule
  ]
})
export class AlumnoListComponent implements OnInit {
  private alumnoService = inject(AlumnoService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'id',
    'nombreCompleto',
    'matricula',
    'fechaNacimiento',
    'edad',
    'estadoCivil',
    'turno',
    'carrera',
    'activo',
    'creadoEn',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Alumno>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error al cargar alumnos', err);
      }
    });
  }

  aplicarFiltro(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  editarAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '600px',
      data: alumno
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarAlumnos();
      }
    });
  }

  eliminarAlumno(id: number) {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      this.alumnoService.delete(id).subscribe({
        next: () => this.cargarAlumnos(),
        error: (err) => console.error('Error al eliminar alumno', err)
      });
    }
  }

  addAlumno(): void {
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAlumnos();
      }
    });
  }

}
