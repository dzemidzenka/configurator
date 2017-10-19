import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ReduxService } from '../../services/redux.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  rememberSelections$ = this.dataService.state$.map(state => state.rememberSelections);

  constructor(
    private dataService: ReduxService,
  ) { }

  onClick() {
    this.dataService.updateRememberSelections();
  }
}
