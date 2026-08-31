import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterLink } from "@angular/router";

@Component({
  imports: [NzCardModule, RouterLink],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  // @Input({ required: true }) bookId!: number;
  // @Input({ required: true }) bookImageUrl!: number;
}
