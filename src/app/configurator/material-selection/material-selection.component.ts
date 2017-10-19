import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ReduxService } from '../../services/redux.service';


@Component({
  selector: 'app-material-selection',
  templateUrl: './material-selection.component.html',
  styleUrls: ['./material-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialSelectionComponent {

  materials$ = this.dataService.state$.map(state => state.materials);
  currentMaterial$ = this.dataService.state$.map(state => state.currentMaterial);
  consigned$ = this.dataService.state$.map(state => state.consignedPresent);

  constructor(
    private dataService: ReduxService,
  ) { }


  onSelect(material: string) {
    this.dataService.updateCurrentMaterial(material);
  }

  onClick() {
    this.dataService.updateConsignedPresent();
  }
}
