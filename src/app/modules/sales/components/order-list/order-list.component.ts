import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderPaymentDialogComponent } from '../order-payment-dialog/order-payment-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PrintService } from 'src/app/core/services/print.service';
import { OrderCheckoutDialogComponent } from '../order-checkout-dialog/order-checkout-dialog.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Pedido } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Pedido[] = [];
  loading = false;
  errorBack: boolean = false;
  selectedTabIndex: number = 2;
  dataSource = new MatTableDataSource<any>([]);
    // displayedColumns: string[] = ['id', 'fecha', 'vendedor', 'metodo', 'total', 'estatus', 'acciones'];
    
  columnasEscritorio = ['id', 'fecha', 'cliente', 'total', 'estatus', 'acciones'];
  columnasMovil = ['id', 'total', 'acciones']; // Solo lo vital
  displayedColumns: string[] = this.columnasEscritorio;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    
  constructor(
    private breakpointObserver: BreakpointObserver,
    private orderService: OrderService,
    private printService: PrintService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.displayedColumns = result.matches 
          ? this.columnasMovil 
          : this.columnasEscritorio;
      });
    this.fetchOrders();

  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.loading = false;
        this.errorBack = true;
        console.error('Error al cargar y agrupar modelos:', err);
        // Mostrar un mensaje de error o una alerta al usuario
      }
    });
  }

  // Filtrado por estado para las pestañas
  get ordersInProduction() {
    return this.orders.filter(o => o.estado_fabricacion !== 'listo' && o.estado_fabricacion !== 'entregado' && o.estado_fabricacion !== 'cancelada');
  }

  get ordersReady() {
    return this.orders.filter(o => o.estado_fabricacion === 'listo');
  }

  get ordersDelivery() {
    return this.orders.filter(o => o.estado_fabricacion === 'entregado' || o.estado_fabricacion === 'cancelada');
  }
  updateStatus(id: number, status: string) {
    this.orderService.updateFabricationStatus(id, status).subscribe(() => {
      this.snackBar.open(`Pedido actualizado a: ${status}`, 'OK', { duration: 2000 });
      this.fetchOrders();
    });
  }
  reprintTicket(order : any) {
    this.orderService.getOrderById(order.id_pedido).subscribe({
      next:( res)=>{
        this.printService.printLiquidationTicket(res);
      },
      error:(err) =>{
        console.log(err);
      },
    })
  }
  viewDetail(order: any) {
      // Llamamos a la API para obtener los productos de esta venta específica
      this.orderService.getOrderById(order.id_pedido).subscribe(res => {
        this.dialog.open(OrderCheckoutDialogComponent, {
          width: '600px',
          data: res
        });
      });
    }
  cancelOrder(id_pedido: number,  status: string){
    this.orderService.updateFabricationStatus(id_pedido, status).subscribe(() => {
      this.snackBar.open(`Pedido actualizado a: ${status}`, 'OK', { duration: 2000 });
      this.fetchOrders();
    });
  }
  selectedTab(tab: number){
    this.selectedTabIndex = tab;
  }
  notificarWapp(pedido: any){
    this.notificationService.sendOrderReadyMessage(pedido);
  }
  collectBalance(order: any) {
    if(order.saldo_pendiente <= 0){
      this.updateStatus(order.id_pedido, 'entregado')
    }else{
      const dialogRef = this.dialog.open(OrderPaymentDialogComponent, {
        width: '450px',
        data: order,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.fetchOrders(); // Refrescar la lista para ver el cambio de estado
        }
      });
    }
    
  }
}