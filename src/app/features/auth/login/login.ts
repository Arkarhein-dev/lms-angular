import { Component, signal, output, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService, LoginRequest } from '../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginFormVisible = signal(false);
  isLoading = signal(false);
  registerRequest = output<void>();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  showModal() {
    this.isLoginFormVisible.set(true);
  }

  handleCancel() {
    this.isLoginFormVisible.set(false);
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const credentials = this.loginForm.value as LoginRequest;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isLoginFormVisible.set(false);
        this.loginForm.reset();

        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/my-books']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login Failed', err);
      },
    });
  }

  register() {
    this.loginForm.reset();
    this.isLoginFormVisible.set(false);
    this.registerRequest.emit();
  }
}
