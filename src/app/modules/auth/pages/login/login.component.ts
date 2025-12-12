// src/app/modules/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Se ajusta el validador a 'required' ya que el username puede ser solo texto o ID, no necesariamente email
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.error = null;
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          // 🚨 IMPORTANTE: La redirección se realiza ahora en el AuthService.tap()
          // No se requiere 'this.router.navigate' aquí.
        },
        error: (err) => {
          this.loading = false;
          // Intentar obtener el mensaje de error de la respuesta del backend PHP
          let message = 'Error de conexión con el servidor.';
          if (err.error && err.error.message) {
            // Mensaje específico devuelto por el JSON de la API PHP (Ej: 'Credenciales inválidas.')
            message = err.error.message;
          } else if (err.status === 401) {
            // Error HTTP 401: No autorizado
            message = 'Usuario o contraseña incorrectos.';
          }

          this.error = message;
          console.error('Error de Login:', err);
        },
      });
    }
  }
}
