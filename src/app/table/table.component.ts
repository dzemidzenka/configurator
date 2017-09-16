import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {

  data$ = this.dataService.state$.map(state => state.raw);

  constructor(private dataService: DataService) { }

  ngOnInit() { }
}
