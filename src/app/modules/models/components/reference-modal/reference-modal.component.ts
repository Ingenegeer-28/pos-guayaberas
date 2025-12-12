import { Component, OnInit, Inject, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reference } from 'src/app/core/models/config.model';
import { ModelConfigService } from 'src/app/core/services/model-config.service';

// Interfaces de Referencia (simplificadas)


@Component({
  selector: 'app-reference-modal',
  templateUrl: './reference-modal.component.html',
  styleUrls: ['./reference-modal.component.css'],
})
export class ReferenceModalComponent implements OnInit {
  departamentos: Reference[] = [];
  tallas: Reference[] = [];
  colores: Reference[] = [];
  modelos: Reference[] = [];
  mangas: Reference[] = [];
  // Formulario reactivo para la creación de nuevas referencias
  newReferenceForm!: FormGroup;

  // Lista de referencias actuales (solo para mostrar)
  currentReferences: Reference[] = [];

  // Título dinámico del modal (opcional)
  modalTitle: string = 'Gestión de Referencias';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReferenceModalComponent>,
    // Inyecta datos si necesitas inicializar el modal con alguna referencia
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private referenceService: ReferenceService, // Servicio para interactuar con el backend
    private configService: ModelConfigService
  ) {}

  ngOnInit(): void {
    
    this.initForm();
    // Ejemplo: Cargar tallas al inicio, o todas si es un modal genérico
    this.loadReferences('tallas');
  }

  initForm(): void {
    this.newReferenceForm = this.fb.group({
      // El ID de la referencia, si es autonumérico, no se pide. Si es manual (ej. "32"), sí.
      // Aquí solo pedimos la descripción y el tipo de referencia a crear
      description: ['', Validators.required],
      type: ['tallas'], // Campo oculto que indica qué referencia se va a crear
    });
  }

  /**
   * Carga las referencias para la pestaña seleccionada (ej. 'tallas', 'colores').
   * @param type El tipo de referencia a cargar.
   */
  // loadReferences(type: string): void {
  //   // Aquí iría la lógica para cargar datos del backend (usando referenceService)
  //   // Ejemplo:
  //   // this.referenceService.getReferences(type).subscribe(data => {
  //   //   this.currentReferences = data;
  //   // });
  //   this.newReferenceForm.get('type')?.setValue(type);

  //   // MOCK DATA (reemplazar con el servicio real)
  //   if (type === 'tallas') {
  //     this.currentReferences = [
  //       { id: '4', descripcion: '32' },
  //       { id: '5', descripcion: '34' },
  //     ];
  //   } else if (type === 'departamentos') {
  //     this.currentReferences = [{ id: 'CAB01', descripcion: 'CABALLEROS' }];
  //   } else {
  //     this.currentReferences = [];
  //   }
  // }

  loadReferences(type: string): void {
    console.log(type);
    // Cargar modelos
    this.newReferenceForm.get('type')?.setValue(type);
    this.configService.getModelos().subscribe(data => {
      this.modelos = data;
    });
    // Cargar mangas
    this.configService.getMangas().subscribe(data => {
      this.mangas = data;
    });
    
    // Cargar Departamentos
    this.configService.getDepartamentos().subscribe(data => {
      this.departamentos = data;
    });

    // Cargar Tallas
    this.configService.getTallas().subscribe(data => {
      this.tallas = data;
    });

    // Cargar Colores
    this.configService.getColores().subscribe(data => {
      this.colores = data;
    });
  }
  /**
   * Envía la nueva referencia al backend.
   */
  createReference(): void {
    if (this.newReferenceForm.invalid) return;

    const { description, type } = this.newReferenceForm.value;

    // Aquí llamarías al servicio para crear la nueva referencia
    console.log(`Creando nueva referencia (${type}): ${description}`);

    // Simulación de éxito
    this.configService.createReference(type, description).subscribe(() => {
      this.loadReferences(type); // Recargar la lista
      this.newReferenceForm.reset({ type: type });
    });

    // MOCK: Añadir a la lista local
    // this.currentReferences.push({ id: 'NEW', descripcion: description });
    // this.newReferenceForm.reset({ type: type });
  }

  close(): void {
    this.dialogRef.close();
  }
}
