import { Component, inject, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BorrowBook } from '../../models/borrow-book.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, RouterLink } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  imports: [NzCardModule, NzGridModule, NzButtonModule, RouterLink, NzTagModule],
  selector: 'app-borrow-book-card',
  styleUrl: './borrow-book-card.css',
  templateUrl: './borrow-book-card.html',
})
export class BorrowBookCard {
  private route = inject(Router);
  borrowBook = input.required<BorrowBook>();

  onReadOnline() {
    console.log('Read online');
    this.route.navigate(['/read-online']);
  }
  onReturnBook() {
    console.log('Return Book');
  }
}
