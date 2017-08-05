import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel, ACTION } from '../models/requirements.model';
import { data } from '../app.data';


@Injectable()
export class DataService {

  private currentMaterial: string;
  private data$: Observable<ConfiguratorDataModel> = Observable.from(data).share();
  private requirementsSubject$ = new Subject();
  private resetSubject$ = new Subject();


  main$: Observable<Array<RequirementsModel>> = this.requirementsSubject$
    .merge(this.resetSubject$)
    .scan((requirements: Array<RequirementsModel>, newRequirement: RequirementsModel) => {
      if (newRequirement.op === ACTION.RESET) {
        return [];
      }

      let index = requirements.findIndex(o => o.L === newRequirement.L && o.lordosis === newRequirement.lordosis);
      let _array = [];
      if (index === -1) {
        _array = requirements.concat(newRequirement);
      } else {
        _array = requirements;
        let newQty = _array[index].qty + newRequirement.qty;
        if (newQty <= _array[index].qtyAvail) {
          _array[index].qty = newQty;
        } 
      }
      return _.sortBy(_array.filter(requirement => requirement.qty > 0), 'lordosis');
    }, [])
    .share() as Observable<Array<RequirementsModel>>;



  constructor() { }


  setCurrentMaterial(material: string) {
    if (this.currentMaterial !== material) {
      this.currentMaterial = material.toUpperCase();
      this.reset();
    }
  }


  reset() {
    this.resetSubject$.next({ op: ACTION.RESET });
  }


  getConfiguratorData(material?: string): Observable<ConfiguratorDataModel> {
    if (arguments.length === 0) {
      return this.data$;
    }
    return this.data$.filter(e => e.material === this.currentMaterial);
  }


  updateRequirements(requirement: RequirementsModel) {
    this.requirementsSubject$.next(requirement);
  }
}
