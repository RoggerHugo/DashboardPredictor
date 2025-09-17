
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id: number;
  nombreCompleto: string;
  matricula: string;
  edad: number;
  turno: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = '/api/student';

  constructor(private http: HttpClient) {}

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl);
  }
}
