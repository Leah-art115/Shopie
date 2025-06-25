import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [CommonModule, RouterModule],
})
export class CategoryComponent implements OnInit {
  categoryName = '';
  products: Product[] = [];
  loading = false;
  error = '';
  noProducts = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.categoryName = params.get('category') || '';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (allProducts) => {
        this.products = allProducts.filter((product) =>
          product.categories?.some(
            (pc) =>
              pc?.category?.name?.toLowerCase().trim() ===
              this.categoryName.toLowerCase().trim()
          )
        );

        this.noProducts = this.products.length === 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        console.error(err);
        this.loading = false;
      },
    });
  }
}
