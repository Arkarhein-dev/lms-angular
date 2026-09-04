import { Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AuthService, RegisterRequest } from '../../../core/services/auth-service';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  imports: [
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  isRegisterFormVisible = signal(false);
  isLoading = signal(false);

  registerForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      passwordConfirm: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator },
  );

  showRegisterForm() {
    this.isRegisterFormVisible.set(true);
  }

  cancelRegister() {
    this.registerForm.reset();
    this.isRegisterFormVisible.set(false);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { username, email, password } = this.registerForm.value;

    const requestData: RegisterRequest = {
      username: username!,
      email: email!,
      password: password!,
    };

    this.authService.register(requestData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isRegisterFormVisible.set(false);
        this.registerForm.reset();

        // Default navigate to my-books after registering as USER
        this.router.navigate(['/my-books']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Registration Failed:', err);
      },
    });
  }
}
