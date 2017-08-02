import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel } from '../models/requirements.model';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
})
export class ConfiguratorComponent implements OnInit, OnDestroy {

  dataLordosis$: Observable<Array<ConfiguratorDataModel>>;
  dataL$: Observable<Array<ConfiguratorDataModel>>;
  qtyChanges: Array<RequirementsModel> = [];
  data$Subscription: Subscription;

  constructor(
    private dataService: DataService
  ) { }



  ngOnInit() {
    this.data$Subscription = this.dataService.materialSelected$.subscribe(material => {
      this.init(JSON.stringify(material))
    });
    this.init();
  }


  init(material?: string) {
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
    this.data$Subscription.unsubscribe();
  }

  doReset() {
    this.dataService.reset();
  }


  getQtyAvail(material, L, lordosis): Observable<number> {
    return this.dataService.getConfiguratorData()
      .filter(e => e.material === material && e.L === L && e.lordosis === lordosis)
      .reduce((sum, e) => sum + e.qtyInSet, 0);
  }


  qtyChanged(qty, L, lordosis) {
    _.remove(this.qtyChanges, e => e.L === L && e.lordosis === lordosis || e.qty === 0);
    this.qtyChanges.push({ L: L, lordosis: lordosis, qty: qty });
    this.dataService.updateRequirements(this.qtyChanges);
    _.remove(this.qtyChanges, e => e.qty === 0);
  }

}
