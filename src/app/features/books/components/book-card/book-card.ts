import { Component, input, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  imports: [NzCardModule, RouterLink],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  book = input<Book>();
}
