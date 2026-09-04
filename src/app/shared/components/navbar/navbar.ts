import { Component, inject, output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Login } from '../../../features/auth/login/login';
import { AuthService } from '../../../core/services/auth-service';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonComponent } from "ng-zorro-antd/button";

@Component({
  imports: [
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    RouterLink,
    NzDropdownModule,
    NzAvatarModule,
    NzButtonComponent
],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  router = inject(Router);
  authService = inject(AuthService);

  loginClick = output<void>();

  onLoginClick() {
    this.loginClick.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
