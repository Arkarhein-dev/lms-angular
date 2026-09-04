import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BorrowRecord } from './models/borrow-book.model';
import { BookingSummary } from './components/booking-summary/booking-summary';
import { BorrowBookCard } from './components/borrow-book-card/borrow-book-card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BorrowRecordService } from '../../core/services/borrow-record-service';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

export const borrowBooks: BorrowRecord[] = [
  {
    id: 1,
    bookId: 101,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcbUsRUHuWS2IZzq3R8UDIsOAPse3C5Wrk-aJENvbrM-nxYXI&s',
    bookTitle: 'Spiderman No way home',
    bookDescription: 'bla bla bla',
    userId: 501,
    borrowDate: '2026-08-15',
    dueDate: '2026-08-28',
    returnedDate: '',
    status: 'OVERDUE',
  },
  {
    id: 2,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzp8bPpqBWwdjzTlWXchN2xFJOnSqLaBfa3jQxD7DmFlvNe0vY&s',
    bookTitle: 'Advanger: Infinity War',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '',
    status: 'BORROWED',
  },
  {
    id: 3,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw-LiMcYepihMzxZQCWFDZqe_qKvBEHZ9Noh9AlIdFk6KVZYs&s',
    bookTitle: 'End Game',
    bookDescription: 'bla bla bla',
    userId: 103,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '',
    status: 'BORROWED',
  },
  {
    id: 4,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '',
    status: 'BORROWED',
  },
  {
    id: 5,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '2026-09-11',
    status: 'RETURNED',
  },
  {
    id: 6,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 104,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '2026-09-11',
    status: 'RETURNED',
  },
  {
    id: 7,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '2026-09-11',
    status: 'RETURNED',
  },
  {
    id: 8,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnedDate: '2026-09-11',
    status: 'RETURNED',
  },
  {
    id: 9,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    bookDescription: 'bla bla bla',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-05',
    returnedDate: '2026-09-11',
    status: 'RETURNED',
  },
];

@Component({
  imports: [BookingSummary, BorrowBookCard, NzGridModule, NzEmptyModule],
  selector: 'app-my-books',
  styleUrl: './my-books.css',
  templateUrl: './my-books.html',
})
export class MyBooks implements OnInit {
  private borrowRecordService = inject(BorrowRecordService);
  private destroyRef = inject(DestroyRef);
  private borrowRecordsSignal = signal<BorrowRecord[]>([]);
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
