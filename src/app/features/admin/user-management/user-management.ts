import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { SearchBox } from '../../../shared/components/search-box/search-box';
import { RouterLink } from '@angular/router';
import { User } from './user.model';

export const dummyUsers: User[] = [
  {
    id: 101,
    username: 'alex_admin',
    role: 'ADMIN',
  },
  {
    id: 502,
    username: 'sarah_books',
    role: 'USER',
  },
  {
    id: 103,
    username: 'john_doe99',
    role: 'USER',
  },
  {
    id: 104,
    username: 'emily_read',
    role: 'USER',
  },
  {
    id: 105,
    username: 'james_lib2',
    role: 'USER',
  },
];

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
export class UserManagement {
  MOCK_USERS = dummyUsers;
}
