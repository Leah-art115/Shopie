import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface ProductImage {
  id?: number;
  url: string;
  alt?: string;
}

export interface Product {
  category: any;
  id: number;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  categories?: {
    name: any; category: { id: number; name: string } 
}[];
  stock?: number;
  isHot?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; 

  private allProductsSubject = new BehaviorSubject<Product[]>([]);
  public allProducts$ = this.allProductsSubject.asObservable();

  private refreshTrigger = new Subject<void>();

  constructor(private http: HttpClient) {
    this.loadAllProducts();
    this.refreshTrigger.subscribe(() => this.loadAllProducts());
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  private loadAllProducts(): void {
    this.http
      .get<Product[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap((products) => this.allProductsSubject.next(products)),
        catchError((error) => {
          console.error('Error loading products:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  getProducts(): Observable<Product[]> {
    return this.allProducts$;
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(
      catchError((error) => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  refreshProducts(): void {
    this.refreshTrigger.next();
  }
}