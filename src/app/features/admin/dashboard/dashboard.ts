import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Book } from '../../books/models/book.model';
import { SearchBox } from '../../../shared/components/search-box/search-box';

@Component({
  imports: [
    NzButtonModule,
    NzGridModule,
    NzStatisticModule,
    NzCardModule,
    NzIconModule,
    NzTableModule,
    SearchBox,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  bookDataList = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      imageUrl: 'https://openlibrary.org',
      genre: 'Classic Fiction',
      available: true,
      stock: 12,
      description:
        'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, capturing the essence of the roaring twenties.',
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      imageUrl: 'https://openlibrary.org',
      genre: 'Classic Fiction',
      available: true,
      stock: 8,
      description:
        'The explosion of racial injustice in the American South, seen through the innocent eyes of a young girl named Scout Finch.',
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      imageUrl: 'https://openlibrary.org',
      genre: 'Dystopian Fiction',
      available: true,
      stock: 15,
      description:
        'A chilling look at a totalitarian regime where Big Brother is always watching and independent thought is a punishable crime.',
    },
    {
      id: 4,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      imageUrl: 'https://openlibrary.org',
      genre: 'Fantasy',
      available: false,
      stock: 0,
      description:
        'Bilbo Baggins is whisked away from his comfortable hobbit-hole by Gandalf the wizard and a band of dwarves on a quest to reclaim a lost treasure.',
    },
    {
      id: 5,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      imageUrl: 'https://openlibrary.org',
      genre: 'Classic Romance',
      available: true,
      stock: 6,
      description:
        'The turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.',
    },
    {
      id: 6,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      imageUrl: 'https://openlibrary.org',
      genre: 'Classic Fiction',
      available: true,
      stock: 5,
      description:
        'The classic novel of teenage angst and alienation, following young Holden Caulfield as he wanders through New York City.',
    },
    {
      id: 7,
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      imageUrl: 'https://openlibrary.org',
      genre: 'Science Fiction',
      available: true,
      stock: 9,
      description:
        'Set in a bleak, dystopian future where books are banned and "firemen" are tasked with burning any remaining printed material.',
    },
    {
      id: 8,
      title: 'Moby-Dick',
      author: 'Herman Melville',
      imageUrl: 'https://openlibrary.org',
      genre: 'Adventure Fiction',
      available: true,
      stock: 4,
      description:
        'The obsessive quest of Captain Ahab for revenge on Moby Dick, the giant white whale that destroyed his ship and severed his leg.',
    },
    {
      id: 9,
      title: 'Brave New World',
      author: 'Aldous Huxley',
      imageUrl: 'https://openlibrary.org',
      genre: 'Dystopian Fiction',
      available: true,
      stock: 11,
      description:
        'An engineered society where citizens are genetically stratified, conditioned, and pharmacologically engineered to keep the status quo.',
    },
    {
      id: 10,
      title: 'The Fellowship of the Ring',
      author: 'J.R.R. Tolkien',
      imageUrl: 'https://openlibrary.org',
      genre: 'Fantasy',
      available: true,
      stock: 7,
      description:
        'The opening segment of an epic journey where a young hobbit named Frodo Baggins is entrusted with destroying a ring of ultimate power.',
    },
  ];

  editBook(book: Book) {}

  deleteBook(book: Book) {}
}
