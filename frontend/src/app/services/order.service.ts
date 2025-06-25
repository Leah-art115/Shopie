import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderPayload {
  productId: number;
  userEmail: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: OrderPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}`, order);
  }

  placeMultipleOrders(orders: OrderPayload[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch`, { orders });
  }
}
