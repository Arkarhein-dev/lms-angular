import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MyBooks } from './features/my-books/my-books';
import { BookDetails } from './features/books/pages/book-details/book-details';
import { ReadBook } from './features/read-book/read-book';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { UserManagement } from './features/admin/user-management/user-management';
import { UserBorrowBooks } from './features/admin/user-management/user-borrow-books/user-borrow-books';
import { authGuard } from './core/auth/auth-guard';
import { adminGuard } from './core/auth/admin-guard';
import { AdminSettings } from './features/admin/admin-settings/admin-settings';
import { userGuard } from './core/auth/user-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    canActivate: [userGuard],
  },
  {
    path: 'book-detail/:bookId',
    component: BookDetails,
    canActivate: [userGuard],
  },

  // User Guard
  {
    path: 'my-books',
    component: MyBooks,
    canActivate: [authGuard, userGuard],
  },
  {
    path: 'read-online/:bookId',
    component: ReadBook,
    canActivate: [authGuard, userGuard],
  },

  // Admin Guard
  {
    path: 'admin/dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/user-management',
    component: UserManagement,
    canActivate: [adminGuard],
  },

  {
    path: 'admin/user/:userId/borrowed-books',
    component: UserBorrowBooks,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/admin-setting',
    component: AdminSettings,
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  }, 
];
