import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient, private popupService: PopupService) {} 

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    const token = localStorage.getItem('token');
    let options = {};
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      options = { headers };
    }

    this.http.get('http://localhost:3000/products', options).subscribe({
      next: (res: any) => {
        console.log('Products loaded:', res);
        this.products = Array.isArray(res) ? res : res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  trackByProductId(index: number, product: any): any {
    return product.id || index;
  }

  deleteProduct(id: number) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.popupService.show('Not authenticated'); 
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:3000/products/${id}`, { headers }).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.popupService.show('Product deleted successfully.'); 
      },
      error: (err) => {
        console.error('Delete product error:', err);
        this.popupService.show('Failed to delete product.'); 
      }
    });
  }
}
