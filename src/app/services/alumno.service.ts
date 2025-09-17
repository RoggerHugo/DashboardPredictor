import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id: number;
  nombreCompleto: string;
  matricula: string;
  fechaNacimiento: string;
  edad: number;
  estadoCivil: string;
  turno: string;
  carrera: string;
  activo: boolean;
  creadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  private baseUrl = '/api/student';

  constructor(private http: HttpClient) {}

  /** Listar todos los alumnos */
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.baseUrl);
  }

  /** Obtener detalle de un alumno por id */
  getAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.baseUrl}/${id}`);
  }

  /** Crear un nuevo alumno */
  crearAlumno(alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.post<Alumno>(this.baseUrl, alumno);
  }

  /** Actualizar un alumno existente */
  actualizarAlumno(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.baseUrl}/${id}`, alumno);
  }

  /** Activar o inactivar un alumno */
  activarInactivar(id: number, activo: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/activo?value=${activo}`, {});
  }
}
