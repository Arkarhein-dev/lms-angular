import { Component, signal,output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  isLoginFormVisible = signal(false);
  registerRequest = output<void>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  showModal() {
    this.isLoginFormVisible.set(true);
  }

  handleCancel() {
    this.isLoginFormVisible.set(false);
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
    this.isLoginFormVisible.set(false);
  }

  register(){
    this.loginForm.reset();
    this.isLoginFormVisible.set(false);
    this.registerRequest.emit();
  }

}
