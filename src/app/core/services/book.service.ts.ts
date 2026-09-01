import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class BookServiceTs {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/library';
  
}
