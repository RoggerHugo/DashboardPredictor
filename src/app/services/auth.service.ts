// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface AuthResponse { token?: string; accessToken?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = '/auth/login'; 

  login(username: string, password: string) {
    const body = { username, password }; // nombres EXACTOS que espera tu backend
    return this.http.post<AuthResponse>(`${this.base}`, body).pipe(
      tap(res => {
        const t = res.token ?? res.accessToken;
        if (t) localStorage.setItem('token', t);
      })
    );
  }
}
