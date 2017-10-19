import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReduxService } from '../../services/redux.service';
import { IRequirementsModel } from '../../models/models';


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequirementsComponent {

  requirements$ = this.dataService.state$.map(state => state.requirements
    .filter(req => req.qty > 0)
    .filter(req => (req.W === 26 && state.currentMaterial !== 'Ti-C') ? false : true)
  );
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
    this.dataService.updateRequirements({ W: requirement.W, lordosis: requirement.lordosis, qty: -requirement.qty });
  }

  constructor(
    public dataService: ReduxService,
  ) { }
}
