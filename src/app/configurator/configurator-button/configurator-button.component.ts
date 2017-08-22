import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from '../../services/data.service';
import { IRequirementsModel } from '../../models/models';


@Component({
  selector: 'app-configurator-button',
  templateUrl: './configurator-button.component.html',
  styleUrls: ['./configurator-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorButtonComponent {

  @Input() context: IRequirementsModel;


  constructor(private dataService: DataService) { }


  up() {
    this.dataService.updateRequirements({ L: this.context.L, lordosis: this.context.lordosis, qty: 1 });
  }


  down() {
    this.dataService.updateRequirements({ L: this.context.L, lordosis: this.context.lordosis, qty: -1 });
  }
}
