import { Component, DestroyRef, effect, inject, input, OnInit, output } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BorrowRecord } from '../../models/borrow-book.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, RouterLink } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BorrowRecordService } from '../../../../core/services/borrow-record-service';

@Component({
  imports: [NzCardModule, NzGridModule, NzButtonModule, RouterLink, NzTagModule],
  selector: 'app-borrow-book-card',
  styleUrl: './borrow-book-card.css',
  templateUrl: './borrow-book-card.html',
})
export class BorrowBookCard {
  private route = inject(Router);
  private borrowRecordService = inject(BorrowRecordService);
  private destroyRef = inject(DestroyRef);
  borrowRecord = input.required<BorrowRecord>();
  bookReturned = output<BorrowRecord>();

  constructor() {
    effect(() => {
      console.log(this.borrowRecord().bookImage);
    });
  }

  onReadOnline() {
    console.log('Read online');
    this.route.navigate(['/read-online']);
  }
  onReturnBook(recordId: number) {
    if (this.borrowRecord().returnedDate) {
      alert('already return');
      return;
    }
    const subscription = this.borrowRecordService.returnBook(recordId).subscribe({
      next: (updateRecord) => {
        console.log('Book Returned.', updateRecord);
        this.bookReturned.emit(updateRecord);
      },
      error: (err) => {
        console.log('Error while returning books.', err);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
