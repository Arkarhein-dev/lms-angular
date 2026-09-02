import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  imports: [NzModalModule, NzInputModule, NzButtonModule, ReactiveFormsModule, NzFormModule],
  selector: 'app-book-form-modal',
  styleUrl: './book-form-modal.css',
  templateUrl: './book-form-modal.html',
})
export class BookFormModal {
  visible = input(false);
  book = input<Book | null>(null);
  closed = output<void>();
  submitted = output<{
    title: string | null;
    author: string | null;
    imageUrl: string | null;
    genre: string | null;
    stock: number | null;
    description: string | null;
  }>();

  private urlPattern = '(https?://)?([\\da-z-]+)\\.([a-z]{2,6})([/\\w -]*)*/?';

  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    author: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    imageUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(this.urlPattern), // Ensures it behaves like an image link
    ]),
    genre: new FormControl('', [Validators.required]),
    // FIX: Set an explicit boolean initial state. Remove required so 'false' is allowed.
    stock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0), // Cannot have negative books in inventory
      Validators.max(999), // Keeps data within reasonable bounds
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20), // Ensures meaningful details are provided
      Validators.maxLength(1000),
    ]),
  });

  constructor() {
    effect(() => {
      const book = this.book();
      if (book) {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
          genre: book.genre,
          stock: book.stock,
          description: book.description,
        });
      }
    });
  }

  closeModal() {
    this.closed.emit();
    this.bookForm.reset();
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.bookForm.getRawValue());
    this.bookForm.reset();
    this.closeModal();
  }
}
