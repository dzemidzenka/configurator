import { Component, ChangeDetectionStrategy } from '@angular/core';
// import { trigger, state, style, transition, animate } from "@angular/animations";

import { DataService } from '../../services/data.service';
import { IRequirementsModel } from '../../models/models';


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // animations: [
  //   trigger('signal', [
  //     state('void', style({
  //       'color': 'red',
  //       'opacity': '0',
  //     })),
  //     transition('* => active', animate('500ms')),
  //   ])
  // ],
})
export class RequirementsComponent {

  requirements$ = this.dataService.state$.map(state => state.requirements.filter(requirement => requirement.qty > 0));
  compress$ = this.dataService.state$.map(state => state.compress);

  clipboardContent$ = this.requirements$.map(reqs => {
    let cb = '';
    for (const req of reqs) {
      cb += `${req.setType} \t ${req.numberOfSets} \r\n`;
      if (req.setTypeAdd) {
        cb += `${req.setTypeAdd} \t 1 \r\n`;
      }
    }
    return cb;
  });


  onCompressExpand() {
    this.dataService.updateCompress();
  }

  onDelete(requirement: IRequirementsModel) {
    this.dataService.updateRequirements({ L: requirement.L, lordosis: requirement.lordosis, qty: -requirement.qty });
  }

  constructor(
    public dataService: DataService,
  ) { }
}
