import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DataService } from '../services/data.service';


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush          //auto complete does not play well with OnPush
})
export class ConfiguratorComponent implements OnInit {

  Lordosis$ = this.dataService.state$.map(state => state.lordosis);
  L$ = this.dataService.state$.map(state => state.L);
  currentMaterial$ = this.dataService.state$.map(state => state.currentMaterial);
  requirements$ = this.dataService.state$.map(state => state.requirements.length > 0 ? true : false);
  private params$Subscription: Subscription;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.params$Subscription = this.route.params.subscribe(param => {
      if (param.material) {
        this.dataService.setCurrentMaterial(param.material);
      } else {
        this.router.navigate(['/configurator', 'PEEK']);
      }
    });
  }


  ngOnDestroy() {
    this.params$Subscription.unsubscribe();
  }


  doReset() {
    this.dataService.reset();
  }


  getQtyAvail(material, L, lordosis): Observable<number> {
    return this.dataService.state$
      .map(state => state.raw
        .filter(e => e.material === material && e.L === L && e.lordosis === lordosis)
        .reduce((sum, e) => sum + e.qtyInSet, 0));
  }
}
