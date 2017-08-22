import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep, sortBy, sortedUniq, pick } from "lodash";

import { ACTION, IStateModel, IActionModel, IRequirementMessageModel, IAvailModel, ISetProposalModel } from '../models/models';


@Injectable()
export class DataService {

  constructor(
    @Inject('data') private _data,
    @Inject('defaultMaterial') private _defaultMaterial
  ) {
    this._initReducers();
    this._state$Subscription = this.state$.subscribe(state => console.debug('Redux state %o', state));
  }


  private _reducers: Array<Function> = [];
  private _requirementsMessageSubject$ = new Subject();
  private _resetSubject$ = new Subject();
  private _currentMaterialSubject$ = new Subject();

  private _data$: Observable<Array<IActionModel>> = Observable.of(this._data)
    .map(data => Object.assign({ op: ACTION.RAW, raw: data }))
    .publishBehavior({})
    .refCount();

  private _state$Subscription: Subscription;

  private _initialState: IStateModel = {
    actions: [],
    raw: [],
    materials: [],
    L: [],
    lordosis: [],
    currentMaterial: '',
    avail: [],
    requirements: [],
    setProposal: [],
  }

  state$: Observable<IStateModel> = this._requirementsMessageSubject$
    .merge(this._resetSubject$, this._data$, this._currentMaterialSubject$)
    .scan((state: IStateModel, action: IActionModel) => this._reducer(state, action), this._initialState)
    .publishBehavior({})
    .refCount() as Observable<IStateModel>;


  // private _routerEvent$ = this._router.events
  //   // .do(event => console.log(event))
  //   .filter(event => event instanceof ResolveEnd && event.state.root.firstChild.params.material)
  //   .map((event: ResolveEnd) => event.state.root.firstChild.params.material)
  //   .map(material => Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }))
  //   .do(material => this.reset());



// 
  private _reducer(state: IStateModel, action: IActionModel) {
    let _state = cloneDeep(state);
    if (action.op in ACTION) {
      this._reducers[action.op].call(this, _state, action);

 
      // switch (action.op) {
      //   case ACTION.RESET:
      //     _state.requirements.map(o => o.qty = 0);
      //     _state.setProposal = [];
      //     break;

      //   case ACTION.MATERIAL:
      //     _state.currentMaterial = action.currentMaterial;
      //     this.initRequirements(_state);
      //     this.initSetProposal(_state);
      //     break;

      //   case ACTION.REQUIREMENT:
      //     _state.requirements.map(o => o.animationActive = false);

      //     _state.requirements
      //       .filter(o => o.L === action.requirement.L && o.lordosis === action.requirement.lordosis)
      //       .map(o => {
      //         o.qty += action.requirement.qty
      //         if (o.qty < 0) {
      //           o.qty = 0;
      //         }

      //         if (!_state.avail.some(o => o.material === _state.currentMaterial && o.L === action.requirement.L && o.lordosis === action.requirement.lordosis)) {
      //           o.material = this._defaultMaterial;
      //           o.avail = false;
      //         }

      //         o.animationActive = true;
      //         return o;
      //       });

      //     this.initSetProposal(_state);
      //     break;

      //   case ACTION.RAW:
      //     // set raw data
      //     _state.raw = action.raw;

      //     // get unqiue materials          
      //     _state.materials = action.raw.map(o => o.material);
      //     let _a = _state.materials.sort();
      //     _state.materials = sortedUniq(_a);

      //     // set preferred material
      //     _state.currentMaterial = this._defaultMaterial;

      //     // get unique footprint and lordosis
      //     let _L = _state.raw.map(o => o.L);
      //     let __L = sortBy(_L);
      //     _state.L = sortedUniq(__L);

      //     let _lordosis = _state.raw.map(o => o.lordosis);
      //     let __lordosis = sortBy(_lordosis);
      //     _state.lordosis = sortedUniq(__lordosis);

      //     // get available 
      //     let _avail = _state.raw.map(data => pick(data, ['material', 'L', 'lordosis', 'partNumber', 'description'])) as Array<IAvailModel>;
      //     let _availSorted = sortBy(_avail, ['material', 'L', 'lordosis', 'partNumber', 'description']);
      //     _state.avail = sortedUniq(_availSorted);

      //     // get all possible requirements
      //     this.initRequirements(_state);
      //     break;
      // }

      _state.actions.unshift(action);
    }
    return _state;
  }


