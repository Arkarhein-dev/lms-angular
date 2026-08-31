import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  imports: [NzStatisticModule, NzGridModule, NzCardModule, NzIconModule],
  selector: 'app-booking-summary',
  styleUrl: './booking-summary.css',
  templateUrl: './booking-summary.html',
})
export class BookingSummary {}
