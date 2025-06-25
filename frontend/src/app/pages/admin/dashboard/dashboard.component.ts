import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalProducts = 0;
  lowStockAlerts = 0;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    if (this.isDashboardPage) {
      this.loadDashboardData();
    }
  }

  get isDashboardPage(): boolean {
    return this.router.url === '/admin/dashboard';
  }

  loadDashboardData() {
    this.http.get<any[]>('http://localhost:3000/auth/users').subscribe({
      next: users => this.totalUsers = users.length,
      error: err => console.error('Failed to load users', err),
    });

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:3000/products', { headers }).subscribe({
      next: products => {

        this.totalProducts = products.length;

        this.lowStockAlerts = products.filter(p => typeof p.stock === 'number' && p.stock < 5).length;
      },
      error: err => console.error('Failed to load products', err),
    });
  }
}
