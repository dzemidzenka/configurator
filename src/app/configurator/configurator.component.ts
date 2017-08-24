import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../services/data.service';
import { IRequirementsModel } from '../models/models';


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguratorComponent implements OnInit, OnDestroy {

  Lordosis$ = this._dataService.state$.map(state => state.lordosis);
  L$ = this._dataService.state$.map(state => state.L);
  currentMaterial$ = this._dataService.state$.map(state => state.currentMaterial);
  requirements$ = this._dataService.state$.map(state => state.requirements.filter(r => r.excluded === false));  
  requirementsChosen$ = this.requirements$.map(requirements => requirements.filter(o => o.qty > 0).length > 0 ? true : false);
  // requirementsChosen$ = this._dataService.state$.map(state => state.requirements.filter(o => o.qty > 0).length > 0 ? true : false);
  private _params$Subscription: Subscription;

  constructor(
    @Inject('defaultMaterial') private _defaultMaterial,
    private _dataService: DataService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }


  ngOnInit() {
    this._params$Subscription = this._route.params.subscribe(param => {
      if (param.material) {
        this._dataService.setCurrentMaterial(param.material);
      } else {
        this._router.navigate(['/configurator', this._defaultMaterial]);
      }
    });
  }


  ngOnDestroy() {
    this._params$Subscription.unsubscribe();
  }


  doReset() {
    this._dataService.reset();
  }


  getContext(L, lordosis): Observable<IRequirementsModel> {
    return this._dataService.state$.map(state => state.requirements.filter(o => o.L === L && o.lordosis === lordosis)[0]);
  }
}
