import { Component, computed, effect, input } from '@angular/core';
import { User } from '../user.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { borrowBooks } from '../../../my-books/my-books';
import { BorrowBook } from '../../../my-books/models/borrow-book.model';
import { dummyUsers } from '../user-management';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  imports: [NzTableModule, NzTagComponent, NzCardModule],
  selector: 'app-user-borrow-books',
  styleUrl: './user-borrow-books.css',
  templateUrl: './user-borrow-books.html',
})
export class UserBorrowBooks {
  userId = input<number>();
  user = dummyUsers.find((user) => user.id === this.userId());
  borrowBooks: BorrowBook[] = borrowBooks;
  userBorrowBooks!: BorrowBook[];

  constructor() {
    // to inspect userId value when the component is initialized
    effect(() => {
      if (this.userId() !== undefined) {
        console.log('UserBorrowBooks component resolved with user ID:', this.userId());
      }
      this.userBorrowBooks = borrowBooks.filter((book) => book.userId === this.userId());
      console.log(this.userBorrowBooks);
    });
  }

  ngonInit() {
    
  }
}
