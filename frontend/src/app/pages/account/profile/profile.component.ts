import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShippingAddressComponent } from '../shipping-address/shipping-address.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ShippingAddressComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  faPen = faPen;
  editing = false;

  user = {
    name: 'Leah Achieng',
    email: 'olaachieng123@gmail.com',
    phone: '+254 712 345678',
  };

  constructor(private router: Router) {} 

  startEdit() {
    this.editing = true;
  }

  saveEdit() {
    this.editing = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']); 
  }
}
