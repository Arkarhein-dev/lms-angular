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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BookCard } from '../../components/book-card/book-card';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../models/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzButtonModule, NzSpinModule, BookCard],
  selector: 'app-book-details',
  styleUrl: './book-details.css',
  templateUrl: './book-details.html',
})
export class BookDetails implements OnInit {
  bookService = inject(BookService);
  route = inject(Router);

  bookId = input<number, string | number>(undefined, {
    transform: numberAttribute,
  });

  books = signal<Book[]>([]);
  isLoading = signal<boolean>(true);

  selectedBook = computed(() => this.books().find((book) => book.id === this.bookId()));

  constructor() {
    effect(() => {
      console.log('book id : ', this.bookId());
      console.log('selected book: ', this.selectedBook());
    });
  }

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response) => {
        this.books.set(response.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load books', err);
        this.isLoading.set(false);
      },
    });
  }

  onBackHome(): void {
    this.route.navigate(['/home']);
  }

  onBorrowBook(): void {
    this.onBackHome();
  }
}
