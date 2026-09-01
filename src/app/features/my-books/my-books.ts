import { Component } from '@angular/core';
import { BorrowBook, BorrowStatus } from './models/borrow-book.model';
import { BookingSummary } from './components/booking-summary/booking-summary';
import { BorrowBookCard } from './components/borrow-book-card/borrow-book-card';
import { NzGridModule } from 'ng-zorro-antd/grid';

export const borrowBooks: BorrowBook[] = [
  {
    id: 1,
    bookId: 101,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcbUsRUHuWS2IZzq3R8UDIsOAPse3C5Wrk-aJENvbrM-nxYXI&s',
    bookTitle: 'Spiderman No way home',
    userId: 501,
    borrowDate: '2026-08-15',
    dueDate: '2026-08-28',
    returnDate: '',
    BorrowStatus: 'OVERDUE',
  },
  {
    id: 2,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzp8bPpqBWwdjzTlWXchN2xFJOnSqLaBfa3jQxD7DmFlvNe0vY&s',
    bookTitle: 'Advanger: Infinity War',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '',
    BorrowStatus: 'BORROWED',
  },
  {
    id: 3,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw-LiMcYepihMzxZQCWFDZqe_qKvBEHZ9Noh9AlIdFk6KVZYs&s',
    bookTitle: 'End Game',
    userId: 103,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '',
    BorrowStatus: 'BORROWED',
  },
  {
    id: 4,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '',
    BorrowStatus: 'BORROWED',
  },
  {
    id: 5,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '2026-09-11',
    BorrowStatus: 'RETURNED',
  },
  {
    id: 6,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 104,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '2026-09-11',
    BorrowStatus: 'RETURNED',
  },
  {
    id: 7,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '2026-09-11',
    BorrowStatus: 'RETURNED',
  },
  {
    id: 8,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-11',
    returnDate: '2026-09-11',
    BorrowStatus: 'RETURNED',
  },
  {
    id: 9,
    bookId: 102,
    bookImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_q8bkJUxMYUDWw5nDEMxHcDt5UggrP701UmVIzyLssCmJhQM&s',
    bookTitle: 'Spider man : Barnd new Day',
    userId: 502,
    borrowDate: '2026-08-28',
    dueDate: '2026-09-05',
    returnDate: '2026-09-11',
    BorrowStatus: 'RETURNED',
  },
];

@Component({
  imports: [BookingSummary, BorrowBookCard, NzGridModule],
  selector: 'app-my-books',
  styleUrl: './my-books.css',
  templateUrl: './my-books.html',
})
export class MyBooks {
  borrowBooks = borrowBooks;
}
