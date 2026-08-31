import { Component } from '@angular/core';
import { BookCard } from '../books/components/book-card/book-card';
import { SearchBox } from '../../shared/components/search-box/search-box';

@Component({
  imports: [BookCard, SearchBox],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  handleSearchSubmitted(searchTerm: string) {
    console.log('Search Term: ', searchTerm);
  }
}
