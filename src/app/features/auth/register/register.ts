import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  imports: [
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzModalComponent,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzFormControlComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzButtonComponent,
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  isRegisterFormVisible = signal(false);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  showRegisterForm() {
    this.isRegisterFormVisible.set(true);
  }

  cancelRegister() {
    this.registerForm.reset();
    this.isRegisterFormVisible.set(false);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.isRegisterFormVisible.set(false);
      this.registerForm.reset();
    } else {
      this.registerForm.reset();
      this.isRegisterFormVisible.set(true);
    }
  }
}
