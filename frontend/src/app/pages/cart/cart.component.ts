import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    console.log('Cart component initialized');
    this.cartService.debugCartState();

    this.refreshCart();
  }

  calculateTotal() {
    this.total = this.cartProducts.reduce((sum, prod) => sum + prod.price, 0);
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
    this.refreshCart();
  }

  placeOrder(product: Product) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to place an order.');
      return;
    }

    this.orderService.placeOrder({
      productId: product.id,
      quantity: 1,
      userEmail: userEmail
    }).subscribe({
      next: () => {
        alert(`Order placed for ${product.name}`);
        this.cartService.removeFromCart(product);
        this.refreshCart();
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401) {
          alert('Please log in to place an order.');
        } else {
          alert('Failed to place order');
        }
      }
    });
  }

  placeAllOrders() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to place an order.');
      return;
    }

    const orders = this.cartProducts.map(prod => ({
      productId: prod.id,
      userEmail: userEmail,
      quantity: 1
    }));

    this.orderService.placeMultipleOrders(orders).subscribe({
      next: () => {
        alert('All orders placed successfully');
        this.cartService.clearCart();
        this.refreshCart();
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 401) {
          alert('Please log in to place an order.');
        } else {
          alert('Failed to place all orders');
        }
      }
    });
  }

  refreshCart() {
    this.cartProducts = this.cartService.getCartItems();
    this.calculateTotal();
  }
}
