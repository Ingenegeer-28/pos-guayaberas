import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { ConfigDataResponse, Departamento, Reference } from 'src/app/core/models/config.model'; // Asume esta ruta
import { ProductCreationRequest } from 'src/app/core/models/product.model';
import { ModelConfigService } from 'src/app/core/services/model-config.service'; // Servicio de referencias
import { ProductService } from 'src/app/core/services/product.service'; // Servicio de guardado
import { ReferenceModalComponent } from '../reference-modal/reference-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
// Importar la interfaz para el request (la definiremos conceptualmente)

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})
export class ModelFormComponent implements OnInit {
  
  departamentos: Reference[] = [];
  tallas: Reference[] = [];
  colores: Reference[] = [];
  modelos: Reference[] = [];
  mangas: Reference[] = [];

  newModelForm!: FormGroup;
  isEditMode: boolean = false;
  isVariantes: boolean = false;
  modelId: number | null = null;
  pageTitle: string = 'Crear Nueva Guayabera';
  selectedModel!: Reference;
  // references$!: Observable<ConfigDataResponse>; // Datos de Tallas, Colores, Mangas, etc.
 
  // Lista de productos finales generados por la combinación de atributos
  generatedVariants: ProductCreationRequest[] = [];
  
  // Para la previsualización de la imagen
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ModelConfigService,
    private productService: ProductService, // Usado para el envío final
    private dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    // Cargar todas las referencias necesarias
    // this.references$ = this.configService.getReferences();
    this.initForm();
    this.route.paramMap.pipe(
      map((params) => params.get('id')), // Obtener el ID del parámetro de ruta
      filter((id) => !!id), // Continuar solo si hay un ID
      map((id) => parseInt(id!)),
      tap((id) => {
        this.isEditMode = true;
        this.modelId = id;
        this.pageTitle = 'Editar Modelo';
      }),
      // 3. Buscar el producto por ID para precargar el formulario
      // (Aquí deberías obtener el producto por ID real, simulamos una búsqueda)

      switchMap((id) => {
        return this.configService.getReference('modelos', id);
      })
    )
    .subscribe((data) => {
      if (data) {
        // this.productForm.patchValue(product); // Llenar el formulario con los datos del producto
        // console.log(data);
        this.selectedModel = data;
        this.newModelForm = this.fb.group({
          description: [data.descripcion, Validators.required], 
          nombre: [data.descripcion, Validators.required],
        });
      } else if (this.isEditMode) {
        // Manejar el caso de que el ID no exista (ej. redirigir a 404)
        console.error('Producto no encontrado. Redirigiendo.');
        this.router.navigate(['/models']);
      }
    });

  }

  initForm(): void {
    this.newModelForm = this.fb.group({
      // El ID de la referencia, si es autonumérico, no se pide. Si es manual (ej. "32"), sí.
      // Aquí solo pedimos la descripción y el tipo de referencia a crear
      description: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

  cambiosTab(tab :string): void{
    this.isVariantes = !this.isVariantes;
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
  // onFileSelected(event: any): void {
  //     const file: File = event.target.files[0];
  //     if (file) {
  //         // Guardar el nombre del archivo en el formulario
  //         this.modelForm.get('imageFile')?.setValue(file.name); 
  //         this.selectedFileName = file.name;
  //         // Lógica para previsualización o subida a un servicio de archivos iría aquí
  //     }
  // }

  /**
   * Genera todas las combinaciones de variantes basadas en las selecciones del usuario.
   * Esto se llama al hacer clic en un botón de previsualización/generación.
   */
  // generateVariants(): void {
  //     if (this.modelForm.invalid) {
  //         this.modelForm.markAllAsTouched();
  //         console.error('Por favor, complete todos los campos requeridos.');
  //         return;
  //     }

  //     const formValue = this.modelForm.value;
      
  //     const selectedTallas = formValue.tallas;
  //     const selectedMangas = formValue.mangas;
  //     const colorTexto = formValue.colorTexto; // Nuevo valor

  //     // Mapear IDs a la descripción del JSON de referencias para la descripción
  //     const getDesc = (list: any[], id: string) => list.find(item => item.id_talla === id || item.id_manga === id || item.id_color === id || item.id_departamento === id)?.descripcion || id;
      
  //     const variants: ProductCreationRequest[] = [];
  //     let variantCounter = 1;

  //     for (const tallaId of selectedTallas) {
  //         for (const mangaId of selectedMangas) {

  //                 const colorId = colorTexto; 
  //                 const colorDesc = colorTexto;
  //                 // Obtener descripciones para la propiedad 'descripcion' del payload
  //                 const tallaDesc = getDesc(this.tallas, tallaId);
  //                 const mangaDesc = getDesc(this.mangas, mangaId);
                  
  //                 const newProduct: ProductCreationRequest = {
  //                     nombre: formValue.nombre,
  //                     descripcion: `${formValue.nombre} talla ${tallaDesc} manga ${mangaDesc} color ${colorDesc}`,
  //                     precio: formValue.precioBase,
  //                     stock: formValue.stockInicial,
  //                     tipo_manga: mangaId,
  //                     talla: tallaId,
  //                     color: colorId,
  //                     estatus_producto: formValue.estatus,
  //                     departamento: formValue.departamento,
  //                     tipo_producto: formValue.tipo_producto,
  //                     imagen: [
  //                         // Se asume que imageFile contiene el nombre del archivo
  //                         { imgT: 'img1', imgValue: formValue.imageFile }, 
  //                     ],
  //                     fechaCreacion: new Date().toISOString().split('T')[0],
  //                     fechaActualizacion: new Date().toISOString(),
  //                     insertar: []
  //                 };
  //                 variants.push(newProduct);
  //                 variantCounter++;
              
  //         }
  //     }

  //     this.generatedVariants = variants;
  // }
  
  /**
   * Envía la lista completa de variantes generadas al servicio.
   */
  onSubmit(): void {

      if (this.newModelForm.invalid) {
        this.newModelForm.markAllAsTouched();
        return;
    }

    const formValue = this.newModelForm.value;
    
    const operation$ = this.isEditMode
      ? this.configService.updateReference('modelos', this.selectedModel.id, formValue.nombre)
      : this.configService.createReference('modelos', formValue.nombre);

      // Simulación de envío:
      // this.productService.createProducts(this.generatedVariants).subscribe({
      //     next: () => alert(`Éxito: ${this.generatedVariants.length} variantes creadas.`),
      //     error: (err) => console.error('Error al crear productos', err)
      // });
      operation$.subscribe(
      (response) => {
        if (response.success) {
          alert(this.isEditMode ? 'Modelo actualizado.' : 'Modelo creado.');
          this.newModelForm.reset({nombre: '', description: ''});
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

      // alert(`Simulación exitosa: ${this.generatedVariants.length} variantes del modelo '${this.newModelForm.get('description')?.value}' listas para enviar.`);
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