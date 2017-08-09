import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../services/data.service';


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush          //auto complete does not play well with OnPush
})
export class ConfiguratorComponent implements OnInit {

  // Lordosis$ = this._dataService.state$.map(state => state.lordosis);
  // L$ = this._dataService.state$.map(state => state.L);
  // currentMaterial$ = this._dataService.state$.map(state => state.currentMaterial);
  
  Lordosis$ = this._dataService.state$.pluck('lordosis');
  L$ = this._dataService.state$.pluck('L');
  currentMaterial$ = this._dataService.state$.pluck('currentMaterial');
  
  requirements$ = this._dataService.state$.map(state => state.requirements.length > 0 ? true : false);
  private _params$Subscription: Subscription;

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }


  ngOnInit() {
    this._params$Subscription = this._route.params.subscribe(param => {
      if (param.material) {
        this._dataService.setCurrentMaterial(param.material);
      } else {
        this._router.navigate(['/configurator', 'PEEK']);
      }
    });
  }


  ngOnDestroy() {
    this._params$Subscription.unsubscribe();
  }


  doReset() {
    this._dataService.reset();
  }


  getQtyAvail(material, L, lordosis): Observable<number> {
    return this._dataService.state$
      .map(state => state.raw
        .filter(e => e.material === material && e.L === L && e.lordosis === lordosis)
        .reduce((sum, e) => sum + e.qtyInSet, 0));
  }
}
