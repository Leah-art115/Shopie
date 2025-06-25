import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-results-container">
      <div class="search-header">
        <h2>Search Results for "{{ searchQuery }}"</h2>
        <p *ngIf="products && products.length > 0">{{ products.length }} product(s) found</p>
        <p *ngIf="products && products.length === 0">No products found</p>
      </div>

      <div class="products-grid" *ngIf="products && products.length > 0">
        <div class="product-card" *ngFor="let product of products" (click)="goToProduct(product.id)">
          <div class="product-image">
            <img 
              [src]="product.images && product.images.length > 0 ? product.images[0].url : '/assets/placeholder.jpg'" 
              [alt]="product.name"
              onerror="this.src='/assets/placeholder.jpg'"
            />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-description">{{ product.description | slice:0:100 }}{{ product.description && product.description.length > 100 ? '...' : '' }}</p>
            <div class="product-price">\${{ product.price }}</div>
            <div class="product-categories" *ngIf="product.categories && product.categories.length > 0">
              <span class="category-tag" *ngFor="let cat of product.categories">
                {{ cat.category.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="products && products.length === 0">
        <h3>No products found for "{{ searchQuery }}"</h3>
        <p>Try adjusting your search terms or browse our categories.</p>
        <button (click)="goToHome()" class="btn-primary">Browse All Products</button>
      </div>

      <div class="loading" *ngIf="!products">
        <p>Searching...</p>
      </div>
    </div>
  `,
  styles: [`
    .search-results-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-header {
      margin-bottom: 30px;
    }

    .search-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .product-image {
      height: 200px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      padding: 15px;
    }

    .product-info h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.1em;
    }

    .product-description {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 10px;
    }

    .product-price {
      font-size: 1.2em;
      font-weight: bold;
      color: #e74c3c;
      margin-bottom: 10px;
    }

    .product-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .category-tag {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.8em;
      color: #495057;
    }

    .no-results {
      text-align: center;
      padding: 40px 20px;
    }

    .no-results h3 {
      color: #666;
      margin-bottom: 10px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  searchQuery = '';
  products: Product[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchProducts();
      }
    });
  }

  private searchProducts() {
    this.products = null; 
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.products = [];
      }
    });
  }

  goToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}