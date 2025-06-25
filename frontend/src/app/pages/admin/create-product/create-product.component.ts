import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { PopupService } from '../../../services/popup.service'; 

@Component({
  selector: 'app-admin-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class AdminCreateProductComponent implements OnInit {
  productForm: FormGroup;
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  categories: { id: number; name: string }[] = [];
  categoriesLoaded = false;
  categoriesError = false;
  debugInfo = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productService: ProductService,
    private popupService: PopupService 
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      category: ['', Validators.required],
      isHot: [false],
      isNew: [false],
      isTrending: [false]
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.debugInfo = 'No auth token found in localStorage. Click "Login & Get Categories" button.';
      return;
    }
    this.fetchCategories();
  }

  fetchCategories() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.debugInfo = 'No token available for API call';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:3000/products/categories/all', { headers }).subscribe({
      next: (res) => {
        let categoriesData;
        if (Array.isArray(res)) categoriesData = res;
        else if (res && (res as any).data && Array.isArray((res as any).data)) categoriesData = (res as any).data;
        else if (res && (res as any).categories && Array.isArray((res as any).categories)) categoriesData = (res as any).categories;
        else {
          this.debugInfo = `Unexpected response format: ${JSON.stringify(res)}`;
          return;
        }
        this.categories = categoriesData;
        this.categoriesLoaded = true;
      },
      error: (err) => {
        this.categoriesError = true;
        this.debugInfo = `API Error: ${err.status} - ${err.message}`;
      }
    });
  }

  onFileSelected(event: any) {
    this.imageFiles = Array.from(event.target.files);
    this.imagePreviews = [];

    this.imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadImagesToCloudinary(): Promise<string[]> {
    const uploadPreset = 'shopie';
    const cloudName = 'dpknwhsv9';

    const imageUrls: string[] = [];
    for (const file of this.imageFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response: any = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: 'POST',
          body: formData
        }).then(res => res.json());

        if (response.secure_url) {
          imageUrls.push(response.secure_url);
        } else {
          console.error('Cloudinary upload failed', response);
          this.popupService.show('Failed to upload one or more images'); 
          return [];
        }
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        this.popupService.show('Error uploading images'); 
        return [];
      }
    }
    return imageUrls;
  }

  async submit() {
    if (this.productForm.valid && this.imageFiles.length > 0) {
      this.loading = true;
      const imageUrls = await this.uploadImagesToCloudinary();

      if (imageUrls.length === 0) {
        this.loading = false;
        return; 
      }

      const productData = {
        ...this.productForm.value,
        categoryIds: [Number(this.productForm.value.category)],
        imageUrls
      };

      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('http://localhost:3000/products', productData, { headers }).subscribe({
        next: () => {
          this.popupService.show('Product created successfully!'); 
          this.productForm.reset();
          this.imageFiles = [];
          this.imagePreviews = [];
          this.loading = false;
        },
        error: (err) => {
          this.popupService.show('Failed to create product: ' + (err.error?.message || err.message)); 
          this.loading = false;
        }
      });
    } else {
      this.popupService.show('Fill all fields and upload at least one image.'); 
    }
  }
}
