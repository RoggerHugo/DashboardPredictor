// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LoginResponse {
  accessToken?: string;
  token?: string;
  jwt?: string;
  tokenType?: string; 
  expiresInSeconds?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = '/auth';   


  login(username: string, password: string): Observable<string> {
    const body = { username, password };


    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_exp');

    return this.http.post<LoginResponse>(`${this.base}/login`, body).pipe(
      map((res) => {
        const token = res?.accessToken ?? res?.token ?? res?.jwt ?? '';
        if (!token) throw new Error('Token ausente en la respuesta');
        return token;
      }),
      tap((token) => {
        localStorage.setItem('auth_token', token);

        try {
          const [, payload] = token.split('.');
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          if (decoded?.exp) {
            localStorage.setItem('auth_token_exp', String(decoded.exp * 1000));
          }
        } catch { /* noop */ }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_exp');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
