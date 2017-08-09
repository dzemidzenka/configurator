import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequirementsComponent implements OnInit {

  requirements$ = this.dataService.state$.map(state => state.requirements);

  constructor(public dataService: DataService) { }

  ngOnInit() { }
}
