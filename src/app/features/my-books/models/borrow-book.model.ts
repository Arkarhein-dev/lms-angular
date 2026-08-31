export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface BorrowBook {
  id: number;
  bookId: number;
  bookImage: string;
  bookTitle: string;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  BorrowStatus: BorrowStatus;
}
