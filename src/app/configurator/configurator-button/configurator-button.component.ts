import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ReduxService } from '../../services/redux.service';
import { IRequirementsModel } from '../../models/models';


@Component({
  selector: 'app-configurator-button',
  templateUrl: './configurator-button.component.html',
  styleUrls: ['./configurator-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorButtonComponent {

  @Input() context: IRequirementsModel;


  constructor(private dataService: ReduxService) { }


  up() {
    this.dataService.updateRequirements({ W: this.context.W, lordosis: this.context.lordosis, qty: 1 });
  }


  down() {
    this.dataService.updateRequirements({ W: this.context.W, lordosis: this.context.lordosis, qty: -1 });
  }
}
