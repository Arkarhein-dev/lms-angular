import { Component, inject, OnInit, signal } from '@angular/core';
import { BookCard } from '../books/components/book-card/book-card';
import { SearchBox } from '../../shared/components/search-box/search-box';
import { Book } from '../books/models/book.model';
import { BookService } from '../../core/services/book.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  imports: [BookCard, SearchBox, NzSpinModule, NzAlertModule, NzButtonModule],
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

  handleSearchSubmitted(searchTerm: string) {
    console.log('Search Term: ', searchTerm);
  }
}
