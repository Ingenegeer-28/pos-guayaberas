import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';
import { Reference } from 'src/app/core/models/config.model';
import { ModelConfigService } from 'src/app/core/services/model-config.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  pageTitle: string = 'Crear Nueva Guayabera';

  departamentos: Reference[] = [];
  tallas: Reference[] = [];
  colores: Reference[] = [];
  modelos: Reference[] = [];
  mangas: Reference[] = [];

  // Opciones de Material y Talla predefinidas
  // sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  // colors = ['Blanco', 'Azul Cielo', 'Negro', 'Rojo', 'Gris', 'Verde Oliva'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ModelConfigService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // 1. Inicializar el formulario con valores por defecto y validadores
    this.loadReferences();
    this.initForm();

    // 2. Verificar si estamos en modo Edición
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')), // Obtener el ID del parámetro de ruta
        filter((id) => !!id), // Continuar solo si hay un ID
        map((id) => parseInt(id!)),
        tap((id) => {
          this.isEditMode = true;
          this.productId = id;
          this.pageTitle = 'Editar Guayabera';
        }),
        // 3. Buscar el producto por ID para precargar el formulario
        // (Aquí deberías obtener el producto por ID real, simulamos una búsqueda)

        switchMap((id) => {
          return this.productService.getProductById(id);
        })
      )
      .subscribe((product) => {
        if (product) {
          // this.productForm.patchValue(product); // Llenar el formulario con los datos del producto
          console.log(product);
          this.productForm = this.fb.group({
            id_producto: product.id_producto,
            sku: product.sku,
            nombre: product.nombre,
            description: product.descripcion,
            price: product.precio,
            size: product.id_talla,
            color: product.id_color,
            departamento: product.id_departamento,
            manga: product.id_manga,
            stock: product.cantidad,
            isActive: product.estatus_producto == '1' ? true : false,
          });
        } else if (this.isEditMode) {
          // Manejar el caso de que el ID no exista (ej. redirigir a 404)
          console.error('Producto no encontrado. Redirigiendo.');
          this.router.navigate(['/catalog']);
        }
      });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id_producto: [null], // Se usa solo en modo edición
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      size: ['', Validators.required],
      color: ['', Validators.required],
      departamento: ['', Validators.required],
      manga: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar errores
      this.productForm.markAllAsTouched();
      return;
    }

    console.log(this.productForm.value);
    const productData: Product = this.productForm.value;
    console.log(productData);
    if (this.isEditMode) {
      // Lógica de Actualización
      this.productService
        .updateProduct(productData.id_producto, productData)
        .subscribe(() => {
          console.log('Producto actualizado:', productData.nombre);
          // Mostrar notificación y navegar
          this.router.navigate(['/catalog']);
        });
    } else {
      // Lógica de Creación
      this.productService.createProduct(productData).subscribe(() => {
        console.log('Producto creado:', productData.nombre);
        // Mostrar notificación y navegar
        this.router.navigate(['/catalog']);
      });
    }
  }

  // Getter para facilitar el acceso a los controles del formulario en el HTML
  get f() {
    return this.productForm.controls;
  }
  loadReferences(): void {
    this.configService.getModelos().subscribe((data) => {
      this.modelos = data;
    });
    // Cargar mangas
    this.configService.getMangas().subscribe((data) => {
      this.mangas = data;
    });

    // Cargar Departamentos
    this.configService.getDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });

    // Cargar Tallas
    this.configService.getTallas().subscribe((data) => {
      this.tallas = data;
    });

    // Cargar Colores
    this.configService.getColores().subscribe((data) => {
      this.colores = data;
    });
  }
}
