import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import { Alumno } from '../../../models/alumno.model';
import { AlumnoService } from '../../../services/alumno.service';
import { AlumnoFormModalComponent } from '../alumno-form/alumno-form-modal.component';
import { ESTADO_CIVIL, TURNOS, CARRERAS } from '../../../data/masters';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    MatInputModule // Se añade el módulo del input
  ],
  // Se integra el HTML directamente en el componente
  template: `
    <div class="header-bar">
      <h2>Gestión de Alumnos</h2>
      <button mat-stroked-button color="primary" (click)="irHome()">
        <mat-icon>home</mat-icon> Inicio
      </button>
    </div>

    <div class="controles-superiores">
      <div class="search-bar">
        <mat-icon>search</mat-icon>
        <input
          matInput
          placeholder="Buscar por nombre, matrícula, carrera, turno o estado civil..."
          [(ngModel)]="searchTerm"
          (input)="aplicarFiltro()"
          aria-label="Buscar Alumno"
        />
        <span *ngIf="dataSource.data?.length" class="resultado">
           Mostrando {{ dataSource.filteredData.length }} de {{ dataSource.data.length }}
        </span>
      </div>

      <button mat-raised-button color="primary" (click)="abrirModalNuevo()">
        <mat-icon>add</mat-icon> Nuevo Alumno
      </button>
    </div>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8 full-width">

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
      <ng-container matColumnDef="estadoCivilId">
        <th mat-header-cell *matHeaderCellDef>Estado Civil</th>
        <td mat-cell *matCellDef="let a">
          <span *ngIf="!a.editando">{{ a.estadoCivil }}</span>
          <select *ngIf="a.editando" [(ngModel)]="a.estadoCivilId">
            <option *ngFor="let e of estadoCivilList" [value]="e.id">
              {{ e.nombre }}
            </option>
          </select>
        </td>
      </ng-container>

      <!-- Turno -->
      <ng-container matColumnDef="turnoId">
        <th mat-header-cell *matHeaderCellDef>Turno</th>
        <td mat-cell *matCellDef="let a">
          <span *ngIf="!a.editando">{{ a.turno }}</span>
          <select *ngIf="a.editando" [(ngModel)]="a.turnoId">
            <option *ngFor="let t of turnoList" [value]="t.id">
              {{ t.nombre }}
            </option>
          </select>
        </td>
      </ng-container>

      <!-- Carrera -->
      <ng-container matColumnDef="carreraId">
        <th mat-header-cell *matHeaderCellDef>Carrera</th>
        <td mat-cell *matCellDef="let a">
          <span *ngIf="!a.editando">{{ a.carrera }}</span>
          <select *ngIf="a.editando" [(ngModel)]="a.carreraId">
            <option *ngFor="let c of carreraList" [value]="c.id">
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

    <!-- Paginador -->
    <mat-paginator [pageSizeOptions]="[7, 14, 21]" showFirstLastButtons></mat-paginator>
  `,
  // Se integran los estilos directamente en el componente
  styles: [`
    .full-width { width: 100%; margin-top: 16px; }
    .header-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
    h2 { text-align: center; color: #0b5fff; }
    input, select { width: 100%; border: none; background: transparent; font-size: 13px; }
    input[readonly], select[disabled] { color: #444; background: transparent; }
    input:focus, select:focus { outline: 1px solid #1976d2; background: #eef6ff; }
    /* Estilos para el texto en modo no editable */
    td span {
      display: block;
      padding: 5px 2px; /* Alineación similar al input/select */
    }
    
    .controles-superiores {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-grow: 1; /* Permite que la barra de búsqueda ocupe el espacio disponible */
      margin-right: 16px; /* Espacio entre la búsqueda y el botón */
    }
    .search-bar mat-icon {
      color: #0b5fff;
    }
    .search-bar input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .resultado {
      margin-left: 16px;
      font-weight: bold;
      color: #555;
    }

    /* Estilos compactos */
    :host ::ng-deep .mat-mdc-row,
    :host ::ng-deep .mat-mdc-header-row {
      height: 32px; 
    }
    :host ::ng-deep .mat-mdc-cell,
    :host ::ng-deep .mat-mdc-header-cell {
      padding: 2px 6px; 
      font-size: 12px;
    }
  `]
})
export class AlumnoListComponent implements OnInit {
  dataSource = new MatTableDataSource<Alumno>([]);
  columnas: string[] = [
    'id','nombreCompleto','matricula','fechaNacimiento','edad',
    'estadoCivilId','turnoId','carreraId','activo','creadoEn','acciones'
  ];

  searchTerm: string = '';

  estadoCivilList = ESTADO_CIVIL;
  turnoList = TURNOS;
  carreraList = CARRERAS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private alumnoService: AlumnoService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.dataSource.data = data.map(a => ({ ...a, editando: false }));
        this.dataSource.filterPredicate = (alumno: Alumno, filter: string): boolean => {
          const searchString = filter.trim().toLowerCase();
          const alumnoText = (
            alumno.id +
            (alumno.nombreCompleto || '') +
            (alumno.matricula || '') +
            (alumno.carrera || '') +
            (alumno.turno || '') +
            (alumno.estadoCivil || '')
          ).toLowerCase();
          return alumnoText.includes(searchString);
        };
      },
      error: (err) => console.error('Error cargando alumnos', err),
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editar(alumno: any): void {
    alumno.editando = true;
  }

  guardar(alumno: any): void {
    alumno.editando = false;
    this.alumnoService.update(alumno).subscribe({
      next: (alumnoActualizado) => {
        console.log('Alumno actualizado con éxito', alumnoActualizado);
        this.cargarAlumnos(); 
      },
      error: (err) => {
        console.error('Error actualizando', err);
        this.cargarAlumnos();
      },
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este alumno?')) {
      this.alumnoService.inactivar(id).subscribe({
        next: () => {
          console.log(`Alumno con id ${id} eliminado/inactivado.`);
          this.cargarAlumnos();
        },
        error: (err) => console.error('Error eliminando alumno', err),
      });
    }
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(AlumnoFormModalComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe((result: Alumno | undefined) => {
      if (result) {
        console.log('Modal cerrado y se recibió un nuevo alumno. Refrescando lista...');
        this.cargarAlumnos();
      } else {
        console.log('Modal cerrado sin cambios.');
      }
    });
  }

  irHome(): void {
    this.router.navigate(['/home']);
  }
}

