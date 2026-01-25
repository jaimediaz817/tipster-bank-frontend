import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  form: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['cliente.analista@example.com', [Validators.required, Validators.email]],
      password: ['Cliente123', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const payload: LoginRequest = this.form.value;
    console.log('[Login] Enviando payload', payload);

    this.authService.login(payload).pipe(
      // finalize se asegura de que isSubmitting se ponga a false al terminar, haya éxito o error
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        console.log('[Login] Éxito, token guardado.', response);
        // Navegamos a la URL y solo después de que la navegación sea exitosa,
        // la aplicación continuará. Esto da tiempo a que todo se asiente.
        this.router.navigate(['/dashboard']).then(navigated => {
          if (navigated) {
            console.log('[Login] Navegación a /dashboard completada.');
          } else {
            console.error('[Login] La navegación a /dashboard falló.');
          }
        });
      },
      error: (err) => {
        console.error('[Login] Error en la petición', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Credenciales inválidas. Revisa tu correo y contraseña.');
        } else if (err.status === 0) {
          this.errorMessage.set('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        } else {
          this.errorMessage.set('Ha ocurrido un error inesperado. Vuelve a intentarlo.');
        }
      },
    });
  }
}