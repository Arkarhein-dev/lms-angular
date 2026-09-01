import { Component, output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Login } from '../../../features/auth/login/login';

@Component({
  imports: [NzLayoutModule, NzMenuModule, NzIconModule, RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  loginClick = output<void>();

  onLoginClick() {
    this.loginClick.emit();
  }
}
