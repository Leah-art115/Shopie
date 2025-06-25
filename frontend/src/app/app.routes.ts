import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LikedComponent } from './pages/liked/liked.component';
import { CartComponent } from './pages/cart/cart.component';
import { ContactSellerComponent } from './pages/contact-seller/contact-seller.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { ShippingAddressComponent } from './pages/account/shipping-address/shipping-address.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminCreateProductComponent } from './pages/admin/create-product/create-product.component';
import { AdminUsersComponent } from './pages/admin/users/users.component';
import { AdminUpdateStockComponent } from './pages/admin/update-stock/update-stock.component';
import { AdminProductsComponent } from './pages/admin/products/products.component';
import { AdminSidebarComponent } from './pages/admin/sidebar/sidebar.component';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';
import { SearchResultsComponent } from './search-results/search-results.component'; 


export const routes: Routes = [
  {
  path: '',
  loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
},
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'liked', component: LikedComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contact-seller', component: ContactSellerComponent },
  { path: 'account/profile', component: ProfileComponent },
  { path: 'account/shipping', component: ShippingAddressComponent },

  {
  path: 'admin',
  component: AdminLayoutComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'products', component: AdminProductsComponent },
    { path: 'create-product', component: AdminCreateProductComponent },
    { path: 'users', component: AdminUsersComponent },
    { path: 'update-stock', component: AdminUpdateStockComponent },
  ]
},

{
  path: 'home',
  loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
},

{
  path: 'category/:category',
  loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)
},

{ path: 'search', component: SearchResultsComponent },


];