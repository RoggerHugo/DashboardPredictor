import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
  expiresInSeconds: number;
  tokenType: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Nota: usamos /api/auth/login, el proxy redirige a la URL real
  private apiUrl = '/api/auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<LoginResponse>(
        this.apiUrl,
        { username, password },
        { headers }
      )
      .pipe(
        map((res) => {
          // Guardamos el token en localStorage
          localStorage.setItem('auth_token', res.accessToken);
          return res.accessToken; // Retornamos solo el token
        })
      );
  }
}
