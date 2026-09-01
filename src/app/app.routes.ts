import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MyBooks } from './features/my-books/my-books';
import { BookDetails } from './features/books/pages/book-details/book-details';
import { ReadBook } from './features/read-book/read-book';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { UserManagement } from './features/admin/user-management/user-management';
import { UserBorrowBooks } from './features/admin/user-management/user-borrow-books/user-borrow-books';
// import { Login } from './auth/login/login';

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

  {
    path: 'admin/dashboard',
    component: Dashboard,
  },
  {
    path: 'admin/user-management',
    component: UserManagement,
  },

  {
    path: 'admin/user/:userId/borrowed-books',
    component: UserBorrowBooks,
  },
];
