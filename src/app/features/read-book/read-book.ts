import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-read-book',
  styleUrl: './read-book.css',
  templateUrl: './read-book.html',
})
export class ReadBook {
  bookId = input<number>();

  constructor() {
    console.log('BookID: ', this.bookId);
  }
}
