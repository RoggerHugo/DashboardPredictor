// src/app/services/alumno.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Alumno } from '../models/alumno.model';

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  private http = inject(HttpClient);
  private apiUrl = '/api/student';
  
  // Obtener lista de alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((raw) => console.debug('[AlumnoService] raw response:', raw)),
      map((res) => {
        if (Array.isArray(res)) return res as Alumno[];

        const wrapped =
          res?.content ?? res?.data ?? res?.items ?? res?.alumnos ?? res?.students;
        if (Array.isArray(wrapped)) return wrapped as Alumno[];

        if (res && typeof res === 'object' &&
            ('matricula' in res || 'nombreCompleto' in res || 'id' in res)) {
          return [res as Alumno];
        }

        if (res && typeof res === 'object') {
          const values = Object.values(res);
          if (values.length && values.every(v => typeof v === 'object')) {
            return values as Alumno[];
          }
        }

        console.warn('[AlumnoService] Formato inesperado, devolviendo []');
        return [] as Alumno[];
      })
    );
  }

  // Obtener un alumno específico
  getAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  // Crear alumno nuevo (POST)
  create(alumno: Alumno): Observable<Alumno> {
    const payload = {
      nombreCompleto: alumno.nombreCompleto,
      matricula: alumno.matricula,
      fechaNacimiento: alumno.fechaNacimiento,
      edad: alumno.edad,
      estadoCivilId: alumno.estadoCivilId,
      turnoId: alumno.turnoId,
      carreraId: alumno.carreraId,
      activo: alumno.activo
    };
    return this.http.post<Alumno>(this.apiUrl, payload);
  }

  // Actualizar alumno existente (PUT)
  update(alumno: Alumno): Observable<Alumno> {
    if (!alumno.id) {
      throw new Error('El alumno debe tener un ID para actualizarse.');
    }
    const payload = {
      nombreCompleto: alumno.nombreCompleto,
      matricula: alumno.matricula,
      fechaNacimiento: alumno.fechaNacimiento,
      edad: alumno.edad,
      estadoCivilId: alumno.estadoCivilId,
      turnoId: alumno.turnoId,
      carreraId: alumno.carreraId,
      activo: alumno.activo
    };
    return this.http.put<Alumno>(`${this.apiUrl}/${alumno.id}`, payload);
  }

  // Inactivar alumno (PATCH activo=false)
  inactivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activo?value=false`, {});
  }
}
