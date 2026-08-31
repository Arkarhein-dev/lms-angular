import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MyBooks } from './features/my-books/my-books';
import { BookDetails } from './features/books/pages/book-details/book-details';
import { ReadBook } from './features/read-book/read-book';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'book-detail/:bookId',
    component: BookDetails,
  },
  {
    path: 'my-books',
    component: MyBooks,
  },
  {
    path: 'read-online/:bookId',
    component: ReadBook,
  },
];
