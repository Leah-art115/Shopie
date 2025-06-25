import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartProducts: Product[] = [];
  private cartProductsSubject = new BehaviorSubject<Product[]>([]);
  cartProducts$ = this.cartProductsSubject.asObservable();

  constructor() {
    console.log('CartService initialized');
  }

  addToCart(product: Product) {
    console.log('Adding product to cart:', product);
    if (!this.isInCart(product)) {
      this.cartProducts.push(product);
      console.log('Cart after adding:', this.cartProducts);
      console.log('Emitting cart update to subscribers');
      this.cartProductsSubject.next([...this.cartProducts]);
    } else {
      console.log('Product already in cart, not adding');
    }
  }

  removeFromCart(product: Product) {
    console.log('Removing product from cart:', product);
    const initialLength = this.cartProducts.length;
    this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
    console.log(`Removed ${initialLength - this.cartProducts.length} items`);
    console.log('Cart after removal:', this.cartProducts);
    this.cartProductsSubject.next([...this.cartProducts]);
  }

  clearCart() {
    console.log('Clearing entire cart');
    this.cartProducts = [];
    this.cartProductsSubject.next([]);
    console.log('Cart cleared');
  }

  getCartItems(): Product[] {
    console.log('Getting cart items (current snapshot):', this.cartProducts);
    return [...this.cartProducts];
  }

  isInCart(product: Product): boolean {
    const exists = this.cartProducts.some(p => p.id === product.id);
    console.log(`Checking if product ${product.name} (id: ${product.id}) is in cart:`, exists);
    return exists;
  }
  getCartCount(): number {
    return this.cartProducts.length;
  }

  debugCartState() {
    console.log('=== CART DEBUG STATE ===');
    console.log('Cart products array:', this.cartProducts);
    console.log('Cart count:', this.cartProducts.length);
    console.log('BehaviorSubject current value:', this.cartProductsSubject.value);
    console.log('========================');
  }
}