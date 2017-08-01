import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ConfiguratorDataModel } from '../models/data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  data$: Observable<Array<ConfiguratorDataModel>>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.data$ = this.dataService.getConfiguratorData().toArray();    
  }

}
