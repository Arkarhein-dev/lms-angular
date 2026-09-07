import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagComponent, NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { map } from 'rxjs';
import { BorrowRecord } from '../../../my-books/models/borrow-book.model';
import { BorrowRecordService } from '../../../../core/services/borrow-record-service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-borrow-books',
  imports: [
    NzTableModule,
    NzTagComponent,
    NzCardModule,
    NzTagModule,
    NzButtonComponent,
    NzIconModule,
    RouterLink,
  ],
  styleUrl: './user-borrow-books.css',
  templateUrl: './user-borrow-books.html',
})
export class UserBorrowBooks {
  private borrowRecordService = inject(BorrowRecordService);

  userId = input<number, string | number>(undefined, {
    transform: numberAttribute,
  });

  borrowRecords = signal<BorrowRecord[]>([]);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id != undefined && !isNaN(id)) {
        this.fetchBorrowRecordsByUser(id);
      } else {
        this.borrowRecords.set([]);
      }
    });
  }

  fetchBorrowRecordsByUser(userId: number): void {
    this.borrowRecordService
      .getBorrowRecordsByUser(userId)
      .pipe(map((pages) => pages.content))
      .subscribe({
        next: (records) => this.borrowRecords.set(records),
        error: (err) => console.error(`Failed to fetch records for user ${userId}:`, err),
      });
  }
}
