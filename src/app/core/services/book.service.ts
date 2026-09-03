import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookCreateOrUpdateRequest } from '../../features/books/models/book.model';
import { Page } from '../../shared/models/page.model';

@Service()
export class BookService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/library/api/v1/books';

  getAllBooks(page: number = 0, size: number = 15): Observable<Page<Book>> {
    const params = new HttpParams().set('pageNo', page.toString()).set('pageSize', size.toString());

    return this.httpClient.get<Page<Book>>(this.apiUrl, { params });
  }

  createBook(newBook: BookCreateOrUpdateRequest): Observable<Book> {
    return this.httpClient.post<Book>(this.apiUrl, newBook);
  }

  updateBook(id: number, bookData: BookCreateOrUpdateRequest): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/${id}`, bookData);
  }

  deleteBook(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
