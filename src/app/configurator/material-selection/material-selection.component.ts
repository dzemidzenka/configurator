import { Component, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-material-selection',
  templateUrl: './material-selection.component.html',
  styleUrls: ['./material-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialSelectionComponent {

  materials$ = this.dataService.state$.map(state => state.materials);
  consigned$ = this.dataService.state$.map(state => state.consignedPresent);

  constructor(
    private dataService: DataService,
  ) { }


  onSelect(material: string) {
    this.dataService.updateCurrentMaterial(material);
  }

  onClick() {
    this.dataService.updateConsignedPresent();
  }
}
