// src/app/pages/reporte/reporte.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alumno } from '../../models/alumno.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/student';

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res as Alumno[];

        const wrapped =
          res?.content ?? res?.data ?? res?.items ?? res?.alumnos ?? res?.students;
        if (Array.isArray(wrapped)) return wrapped as Alumno[];

        if (
          res &&
          typeof res === 'object' &&
          ('matricula' in res || 'nombreCompleto' in res || 'name' in res)
        ) {
          return [res as Alumno];
        }

        if (res && typeof res === 'object') {
          const values = Object.values(res);
          if (values.length && values.every((v) => typeof v === 'object')) {
            return values as Alumno[];
          }
        }

        throw new Error('Formato inesperado de /api/student');
      })
    );
  }

  // 🔹 Método para obtener un alumno por su ID
  getPrediccionByAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`).pipe(
      map((res: any) => {
        if (!res || typeof res !== 'object') {
          throw new Error(`Formato inesperado en /api/student/${id}`);
        }
        return res as Alumno;
      })
    );
  }
}
