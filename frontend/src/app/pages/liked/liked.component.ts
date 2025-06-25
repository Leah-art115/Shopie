import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikedService } from '../../services/liked.service';
import { Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked.component.html',
  styleUrls: ['./liked.component.css'],
})
export class LikedComponent implements OnInit {
  likedProducts: Product[] = [];

  constructor(private likedService: LikedService) {}

  ngOnInit(): void {
    this.likedProducts = this.likedService.getLikedProducts();
  }

  unlike(product: Product) {
    this.likedService.unlike(product);
    this.likedProducts = this.likedService.getLikedProducts();
  }
}
