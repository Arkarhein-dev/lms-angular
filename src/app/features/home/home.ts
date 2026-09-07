import { Component, inject, OnInit, signal } from '@angular/core';
import { BookCard } from '../books/components/book-card/book-card';
import { SearchBox } from '../../shared/components/search-box/search-box';
import { Book } from '../books/models/book.model';
import { BookService } from '../../core/services/book.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  imports: [BookCard, SearchBox, NzSpinModule, NzAlertModule, NzButtonModule, NzPaginationModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private bookService = inject(BookService);

  private booksSignal = signal<Book[]>([]);
  books = this.booksSignal.asReadonly();

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  currentSearchTerm = signal<string>('');

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(page: number = this.currentPage(), keyword: string = this.currentSearchTerm()): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.currentSearchTerm.set(keyword);

    const pageIndex = page - 1;

    this.bookService.getBooks(pageIndex, this.pageSize(), keyword).subscribe({
      next: (response) => {
        this.booksSignal.set(response.content);
        this.totalElements.set(response.totalElements);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error Fetching Books', err.message);
        this.errorMessage.set('Failed to fetch Books. Please check your internet connection.');
        this.isLoading.set(false);
      },
    });
  }

  handleSearchSubmitted(searchTerm: string): void {
    this.fetchBooks(1, searchTerm);
  }

  onPageIndexChange(pageIndex: number) {
    this.fetchBooks(pageIndex);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize.set(pageSize);
    this.fetchBooks(1);
  }
}
