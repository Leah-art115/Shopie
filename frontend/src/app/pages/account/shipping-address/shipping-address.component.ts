import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent {
  faPen = faPen;

  county = '';
  subcounty = '';
  town = '';
  successMessage = '';
  editing = false;

  shippingAddress = {
    county: 'Nairobi',
    subcounty: 'Westlands',
    town: 'Parklands'
  };

  get hasAddress(): boolean {
    return this.shippingAddress.county !== '' && !this.editing;
  }

  startEdit() {
    this.editing = true;
    this.county = this.shippingAddress.county;
    this.subcounty = this.shippingAddress.subcounty;
    this.town = this.shippingAddress.town;
  }

  saveAddress() {
    this.shippingAddress = {
      county: this.county,
      subcounty: this.subcounty,
      town: this.town
    };
    this.successMessage = 'Shipping address updated!';
    this.editing = false;
  }
}
