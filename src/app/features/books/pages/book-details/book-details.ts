import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { BookCard } from '../../components/book-card/book-card';

@Component({
  imports: [NzPageHeaderModule, NzButtonModule, BookCard],
  selector: 'app-book-details',
  styleUrl: './book-details.css',
  templateUrl: './book-details.html',
})
export class BookDetails {
  route = inject(Router);
  bookId = input();

  bookData = {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfEsXDhjh6Mo1PXrhy8FlqS-3CO0JBoJSWCgKHVuJkyg&s',
    genre: 'Classic Fiction',
    available: true,
    description:
      'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, capturing the essence of the roaring twenties.',
  };

  onBackHome() {
    this.route.navigate(['/home']);
  }

  onBorrowBook() {
    this.onBackHome();
  }
}
