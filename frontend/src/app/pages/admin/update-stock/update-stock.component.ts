import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopupService } from '../../../services/popup.service'; 

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

@Component({
  selector: 'app-admin-update-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.css']
})
export class AdminUpdateStockComponent implements OnInit {
  updateStockForm: FormGroup;
  products: Product[] = [];
  loading = false;
  error = '';
  selectedProduct: Product | null = null;
  updating = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private popupService: PopupService 
  ) {
    this.updateStockForm = this.fb.group({
      productId: ['', Validators.required],
      newStock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.updateStockForm.get('productId')?.valueChanges.subscribe(productId => {
      if (productId) {
        this.selectedProduct = this.products.find(p => p.id == productId) || null;
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('authToken');
    let options = {};

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      options = { headers };
    }

    this.http.get('http://localhost:3000/products', options).subscribe({
      next: (res: any) => {
        console.log('Products loaded for stock update:', res);
        this.products = Array.isArray(res) ? res : res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products for stock update:', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  updateStock() {
    if (this.updateStockForm.valid) {
      this.updating = true;

      const productId = this.updateStockForm.value.productId;
      const stockToAdd = this.updateStockForm.value.newStock;
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const currentStock = this.selectedProduct?.stock || 0;
      const newTotalStock = currentStock + Number(stockToAdd);

      const updateData = {
        stock: newTotalStock
      };

      this.http.patch(`http://localhost:3000/products/${productId}`, updateData, { headers }).subscribe({
        next: (response) => {
          console.log('Stock updated successfully:', response);
          this.popupService.show(`Stock updated successfully! Added ${stockToAdd} units. New total stock: ${newTotalStock}`); 

          const productIndex = this.products.findIndex(p => p.id == productId);
          if (productIndex !== -1) {
            this.products[productIndex].stock = newTotalStock;
          }

          this.updateStockForm.reset();
          this.selectedProduct = null;
          this.updating = false;
        },
        error: (err) => {
          console.error('Error updating stock:', err);
          this.popupService.show('Failed to update stock: ' + (err.error?.message || err.message)); 
          this.updating = false;
        }
      });
    } else {
      this.popupService.show('Please fill all required fields'); 
    }
  }

  refreshProducts() {
    this.loadProducts();
  }
}
