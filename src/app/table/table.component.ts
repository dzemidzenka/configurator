import { Component, ViewEncapsulation } from '@angular/core';
import { ReduxService } from '../services/redux.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  constructor(private dataService: ReduxService) {}

  data$ = this.dataService.state$.map(state => state.raw);
}
