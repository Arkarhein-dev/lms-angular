import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  role?: string;
  exp?: number;
}

@Service()
export class AuthService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/library/api/v1/auth';
  private tokenKey = 'token';

  currentToken = signal<string | null>(this.getTokenFromStorage());

  getTokenFromStorage() {
    return localStorage.getItem(this.tokenKey);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.currentToken.set(res.token);
      }),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.currentToken.set(res.token);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentToken.set(null);
  }

  userRole = computed(() => {
    const token = this.currentToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  });

  isAdmin = computed(() => {
    const role = this.userRole();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  });

  isLoggedIn = computed(() => {
    const token = this.currentToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  });
}
