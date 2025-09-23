import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, StudentDetail, PredictionData } from '../../models/prediccion.model';

@Component({
  selector: 'app-prediccion-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Resultado de Predicción</h2>

    <div *ngIf="studentDetail && predictionData; else cargando">
      
      <!-- Mostramos datos del objeto 'prediction' -->
      <h3>Análisis de Riesgo</h3>
      <p><strong>Predicción:</strong> {{ predictionData.prediction_label }}</p>
      <p><strong>Puntaje (Score):</strong> {{ predictionData.score | number:'1.2-4' }}</p>
      
      <hr>

      <!-- Mostramos datos del objeto 'detail' -->
      <h3>Detalles Clave del Alumno</h3>
      <p><strong>Alumno ID:</strong> {{ studentDetail.alumnoId }}</p>
      <p><strong>Nombre:</strong> {{ studentDetail.nombreCompleto }}</p>
      <p><strong>Observaciones de riesgo:</strong>
        {{ studentDetail.observacionesDetalle }}
      </p>
      <p><strong>Situación actual:</strong> {{ studentDetail.situacionActual }}</p>
      <p><strong>Métodos o problemas de aprendizaje:</strong> {{ studentDetail.metodosOProblemasAprendizaje }}</p>
      <p><strong>Fortalezas y debilidades:</strong>{{ studentDetail.fortalezasDebilidades }}</p>
      <p><strong>Problemas de violencia:</strong> {{ studentDetail.problemasViolencia }}</p>
      
      <button (click)="cerrar()">Volver al reporte</button>
    </div>

    <ng-template #cargando>
      <p>Cargando predicción...</p>
    </ng-template>
  `,
})
export class PrediccionDetailComponent implements OnInit {
  studentDetail?: StudentDetail;
  predictionData?: PredictionData;

  constructor(
    public dialogRef: MatDialogRef<PrediccionDetailComponent>,
    // Recibimos la respuesta completa de la API
    @Inject(MAT_DIALOG_DATA) public data: ApiResponse 
  ) {}

  ngOnInit(): void {
    // Asignamos cada parte del objeto 'data' a nuestras propiedades
    if (this.data) {
      this.studentDetail = this.data.detail;
      this.predictionData = this.data.prediction;
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}

