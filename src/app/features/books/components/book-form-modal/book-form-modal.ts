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
    title: string;
    author: string;
    imageUrl: string;
    genre: string;
    stock: number;
    description: string;
  }>();

  // Use RegExp literal instead of string to prevent backslash escaping issues
  private urlPattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  bookForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(40)],
    }),
    author: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    imageUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(this.urlPattern)],
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    stock: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(999)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(1000)],
    }),
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
          stock: book.stock ?? 0,
          description: book.description,
        });
      } else {
        this.bookForm.reset({ stock: 0 });
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
  }
}
