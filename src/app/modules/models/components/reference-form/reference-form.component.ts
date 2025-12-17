import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Reference } from 'src/app/core/models/config.model';
import { ProductCreationRequest } from 'src/app/core/models/product.model';
import { ModelConfigService } from 'src/app/core/services/model-config.service';
import { ProductService } from 'src/app/core/services/product.service';
import { ReferenceModalComponent } from '../reference-modal/reference-modal.component';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.css']
})
export class ReferenceFormComponent implements OnInit {
  @Input() selectedModel!: Reference;
  departamentos: Reference[] = [];
  tallas: Reference[] = [];
  colores: Reference[] = [];
  modelos: Reference[] = [];
  mangas: Reference[] = [];
  modelForm!: FormGroup;
  // references$!: Observable<ConfigDataResponse>; // Datos de Tallas, Colores, Mangas, etc.
 
  // Lista de productos finales generados por la combinación de atributos
  generatedVariants: ProductCreationRequest[] = [];
  
  // Para la previsualización de la imagen
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private configService: ModelConfigService,
    private productService: ProductService, // Usado para el envío final
    private dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    // Cargar todas las referencias necesarias
    // this.references$ = this.configService.getReferences();
    this.loadReferences();
    this.initForm();
  }

  initForm(): void {
    this.modelForm = this.fb.group({
      // PROPIEDADES DEL MODELO BASE
      nombre: [this.selectedModel?.descripcion || '', Validators.required], 
      departamento: ['', Validators.required],
      precioBase: [0, [Validators.required, Validators.min(0)]], 
      stockInicial: [0, [Validators.required, Validators.min(0)]], 
      estatus: [1, Validators.required], // 1=Activo, 0=Inactivo
      tipo_producto: ['prenda', Validators.required],
      
      // ATRIBUTOS PARA LA GENERACIÓN DE VARIANTES (Multi-selects)
      tallas: [[], Validators.required], // Almacena IDs seleccionados
      mangas: [[], Validators.required],
      colorTexto: ['', Validators.required],

      // IMAGEN
      imageFile: [null, Validators.required], // Almacena el nombre o path de la imagen
    });
  }

  loadReferences(): void {
    // Cargar modelos
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
   * Maneja la selección de archivo de imagen.
   */
  onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
          // Guardar el nombre del archivo en el formulario
          this.modelForm.get('imageFile')?.setValue(file.name); 
          this.selectedFileName = file.name;
          // Lógica para previsualización o subida a un servicio de archivos iría aquí
      }
  }

  /**
   * Genera todas las combinaciones de variantes basadas en las selecciones del usuario.
   * Esto se llama al hacer clic en un botón de previsualización/generación.
   */
  generateVariants(): void {
      if (this.modelForm.invalid) {
          this.modelForm.markAllAsTouched();
          console.error('Por favor, complete todos los campos requeridos.');
          return;
      }

      const formValue = this.modelForm.value;
      
      const selectedTallas = formValue.tallas;
      const selectedMangas = formValue.mangas;
      const colorTexto = formValue.colorTexto; // Nuevo valor

      // Mapear IDs a la descripción del JSON de referencias para la descripción
      const getDesc = (list: any[], id: string) => list.find(item => item.id_talla === id || item.id_manga === id || item.id_color === id || item.id_departamento === id)?.descripcion || id;
      
      const variants: ProductCreationRequest[] = [];
      let variantCounter = 1;

      for (const tallaId of selectedTallas) {
          for (const mangaId of selectedMangas) {

                  const colorId = colorTexto; 
                  const colorDesc = colorTexto;
                  // Obtener descripciones para la propiedad 'descripcion' del payload
                  const tallaDesc = getDesc(this.tallas, tallaId);
                  const mangaDesc = getDesc(this.mangas, mangaId);
                  
                  const newProduct: ProductCreationRequest = {
                    nombre: formValue.nombre,
                    descripcion: `${formValue.nombre} talla ${tallaDesc} manga ${mangaDesc} color ${colorDesc}`,
                    precio: formValue.precioBase,
                    stock: formValue.stockInicial,
                    id_manga: mangaId,
                    id_talla: tallaId,
                    id_color: colorId,
                    estatus_producto: formValue.estatus,
                    id_departamento: formValue.departamento,
                    tipo_producto: formValue.tipo_producto,
                    imagen: [
                      // Se asume que imageFile contiene el nombre del archivo
                      { imgT: 'img1', imgValue: formValue.imageFile },
                    ],
                    fechaCreacion: new Date().toISOString().split('T')[0],
                    fechaActualizacion: new Date().toISOString(),
                    insertar: [],
                    id_producto: null,
                    id_modelo: Number(this.selectedModel?.id) || formValue.nombre,
                    sku: `${formValue.nombre} talla ${tallaDesc} manga ${mangaDesc} color ${colorDesc}`,
                    foto: formValue.imageFile
                  };
                  variants.push(newProduct);
                  variantCounter++;
              
          }
      }

      this.generatedVariants = variants;
  }
  
  /**
   * Envía la lista completa de variantes generadas al servicio.
   */
  onSubmit(): void {
      if (this.generatedVariants.length === 0) {
          alert('Primero debe generar y previsualizar las variantes.');
          return;
      }
      
      // Aquí se llamaría al servicio para enviar el array de productos
      console.log('--- PAYLOAD FINAL AL BACKEND ---');
      console.log(this.generatedVariants);
      
      // Simulación de envío:
      // this.productService.createProducts(this.generatedVariants).subscribe({
      //     next: () => alert(`Éxito: ${this.generatedVariants.length} variantes creadas.`),
      //     error: (err) => console.error('Error al crear productos', err)
      // });

      alert(`Simulación exitosa: ${this.generatedVariants.length} variantes del modelo '${this.modelForm.get('nombre')?.value}' listas para enviar.`);
      // Opcional: limpiar el formulario
      // this.modelForm.reset({ estatus: 1, tipo_producto: 'prenda', precioBase: 0, stockInicial: 0 });
      // this.generatedVariants = [];
  }
  openReferenceModal(): void {
    const dialogRef = this.dialog.open(ReferenceModalComponent, {
      width: '500px',
      // data: { ... si necesitas pasar datos iniciales }
    });

    // Si quieres refrescar la lista de modelos después de cerrar el modal
    dialogRef.afterClosed().subscribe(result => {
      this.loadReferences();
      // console.log('El modal de referencias se ha cerrado.');
      // Aquí podrías recargar las referencias en tu formulario de modelo si el modal regresó datos nuevos
    });
  }
}