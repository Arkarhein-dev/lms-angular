import { Book } from './../../books/models/book.model';
import { Component, effect, inject, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SearchBox } from '../../../shared/components/search-box/search-box';
import { BookFormModal } from '../../books/components/book-form-modal/book-form-modal';
import { BookService } from '../../../core/services/book.service';

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
export class Dashboard {
  private bookService = inject(BookService);
  private booksSignal = signal<Book[]>([]);
  books = this.booksSignal.asReadonly();
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      console.log(this.booksSignal().length);
    });
  }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.booksSignal.set(books.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error Fetching Books', err.message);
        this.errorMessage.set('Failed to fetch Books. Please check your internet connection.');
        this.isLoading.set(false);
      },
      complete: () => console.log('Book Fetching Completed'),
    });
  }

  isBookFormVisible = signal(false);
  selectedBook = signal<Book | null>(null);

  openCreateBookForm() {
    this.selectedBook.set(null);
    this.isBookFormVisible.set(true);
  }

  openUpdateBookForm(book: Book) {
    this.selectedBook.set(book);
    this.isBookFormVisible.set(true);
  }

  closeBookForm() {
    this.isBookFormVisible.set(false);
    this.selectedBook.set(null);
  }

  handleBookSubmit(bookData: any): void {
    if (this.selectedBook()) {
      console.log('UPDATE BOOK');
      console.log('Book ID:', this.selectedBook()?.id);
      console.log('Form data:', bookData);
    } else {
      console.log('CREATE BOOK');
      console.log('Form data:', bookData);
    }
    this.closeBookForm();
  }

  deleteBook(book: Book) {}
}
