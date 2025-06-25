import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
  faUser,
  faHeart,
  faBasketShopping,
  faEnvelope,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ViewEncapsulation } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [CommonModule, RouterModule, FontAwesomeModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  faUser = faUser;
  faHeart = faHeart;
  faBasket = faBasketShopping;
  faEnvelope = faEnvelope;
  faSearch = faSearch;

  showCategories = false;
  searchQuery = '';

  categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Kids' Clothing",
    'Toys',
    'Accessories',
    'Jewelry',
    'Home Decor',
    'Shoes',
    'Gifts',
    'Bags & purses',
    'Hats & Headwear',
    'Others',
  ];

  constructor(
    private router: Router, 
    private productService: ProductService
  ) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  onUserIconClick() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      console.log('Not logged in: Redirecting to auth');
      this.router.navigate(['/auth']);
      return;
    }

    try {
      const user = JSON.parse(userJson);

      if (user?.role === 'ADMIN') {
        console.log('Admin logged in: Redirecting to admin dashboard');
        this.router.navigate(['/admin/dashboard']);
      } else {
        console.log('User logged in: Redirecting to profile');
        this.router.navigate(['/account/profile']);
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      this.router.navigate(['/auth']);
    }
  }

  goToLiked() {
    this.router.navigate(['/liked']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToContactSeller() {
    this.router.navigate(['/contact-seller']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  goToCategory(category: string) {
    this.router.navigate(['/category', category]);
  }
}