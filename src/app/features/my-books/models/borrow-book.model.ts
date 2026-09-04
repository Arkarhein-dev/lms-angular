export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface BorrowRecord {
  id: number;
  bookId: number;
  bookImage: string;
  bookTitle: string;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnedDate: string;
  status: BorrowStatus;
}

export interface BorrowRecordRequest {
  bookId: number;
}

export interface BookReturnRequest {
  recordId: number;
}
