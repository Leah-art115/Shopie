import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class LikedService {
  private likedProductsSubject = new BehaviorSubject<Product[]>([]);
  likedProducts$ = this.likedProductsSubject.asObservable();

  private likedProducts: Product[] = [];

  like(product: Product) {
    if (!this.isLiked(product)) {
      this.likedProducts.push(product);
      this.likedProductsSubject.next(this.likedProducts);
    }
  }

  unlike(product: Product) {
    this.likedProducts = this.likedProducts.filter(p => p.id !== product.id);
    this.likedProductsSubject.next(this.likedProducts);
  }

  toggleLike(product: Product) {
    if (this.isLiked(product)) {
      this.unlike(product);
    } else {
      this.like(product);
    }
  }

  isLiked(product: Product): boolean {
    return this.likedProducts.some(p => p.id === product.id);
  }

  getLikedProducts(): Product[] {
    return this.likedProducts;
  }
}
