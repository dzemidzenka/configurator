import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { RequirementsModel } from '../../models/requirements.model';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {

  requirements$: Observable<Array<RequirementsModel>>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.requirements$ = this.dataService.getRequirements()
      .map(a => _.sortBy(a.filter(e => e.qty > 0), ['L', 'lordosis']));
  }
}
