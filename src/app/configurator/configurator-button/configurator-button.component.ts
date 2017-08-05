import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { RequirementsModel } from '../../models/requirements.model';


@Component({
  selector: 'app-configurator-button',
  templateUrl: './configurator-button.component.html',
  styleUrls: ['./configurator-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguratorButtonComponent implements OnInit {

  @Input() qtyAvail: number = 0;
  @Input() L: number = 0;
  @Input() lordosis: number = 0;

  // @Output() qtyChanged = new EventEmitter<RequirementsModel>();



  qty$: Observable<number> = this.dataService.state$
    .map(state => state.requirements)
    .startWith([{ L: this.L, lordosis: this.lordosis, qty: 0, qtyAvail: this.qtyAvail }])
    .scan((qty: number, requirements: Array<RequirementsModel>) => {
        return requirements
          .filter(requirement => requirement.L === this.L && requirement.lordosis === this.lordosis)
          .reduce((qty: number, requirement: RequirementsModel) => requirement.qty, 0);
    }, 0);


  constructor(private dataService: DataService) { }

  ngOnInit() { }


  up() {
    this.dataService.updateRequirements({ L: this.L, lordosis: this.lordosis, qty: 1, qtyAvail: this.qtyAvail });
    // this.qtyChanged.emit({ L: this.L, lordosis: this.lordosis, qty: 1, qtyAvail: this.qtyAvail });
  }


  down() {
    this.dataService.updateRequirements({ L: this.L, lordosis: this.lordosis, qty: -1, qtyAvail: this.qtyAvail });
    // this.qtyChanged.emit({ L: this.L, lordosis: this.lordosis, qty: -1, qtyAvail: this.qtyAvail });
  }

  // max(qty: number) {
  //   this.dataService.updateRequirements({ L: this.L, lordosis: this.lordosis, qty: qty });
  // }
}
