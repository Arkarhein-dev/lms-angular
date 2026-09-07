import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BorrowRecord } from './models/borrow-book.model';
import { BookingSummary } from './components/booking-summary/booking-summary';
import { BorrowBookCard } from './components/borrow-book-card/borrow-book-card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BorrowRecordService } from '../../core/services/borrow-record-service';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  imports: [BookingSummary, BorrowBookCard, NzGridModule, NzEmptyModule],
  selector: 'app-my-books',
  styleUrl: './my-books.css',
  templateUrl: './my-books.html',
})
export class MyBooks implements OnInit {
  private borrowRecordService = inject(BorrowRecordService);
  private destroyRef = inject(DestroyRef);
  protected borrowRecordsSignal = signal<BorrowRecord[]>([]);
  borrowRecords = this.borrowRecordsSignal.asReadonly();

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchBorrowRecords();
  }

  fetchBorrowRecords() {
    const subscription = this.borrowRecordService.getBorrowRecords().subscribe({
      next: (records) => {
        this.borrowRecordsSignal.set(records.content);
        console.log(this.borrowRecordsSignal());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error Fetching BorrowRecords', err.message);
        this.errorMessage.set(
          'Failed to fetch Borrow Record. Please check your internet connection.',
        );
        this.isLoading.set(false);
      },
      complete: () => console.log('Book Fetching Completed'),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onBookReturned(updateRecord: BorrowRecord) {
    this.borrowRecordsSignal.update((borrowRecords) =>
      borrowRecords.map((record) =>
        record.id === updateRecord.id ? { ...record, ...updateRecord } : record,
      ),
    );
  }
}
