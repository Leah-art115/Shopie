import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  showLogin = true;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  toggleForm() {
    this.showLogin = !this.showLogin;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  login() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/auth/login', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.access_token);

            try {
              const decodedToken = JSON.parse(atob(res.access_token.split('.')[1]));
              localStorage.setItem('user', JSON.stringify(decodedToken));

              const isAdmin = decodedToken.role === 'ADMIN';
              this.loginForm.reset();
              this.router.navigate([isAdmin ? '/admin' : '/home']);
            } catch (error) {
              console.error('Error decoding token:', error);
              this.popupService.show('Login failed: Invalid token format'); 
            }
          },
          error: (err) => {
            console.error('Login error:', err);
            this.popupService.show('Login failed: ' + (err.error?.message || 'Unknown error occurred')); 
          }
        });
    } else {
      this.popupService.show('Please fill in all required fields correctly.'); 
    }
  }

  register() {
    if (this.registerForm.valid) {
      const { password, confirmPassword, ...data } = this.registerForm.value;
      if (password !== confirmPassword) {
        this.popupService.show('Passwords do not match'); 
        return;
      }

      this.http.post('http://localhost:3000/auth/register', {
        ...data,
        password,
        confirmPassword
      }).subscribe({
        next: () => {
          this.popupService.show('Registered successfully. You can now login.'); 
          this.registerForm.reset();
          this.toggleForm(); 
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.popupService.show('Registration failed: ' + (err.error?.message || 'Unknown error occurred')); 
        }
      });
    } else {
      this.popupService.show('Please fill in all required fields correctly.'); 
    }
  }
}
