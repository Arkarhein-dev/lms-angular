import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Navbar } from './shared/components/navbar/navbar';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzLayoutModule, Navbar, Login,Register],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
