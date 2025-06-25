import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopupService } from '../../services/popup.service';
@Component({
  selector: 'app-contact-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css'],
})
export class ContactSellerComponent {
  message = '';
  feedback = '';
  loading = false;

  constructor(private http: HttpClient, private popupService: PopupService) {} 

  sendMessage() {
    if (!this.message.trim()) {
      this.popupService.show('Please enter a message.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.popupService.show('You must be logged in to send a message.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.loading = true;

    this.http
      .post(
        'http://localhost:3000/mailer/contact',
        { message: this.message },
        { headers }
      )
      .subscribe({
        next: () => {
          this.popupService.show('Your message was sent successfully.');
          this.message = '';
          this.loading = false;
        },
        error: () => {
          this.popupService.show('Failed to send your message. Please try again.');
          this.loading = false;
        },
      });
  }
}
