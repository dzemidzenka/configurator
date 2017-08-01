import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-material-selection',
  templateUrl: './material-selection.component.html',
  styleUrls: ['./material-selection.component.scss']
})
export class MaterialSelectionComponent implements OnInit {

  materials$: Observable<Array<string>>;
  results: Array<string>;
  private resultsAll: Array<string>;
  selectedMaterial: string;


  handleDropdownClick(e) {
    setTimeout(() => {
      this.results = new Array(...this.resultsAll);
    }, 0)
  }
  filterMaterials(query) {
    this.results = this.resultsAll.filter(e => e.toLowerCase().includes(query.toLowerCase()));
    this.dataService.setCurrentMaterial(this.results[0]);
  }
  onSelect(material: string) {
    this.dataService.setCurrentMaterial(material);
  }


  constructor(
    private dataService: DataService,
  ) { }


  ngOnInit() {
    this.materials$ = this.dataService.getConfiguratorData()
      .map(o => o.material)
      .toArray()
      .map(a => {
        let _a = a.sort();
        _a = _.sortedUniq(_a);
        return _a;
      })
      .do(a => this.resultsAll = a);
  }

  select(material) {
    this.dataService.setCurrentMaterial(material);
  }
}
