import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/page.model';
import {
  BookReturnRequest,
  BorrowRecord,
  BorrowRecordRequest,
} from '../../features/my-books/models/borrow-book.model';

@Service()
export class BorrowRecordService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/library/api/v1/borrow-records';

  getAllBorrowRecords(): Observable<Page<BorrowRecord>> {
    return this.httpClient.get<Page<BorrowRecord>>(`${this.apiUrl}/all`);
  }

  getBorrowRecords(page: number = 0, size: number = 15): Observable<Page<BorrowRecord>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.httpClient.get<Page<BorrowRecord>>(this.apiUrl, { params });
  }

  getBorrowRecordsByUser(
    userId: number,
    status?: string,
    page: number = 0,
    size: number = 15,
  ): Observable<Page<BorrowRecord>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.httpClient.get<Page<BorrowRecord>>(`${this.apiUrl}/${userId}`, { params });
  }

  borrowBook(bookId: number, borrowDays: number = 14): Observable<BorrowRecord> {
    const params = new HttpParams().set('dueDate', borrowDays.toString());
    const body: BorrowRecordRequest = { bookId };
    return this.httpClient.post<BorrowRecord>(`${this.apiUrl}/borrow-book`, body, { params });
  }

  returnBook(recordId: number): Observable<BorrowRecord> {
    const body: BookReturnRequest = { recordId };
    return this.httpClient.post<BorrowRecord>(`${this.apiUrl}/return-book`, body);
  }
}
