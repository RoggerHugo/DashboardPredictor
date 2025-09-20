import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prediccion } from '../models/prediccion.model';

@Injectable({ providedIn: 'root' })
export class PrediccionService {
  private http = inject(HttpClient);

  private apiUrl = '/api/student'; 
  // ⚠️ Ajusta la URL base si es diferente en tu backend.
  // Si el detalle viene de https://dropoutpredictor.onrender.com/api/student/{id}
  // entonces esta URL está correcta.

  getPrediccion(id: number): Observable<Prediccion> {
    return this.http.get<Prediccion>(`${this.apiUrl}/${id}`);
  }
}
