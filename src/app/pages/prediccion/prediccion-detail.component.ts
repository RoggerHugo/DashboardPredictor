// src/app/pages/prediccion/prediccion-detail.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prediccion } from '../../models/prediccion.model';

@Component({
  selector: 'app-prediccion-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Resultado de Predicción</h2>

    <div *ngIf="prediccion; else cargando">
      <p><strong>Alumno ID:</strong> {{ prediccion.id }}</p>
      <p><strong>Probabilidad de abandono:</strong>
        {{ prediccion.nombreCompleto }}
      </p>
      <p><strong>Nivel de riesgo:</strong> {{ prediccion.carrera }}</p>
      
      <button (click)="cerrar()">Volver al reporte</button>
    </div>

    <ng-template #cargando>
      <p>Cargando predicción...</p>
    </ng-template>
  `,
})
export class PrediccionDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<PrediccionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public prediccion: Prediccion
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
