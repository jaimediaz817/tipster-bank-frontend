import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { AuthStore } from '../state/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly authStore = inject(AuthStore);

    // Ajusta esta URL según tu backend
    private readonly baseUrl = 'http://localhost:8080/api/auth';

    login(payload: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
            tap((response) => {
                this.authStore.setAuth(response);
            }),
        );
    }

    register(payload: RegisterRequest): Observable<void> {
        // Suponemos que el backend devuelve 200/201 sin body
        return this.http.post<void>(`${this.baseUrl}/register`, payload);
    }

    logout(): void {
        this.authStore.logout();
        // Si quisieras llamar a un endpoint de logout, lo harías aquí.
    }
}
