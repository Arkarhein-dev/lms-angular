import { Component, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  imports: [NzInputModule, FormsModule],
  selector: 'app-search-box',
  styleUrl: './search-box.css',
  templateUrl: './search-box.html',
})
export class SearchBox {
  readonly inputValue = signal('');
  buttonName = input.required<string>();
  placeholderName = input.required<string>();

  searchSubmitted = output<string>();

  onSearch(event: any) {
    this.searchSubmitted.emit(this.inputValue());
    this.inputValue.set('');
  }
}
