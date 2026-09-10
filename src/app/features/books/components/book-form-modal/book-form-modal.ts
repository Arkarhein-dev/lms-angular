import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  imports: [
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzUploadModule,
  ],
  selector: 'app-book-form-modal',
  styleUrl: './book-form-modal.css',
  templateUrl: './book-form-modal.html',
})
export class BookFormModal {
  private message = inject(NzMessageService);

  visible = input(false);
  book = input<Book | null>(null);
  closed = output<void>();
  submitted = output<{
    title: string;
    author: string;
    genre: string;
    stock: number;
    description: string;
    coverFileName: string;
    coverBase64: string;
    pdfFileName: string;
    pdfBase64: string;
  }>();

  coverFileList: NzUploadFile[] = [];
  pdfFileList: NzUploadFile[] = [];

  bookForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(40)],
    }),
    author: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
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
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100000)],
    }),
    coverFileName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    coverBase64: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pdfFileName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pdfBase64: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const book = this.book();
      if (book) {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          genre: book.genre,
          stock: book.stock ?? 0,
          description: book.description,
        });
      } else {
        this.bookForm.reset({ stock: 0 });
      }
    });
  }

  beforeUploadCover = (file: NzUploadFile): boolean => {
    const rawFile = file as unknown as File;

    const isImage =
      rawFile.type === 'image/jpeg' ||
      rawFile.type === 'image/jpg' ||
      rawFile.type === 'image/png' ||
      rawFile.type === 'image/webp';

    if (!isImage) {
      this.message.error('You can only Upload JPG/PNG/JPEG/WEBP IMAGE file');
      return false;
    }

    const isLt5M = rawFile.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.message.error('File size must be smaller than 5MB.');
      return false;
    }

    this.coverFileList = [file];
    this.bookForm.patchValue({ coverFileName: file.name });

    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = () => {
      this.bookForm.patchValue({ coverBase64: reader.result as string });
    };
    return false;
  };

  beforeUploadPdf = (file: NzUploadFile): boolean => {
    const rawFile = file as unknown as File;

    const isPdf = rawFile.type === 'application/pdf' || rawFile.name.endsWith('.pdf');
    if (!isPdf) {
      this.message.error('You can only upload pdf files');
      return false;
    }

    const isLt50M = rawFile.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      this.message.error('Pdf file must be smaller than 50MB.');
      return false;
    }

    this.pdfFileList = [file];
    this.bookForm.patchValue({ pdfFileName: file.name });

    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = () => this.bookForm.patchValue({ pdfBase64: reader.result as string });

    return false;
  };

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
