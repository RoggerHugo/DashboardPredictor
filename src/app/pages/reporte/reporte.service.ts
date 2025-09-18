// src/app/pages/reporte/reporte.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Alumno {
  id: number;
  nombreCompleto: string;
  matricula: string;
  edad: number;
  turno: string;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private base = '/api-dropoutpredictor/api/student';

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        // 1) Si ya es array, devolver tal cual
        if (Array.isArray(res)) return res as Alumno[];

        // 2) Wrappers comunes: content/data/items/alumnos/students
        const wrapped =
          res?.content ?? res?.data ?? res?.items ?? res?.alumnos ?? res?.students;
        if (Array.isArray(wrapped)) return wrapped as Alumno[];

        // 3) Un solo alumno (objeto): lo envolvemos en array
        if (res && typeof res === 'object' &&
            ('matricula' in res || 'nombreCompleto' in res)) {
          return [res as Alumno];
        }

        // 4) Mapa id->alumno: usar los values
        if (res && typeof res === 'object') {
          const values = Object.values(res);
          if (values.length && values.every(v => typeof v === 'object')) {
            return values as Alumno[];
          }
        }

        throw new Error('Formato inesperado de /api/student');
      })
    );
  }
}




  