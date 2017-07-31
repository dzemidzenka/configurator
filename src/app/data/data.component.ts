import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ConfiguratorDataModel } from '../data/data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  data$: Observable<Array<ConfiguratorDataModel>>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.data$ = this.dataService.getConfiguratorData().toArray();    
  }

}
