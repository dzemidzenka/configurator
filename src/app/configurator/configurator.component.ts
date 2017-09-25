import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../services/data.service';
import { IRequirementsModel } from '../models/models';


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguratorComponent {

  Lordosis$ = this._dataService.state$.map(state => state.lordosis);
  L$ = this._dataService.state$.map(state => state.L);
  currentMaterial$ = this._dataService.state$.map(state => state.currentMaterial);
  requirements$ = this._dataService.state$.map(state => state.requirements.filter(r => r.excluded === false));
  requirementsChosen$ = this.requirements$.map(requirements => requirements.filter(o => o.qty > 0).length > 0 ? true : false);


  constructor(
    private _dataService: DataService,
  ) { }

  doReset() {
    this._dataService.reset();
  }

  trackByFn(index, item) {
    return item.id;
  }

  getContext(L, lordosis): Observable<IRequirementsModel> {
    return this._dataService.state$.map(state => state.requirements.filter(o => o.L === L && o.lordosis === lordosis)[0]);
  }
}