  // init state reducers
  private _initReducers() {
    this._reducers[ACTION.RESET] = (state: IStateModel, action: IActionModel) => {
      state.requirements.map(o => o.qty = 0);
      state.setProposal = [];
    }


    this._reducers[ACTION.MATERIAL] = (state: IStateModel, action: IActionModel) => {
      state.currentMaterial = action.currentMaterial;
      this._initRequirements(state);
      this._initSetProposal(state);
    }


    this._reducers[ACTION.REQUIREMENT] = (state: IStateModel, action: IActionModel) => {
      state.requirements.map(o => o.animationActive = false);

      state.requirements
        .filter(o => o.L === action.requirement.L && o.lordosis === action.requirement.lordosis)
        .map(o => {
          o.qty += action.requirement.qty
          if (o.qty < 0) {
            o.qty = 0;
          }

          if (!state.avail.some(o => o.material === state.currentMaterial && o.L === action.requirement.L && o.lordosis === action.requirement.lordosis)) {
            o.material = this._defaultMaterial;
            o.avail = false;
          }

          o.animationActive = true;
          return o;
        });
      this._initSetProposal(state);
    }


    this._reducers[ACTION.RAW] = (state: IStateModel, action: IActionModel) => {
      // set raw data
      state.raw = action.raw;

      // get unqiue materials          
      state.materials = action.raw.map(o => o.material);
      let _a = state.materials.sort();
      state.materials = sortedUniq(_a);

      // set preferred material
      state.currentMaterial = this._defaultMaterial;

      // get unique footprint and lordosis
      let _L = state.raw.map(o => o.L);
      let __L = sortBy(_L);
      state.L = sortedUniq(__L);

      let _lordosis = state.raw.map(o => o.lordosis);
      let __lordosis = sortBy(_lordosis);
      state.lordosis = sortedUniq(__lordosis);

      // get available 
      let _avail = state.raw.map(data => pick(data, ['material', 'L', 'lordosis', 'partNumber', 'description'])) as Array<IAvailModel>;
      let _availSorted = sortBy(_avail, ['material', 'L', 'lordosis', 'partNumber', 'description']);
      state.avail = sortedUniq(_availSorted);

      // get all possible requirements
      this._initRequirements(state);
    }
  }


  // 
  private _initRequirements(state: IStateModel) {
    let _state = cloneDeep(state);
    let _index = 0;

    state.requirements = [];
    for (let L of state.L) {
      for (let lordosis of state.lordosis) {
        state.requirements[_index] =
          Object.assign(
            {
              L: L,
              lordosis: lordosis,
              material: _state.avail.some(o => o.material === _state.currentMaterial && o.L === L && o.lordosis === lordosis) ? state.currentMaterial : this._defaultMaterial,
              partNumber: '',
              description: '',
              avail: state.avail.some(o => o.material === state.currentMaterial && o.L === L && o.lordosis === lordosis),
              availMaterials: sortedUniq(state.avail.filter(o => o.L === L && o.lordosis === lordosis).map(avail => avail.material)),
              qty: _state.requirements[_index] ? _state.requirements[_index].qty : 0,
              excluded: lordosis === 15 && ( L === 18 || L === 26 )
            }
          );

        let _avail = state.avail.filter(avail => avail.material === state.requirements[_index].material && avail.L === state.requirements[_index].L && avail.lordosis === state.requirements[_index].lordosis)[0];
        if (_avail) {
          state.requirements[_index].partNumber = _avail.partNumber;
          state.requirements[_index].description = _avail.description;
        }
        _index++;
      }
    }
  }


  // 
  private _initSetProposal(state: IStateModel) {
    state.setProposal = [];

    state.requirements
      .filter(r => r.qty > 0)
      .forEach((r, i) => state.setProposal[i] = Object.assign(
        { qty: r.qty }, { animationActive: r.animationActive }, pick(state.raw.find(raw => r.L === raw.L && r.lordosis === raw.lordosis && r.material === raw.material), ['setType', 'qtyInSet']) as ISetProposalModel
      ))

    state.setProposal.map(set => set.qty = Math.ceil(set.qty / set.qtyInSet));
  }


  // 
  setCurrentMaterial(material: string) {
    this._currentMaterialSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }));
  }


  // 
  reset() {
    this._resetSubject$.next(Object.assign({ op: ACTION.RESET }));
  }
 

  // 
  updateRequirements(requirement: IRequirementMessageModel) {
    this._requirementsMessageSubject$.next(Object.assign({ op: ACTION.REQUIREMENT, requirement: requirement }));
  }
}