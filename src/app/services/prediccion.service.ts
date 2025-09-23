import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, StudentDetail, PredictionData } from '../models/prediccion.model';

@Injectable({ providedIn: 'root' })
export class PrediccionService {
  private http = inject(HttpClient);

  private apiUrl = '/api/student'; 
  
  getPrediccion(id: number): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}/detail`;
    console.log('Fetching from URL:', url); // Agregado para depuración
    return this.http.get<ApiResponse>(url);
  }
}
