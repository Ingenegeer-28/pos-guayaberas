// src/app/modules/admin/components/user-form/user-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null // Recibe datos si es edición
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id_usuario: [this.data?.id_usuario],
      nombre: [this.data?.nombre || '', Validators.required],
      username: [this.data?.username || '', Validators.required],
      rol: [this.data?.rol || 'empleado', Validators.required],
      estatus: [this.data?.estatus ?? 1, Validators.required],
      // La contraseña es requerida en creación, opcional en edición
      password: ['', this.isEditMode ? null : Validators.required],
    });

    // En edición, el username y rol podrían ser no editables o requerir permisos especiales.
    if (this.isEditMode) {
      this.userForm.get('username')?.disable();
    }
  }

  onSubmit(): void {
    // Si el formulario es inválido, salimos
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Obtener los valores del formulario (incluidos los campos deshabilitados)
    const formValue = this.userForm.getRawValue();

    // Quitar el campo password si está vacío y estamos en modo edición
    if (this.isEditMode && !formValue.password) {
      delete formValue.password;
    }

    const operation$ = this.isEditMode
      ? this.userService.updateUser(formValue)
      : this.userService.createUser(formValue);

    operation$.subscribe(
      (response) => {
        if (response.success) {
          alert(this.isEditMode ? 'Usuario actualizado.' : 'Usuario creado.');
          this.dialogRef.close(true); // Cerrar y notificar éxito
        } else {
          console.error(
            'Error en API:',
            response.error_details || response.message
          );
          alert(
            `Error: ${response.message}. Detalle: ${response.error_details}`
          );
        }
      },
      (error) => {
        console.error('Error HTTP:', error);
        alert('Ocurrió un error de conexión con el servidor.');
      }
    );
  }
}
