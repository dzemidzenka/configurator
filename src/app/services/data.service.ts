import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel } from '../models/requirements.model';
import { StateModel } from '../models/state.model';
import { ActionModel, ACTION } from '../models/action.model';
import { data } from '../app.data';


@Injectable()
export class DataService {

  private requirementsSubject$ = new Subject();
  private resetSubject$ = new Subject();
  private currentMaterialSubject$ = new Subject();

  private data$: Observable<Array<ActionModel>> = Observable.of(data)
    .map(data => Object.assign({ op: ACTION.RAW, raw: data }))
    .publishBehavior({})
    .refCount();

  state$: Observable<StateModel> = this.requirementsSubject$
    .merge(this.resetSubject$, this.data$, this.currentMaterialSubject$)
    .scan((state: StateModel, action: ActionModel) => {
      switch (action.op) {
        case ACTION.RESET:
          state.requirements = [];
          break;

        case ACTION.MATERIAL:
          state.currentMaterial = action.currentMaterial;

          let _L = state.raw
            .filter(o => o.material === action.currentMaterial)
            .map(o => o.L).sort();
          state.L = _.sortedUniq(_L);

          let _lordosis = state.raw
            .filter(o => o.material === action.currentMaterial)
            .map(o => o.lordosis).sort();
          state.lordosis = _.sortedUniq(_lordosis);
          break;

        case ACTION.REQUIREMENT:
          let index = state.requirements.findIndex(o => o.L === action.requirement.L && o.lordosis === action.requirement.lordosis);
          let _array = [];
          if (index === -1) {
            _array = state.requirements.concat(action.requirement);
          } else {
            _array = state.requirements;
            let newQty = _array[index].qty + action.requirement.qty;
            if (newQty <= _array[index].qtyAvail) {
              _array[index].qty = newQty;
            }
          }
          state.requirements = _.sortBy(_array.filter(requirement => requirement.qty > 0), 'lordosis');
          break;

        case ACTION.RAW:
          state.raw = action.raw;
          state.materials = action.raw.map(o => o.material);
          let _a = state.materials.sort();
          state.materials = _.sortedUniq(_a);
          break;
      }

      if (!state.requirements) {
        state.requirements = [];
      }
      return state;
    }, {})
    .publishBehavior({})
    .refCount() as Observable<StateModel>;




  constructor() {
    this.state$.subscribe(state => console.log('STATE', state));
  }


  setCurrentMaterial(material: string) {
    this.currentMaterialSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }));
    this.reset();
  }


  reset() {
    this.resetSubject$.next({ op: ACTION.RESET });
  }


  updateRequirements(requirement: RequirementsModel) {
    this.requirementsSubject$.next(Object.assign({ op: ACTION.REQUIREMENT, requirement: requirement }));
  }
}
