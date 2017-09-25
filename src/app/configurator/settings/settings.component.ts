import { Component, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  rememberSelections$ = this.dataService.state$.map(state => state.rememberSelections);

  constructor(
    private dataService: DataService,
  ) { }

  onClick() {
    this.dataService.updateRememberSelections();
  }
}
