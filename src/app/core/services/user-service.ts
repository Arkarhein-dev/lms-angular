import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../features/admin/user-management/user.model';
import { Page } from '../../shared/models/page.model';

@Service()
export class UserService {
  private httpclient = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/library/api/v1/users';

  getAllUsers(page: number = 0, size: number = 15): Observable<Page<User>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.httpclient.get<Page<User>>(this.apiUrl, { params });
  }
}
