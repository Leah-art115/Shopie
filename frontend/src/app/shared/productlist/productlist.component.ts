import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('🧩 [ProductListComponent] Initializing...');
    this.productService.refreshProducts();
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('[ProductListComponent] Products loaded:', products);
        this.products = products;
      },
      error: (err) => {
        console.error(' Error getting products:', err);
      }
    });
  }

  likeProduct(product: Product) {
    console.log('Liked product:', product);
  }

  addToCart(product: Product) {
    console.log('Added to cart:', product);
  }

  messageSeller(product: Product) {
    console.log('Send message to seller of:', product);
  }
}