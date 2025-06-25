import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { LikedService } from '../../services/liked.service';
import { CartService } from '../../services/cart.service';
import { PopupService } from '../../services/popup.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  searchQuery: string = '';

  messagePopupOpenIds: Set<number> = new Set();
  messageTexts: { [productId: number]: string } = {};

  constructor(
    private productService: ProductService,
    private likedService: LikedService,
    private cartService: CartService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applySearch();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error(err);
      },
    });
  }

  applySearch() {
    const query = this.searchQuery.trim().toLowerCase();

    if (query) {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  getImageUrl(product: Product): string {
    console.log('Product:', product.name, 'Images:', product.images);
    
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].url;
      
      if (imageUrl && imageUrl.trim() !== '') {
        console.log('Original image URL:', imageUrl);
        
        if (imageUrl.startsWith('/')) {
          const fullUrl = `http://localhost:3000${imageUrl}`;
          console.log('Converted to:', fullUrl);
          return fullUrl;
        }
        
        if (imageUrl.startsWith('http')) {
          console.log('Using absolute URL:', imageUrl);
          return imageUrl;
        }
        
        const fullUrl = `http://localhost:3000/${imageUrl}`;
        console.log('Converted relative to:', fullUrl);
        return fullUrl;
      }
    }
    
    console.log('Using fallback image for:', product.name);
    return 'assets/no-image.png';
  }

  onImageError(event: Event) {
    console.log('Image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  toggleLike(product: Product) {
    this.likedService.toggleLike(product);
  }

  isLiked(product: Product): boolean {
    return this.likedService.isLiked(product);
  }

  addToCart(product: Product) {
    if (!this.cartService.isInCart(product)) {
      this.cartService.addToCart(product);
      this.popupService.show(`${product.name} added to cart`);
    } else {
      this.popupService.show(`${product.name} is already in the cart`);
    }
  }

  toggleMessagePopup(product: Product) {
    if (this.messagePopupOpenIds.has(product.id)) {
      this.messagePopupOpenIds.delete(product.id);
    } else {
      this.messagePopupOpenIds.add(product.id);
      if (!this.messageTexts[product.id]) {
        this.messageTexts[product.id] = '';
      }
    }
  }

  isMessagePopupOpen(product: Product): boolean {
    return this.messagePopupOpenIds.has(product.id);
  }

  sendMessage(product: Product) {
    const msg = this.messageTexts[product.id]?.trim();
    if (!msg) {
      this.popupService.show('Please enter a message');
      return;
    }

    const senderEmail = localStorage.getItem('userEmail');
    if (!senderEmail) {
      this.popupService.show('You must be logged in to send a message');
      return;
    }

    const payload = {
      senderEmail,
      message: `Message about product "${product.name}":\n\n${msg}`,
    };

    fetch('http://localhost:3000/mailer/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
      })
      .then(() => {
        this.popupService.show('Message sent to admin successfully');
        this.messageTexts[product.id] = '';
        this.toggleMessagePopup(product);
      })
      .catch((err) => {
        console.error(err);
        this.popupService.show('Failed to send message');
      });
  }
}