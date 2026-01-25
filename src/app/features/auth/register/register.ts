import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  form: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
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
    this.successMessage.set(null);
    this.isSubmitting.set(true);

    const payload: RegisterRequest = this.form.value;

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set(
          'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
        );

        // Opcional: redirigir después de un pequeño delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);

        if (err.status === 409) {
          this.errorMessage.set(
            'Ya existe un usuario registrado con este correo.',
          );
        } else if (err.status === 0) {
          this.errorMessage.set(
            'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
          );
        } else {
          this.errorMessage.set(
            'Ha ocurrido un error al registrar la cuenta. Revisa los datos e intenta nuevamente.',
          );
        }
      },
    });
  }
}
