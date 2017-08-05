import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DataService } from '../services/data.service';
import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel } from '../models/requirements.model';


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguratorComponent implements OnInit {

  dataLordosis$: Observable<Array<ConfiguratorDataModel>>;
  dataL$: Observable<Array<ConfiguratorDataModel>>;
  private params$Subscription: Subscription;

  constructor(
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute) { }



  ngOnInit() {
    this.params$Subscription = this.route.params.subscribe(param => {
      if (param.material) {
        this.dataService.setCurrentMaterial(param.material);
        this.init(param.material);
      } else {
        this.router.navigate(['/configurator', 'PEEK']);
      }
    }); 
  }


  init(material: string) {
    let data$ = this.dataService.getConfiguratorData(material).toArray();

    this.dataLordosis$ = data$
      .map(a => {
        let _a = _.sortBy(a, 'lordosis');
        _a = _.sortedUniqBy(_a, 'lordosis');
        return _a;
      })

    this.dataL$ = data$
      .map(a => {
        let _a = _.sortBy(a, 'L');
        _a = _.sortedUniqBy(_a, 'L');
        return _a;
      })
  }


  ngOnDestroy() {
    this.params$Subscription.unsubscribe();
  }


  doReset() {
    this.dataService.reset();
  }


  getQtyAvail(material, L, lordosis): Observable<number> {
    return this.dataService.getConfiguratorData()
      .filter(e => e.material === material && e.L === L && e.lordosis === lordosis)
      .reduce((sum, e) => sum + e.qtyInSet, 0);
  }
}
