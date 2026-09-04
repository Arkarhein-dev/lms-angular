import { Component, computed, effect, input, numberAttribute } from '@angular/core';
import { User } from '../user.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { borrowBooks } from '../../../my-books/my-books';
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
  userId = input<number, string | number>(undefined, {
    transform: numberAttribute,
  });

  user = computed(() => dummyUsers.find((user) => user.id === this.userId()));

  userBorrowBooks = computed(() =>
    borrowBooks.filter((borrowBook) => borrowBook.userId === this.userId()),
  );

  constructor() {
    effect(() => {
      console.log('userId:', this.userId());
      console.log('userId type:', typeof this.userId());

      console.log('borrowBooks:', borrowBooks);

      borrowBooks.forEach((book) => {
        console.log('borrowBook userId:', book.userId, 'type:', typeof book.userId);
      });

      console.log('filtered:', this.userBorrowBooks());
    });
  }
}
