import { Component, inject, OnInit, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { SearchBox } from '../../../shared/components/search-box/search-box';
import { RouterLink } from '@angular/router';
import { User } from './user.model';
import { UserService } from '../../../core/services/user-service';
import { map } from 'rxjs';

@Component({
  imports: [
    NzIconModule,
    NzStatisticModule,
    NzTableModule,
    NzButtonComponent,
    SearchBox,
    RouterLink,
  ],
  selector: 'app-user-management',
  styleUrl: './user-management.css',
  templateUrl: './user-management.html',
})
export class UserManagement implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService
      .getAllUsers()
      .pipe(map((page) => page.content))
      .subscribe({
        next: (userList: User[]) => this.users.set(userList),
        error: (err) => console.error('Error while fetching users ', err),
      });
  }
}
