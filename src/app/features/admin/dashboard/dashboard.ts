import { UserService } from './../../../core/services/user-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Book } from '../../books/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { SearchBox } from '../../../shared/components/search-box/search-box';
import { BookFormModal } from '../../books/components/book-form-modal/book-form-modal';
import { User } from '../user-management/user.model';
import { map } from 'rxjs';
import { BorrowRecordService } from '../../../core/services/borrow-record-service';
import { BorrowRecord } from '../../my-books/models/borrow-book.model';

@Component({
  imports: [
    NzButtonModule,
    NzGridModule,
    NzStatisticModule,
    NzCardModule,
    NzIconModule,
    NzTableModule,
    SearchBox,
    BookFormModal,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private bookService = inject(BookService);
  private useService = inject(UserService);
  private borrowRecordService = inject(BorrowRecordService);

  private booksSignal = signal<Book[]>([]);
  books = this.booksSignal.asReadonly();
  private usersSignal = signal<User[]>([]);
  users = this.usersSignal.asReadonly();
  private borrowRecordsSignal = signal<BorrowRecord[]>([]);
  borrowRecords = this.borrowRecordsSignal.asReadonly();

  overduedBooks = computed(() =>
    this.borrowRecords().filter((borrowRecord) => borrowRecord.status === 'OVERDUE'),
  );

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Pagination & Sorting State
  pageIndex = signal<number>(1);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  sortField = signal<string>('id');
  sortDir = signal<'asc' | 'desc'>('asc');
  currentSearchTerm = signal<string>('');

  // Modal State
  isBookFormVisible = signal(false);
  selectedBook = signal<Book | null>(null);

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchBorrowRecords();
  }

  fetchUsers() {
    this.useService
      .getAllUsers()
      .pipe(map((pages) => pages.content))
      .subscribe({
        next: (response) => this.usersSignal.set(response),
        error: (err) =>
          console.error('error while fetching user data in dashboard component : ', err),
      });
  }

  fetchBorrowRecords() {
    this.borrowRecordService
      .getAllBorrowRecords()
      .pipe(map((pages) => pages.content))
      .subscribe({
        next: (response) => this.borrowRecordsSignal.set(response),
        error: (err) =>
          console.error('Error while fetching borrow records in admin dashboard : ', err),
      });
  }

  /**
   * Handles pagination, column sorting, and initial load via Ng-Zorro table queries.
   */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize, sort } = params;

    const currentSort = sort.find((item) => item.value !== null);
    const activeSortField = currentSort ? currentSort.key : 'id';
    const activeSortDir = currentSort && currentSort.value === 'descend' ? 'desc' : 'asc';

    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
    this.sortField.set(activeSortField);
    this.sortDir.set(activeSortDir);

    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Convert 1-based Ng-Zorro page index to 0-based Spring page index
    const springPageIndex = this.pageIndex() - 1;

    this.bookService
      .getBooks(
        springPageIndex,
        this.pageSize(),
        this.currentSearchTerm(),
        false,
        this.sortField(),
        this.sortDir(),
      )
      .subscribe({
        next: (pageData) => {
          this.booksSignal.set(pageData.content);
          this.totalElements.set(pageData.totalElements);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching books:', err);
          this.errorMessage.set('Failed to fetch books. Please check connection.');
          this.isLoading.set(false);
        },
      });
  }

  handleSearchSubmit(searchTerm: string): void {
    this.currentSearchTerm.set(searchTerm);
    this.pageIndex.set(1); // Reset to first page on new search
    this.fetchBooks();
  }

  openCreateBookForm(): void {
    this.selectedBook.set(null);
    this.isBookFormVisible.set(true);
  }

  openUpdateBookForm(book: Book): void {
    this.selectedBook.set(book);
    this.isBookFormVisible.set(true);
  }

  closeBookForm(): void {
    this.isBookFormVisible.set(false);
    this.selectedBook.set(null);
  }

  handleBookSubmit(bookData: any): void {
    const currentBook = this.selectedBook();
    if (currentBook) {
      this.bookService.updateBook(currentBook.id, bookData).subscribe({
        next: () => {
          this.fetchBooks(); // Refresh view to reflect server state
          this.closeBookForm();
        },
        error: (err) => console.error('Error updating book:', err),
      });
    } else {
      this.bookService.createBook(bookData).subscribe({
        next: () => {
          this.fetchBooks();
          this.closeBookForm();
        },
        error: (err) => console.error('Error creating book:', err),
      });
    }
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete book ID "${book.id}"?`)) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => this.fetchBooks(),
        error: (err) => console.error('Error deleting book:', err),
      });
    }
  }
}
