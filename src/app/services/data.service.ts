import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { sortBy } from 'lodash';
import cloneDeep from 'lodash/fp/cloneDeep';
import sortedUniq from 'lodash/fp/sortedUniq';
import pick from 'lodash/fp/pick';

import { ACTION, IStateModel, IActionModel, IRequirementMessageModel, IAvailModel, ISetProposalModel } from '../models/models';


@Injectable()
export class DataService {

  constructor(
    @Inject('data') private _data,
    @Inject('defaultMaterial') private _defaultMaterial
  ) {
    this._initReducers();
    this._state$Subscription = this.state$.subscribe(state => console.log('Redux state %o', state));
  }


  private _reducers: Array<Function> = [];
  private _actionSubject$ = new Subject<IActionModel>();
  private _state$Subscription: Subscription;

  private _initialState: IStateModel = {
    actions: [
      // {
      //   op: ACTION.REQUIREMENT,
      //   requirement: {
      //     L: 22,
      //     lordosis: 10,
      //     qty: 5,
      //     material: '',
      //     partNumber: '',
      //     description: '',
      //     avail: true,
      //     availMaterials: [],
      //     animationActive: false,
      //     excluded: false,
      //     setType: '',
      //     setTypeAdd: '',
      //     qtyInSet: 0,
      //     numberOfSets: 0
      //   }
      // }
    ],
    raw: [],
    materials: [],
    L: [],
    lordosis: [],
    currentMaterial: '',
    consignedPresent: false,
    avail: [],
    requirements: [
      {
        L: 22,
        lordosis: 10,
        qty: 5,
        material: '',
        partNumber: '',
        description: '',
        avail: true,
        availMaterials: [],
        animationActive: false,
        excluded: false,
        setType: '',
        setTypeAdd: '',
        qtyInSet: 0,
        numberOfSets: 0
      }
    ],
    setProposal: [],
  };

  state$: Observable<IStateModel> = this._actionSubject$
    .startWith(Object.assign({ op: ACTION.RAW, raw: this._data }))
    .scan((state: IStateModel, action: IActionModel) => this._reducer(state, action), this._initialState)
    .publishBehavior({})
    .refCount() as Observable<IStateModel>;


  // private _routerEvent$ = this._router.events
  //   // .do(event => console.log(event))
  //   .filter(event => event instanceof ResolveEnd && event.state.root.firstChild.params.material)
  //   .map((event: ResolveEnd) => event.state.root.firstChild.params.material)
  //   .map(material => Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }))
  //   .do(material => this.reset());




  private _reducer(state: IStateModel, action: IActionModel) {
    const _state = cloneDeep(state);
    if (action.op in ACTION) {
      this._reducers[action.op].call(this, _state, action);
      _state.actions.unshift(action);
    }
    return _state;
  }


  private _initReducers() {
    this._reducers[ACTION.RESET] = (state: IStateModel, action: IActionModel) => {
      state.requirements.map(o => o.qty = 0);
      state.setProposal = [];
    };


    this._reducers[ACTION.MATERIAL] = (state: IStateModel, action: IActionModel) => {
      state.currentMaterial = action.currentMaterial;
      this._initRequirements(state);
      this._initSetProposal(state);
    };


    this._reducers[ACTION.CONSIGNED] = (state: IStateModel, action: IActionModel) => {
      state.consignedPresent = !state.consignedPresent;
      this._initRequirements(state);
      this._initSetProposal(state);
    };


    this._reducers[ACTION.REQUIREMENT] = (state: IStateModel, action: IActionModel) => {
      state.requirements.map(o => o.animationActive = false);

      state.requirements
        .filter(o => o.L === action.requirement.L && o.lordosis === action.requirement.lordosis)
        .map(o => {
          o.qty += action.requirement.qty;
          if (o.qty < 0) {
            o.qty = 0;
          }

          if (!state.avail.some(
            o => o.material === state.currentMaterial && o.L === action.requirement.L && o.lordosis === action.requirement.lordosis
          )) {
            o.material = this._defaultMaterial;
            o.avail = false;
          }

          o.animationActive = true;
          return o;
        });
      this._initSetProposal(state);
    };


    this._reducers[ACTION.RAW] = (state: IStateModel, action: IActionModel) => {
      state.raw = action.raw;
      state.materials = sortedUniq(sortBy(action.raw.map(o => o.material)));
      state.currentMaterial = this._defaultMaterial;
      state.L = sortedUniq(sortBy(state.raw.map(o => o.L)));
      state.lordosis = sortedUniq(sortBy(state.raw.map(o => o.lordosis)));

      const _avail = state.raw.map(data => pick(['material', 'L', 'lordosis', 'partNumber', 'description'], data)) as Array<IAvailModel>;
      state.avail = sortedUniq(sortBy(_avail, ['material', 'L', 'lordosis', 'partNumber', 'description']));

      this._initRequirements(state);
    };
  }



  private _initRequirements(state: IStateModel) {
    const _requirements = cloneDeep(state.requirements);
    let _index = 0;

    state.requirements = [];
    for (const L of state.L) {
      for (const lordosis of state.lordosis) {
        state.requirements[_index] =
          Object.assign(
            {
              L: L,
              lordosis: lordosis,
              material: state.avail.some(o => o.material === state.currentMaterial && o.L === L && o.lordosis === lordosis) ?
                state.currentMaterial : this._defaultMaterial,
              partNumber: '',
              description: '',
              avail: state.avail.some(o => o.material === state.currentMaterial && o.L === L && o.lordosis === lordosis),
              availMaterials: sortedUniq(state.avail.filter(o => o.L === L && o.lordosis === lordosis).map(avail => avail.material)),
              qty: _requirements[_index] ? _requirements[_index].qty : 0,
              excluded: lordosis === 15 && (L === 18 || L === 26)
            }
          );

        const _avail = state.avail.find(
          avail =>
            avail.material === state.requirements[_index].material &&
            avail.L === state.requirements[_index].L &&
            avail.lordosis === state.requirements[_index].lordosis
        );
        if (_avail) {
          state.requirements[_index].partNumber = _avail.partNumber;
          state.requirements[_index].description = _avail.description;
        }
        _index++;
      }
    }
  }


  private _initSetProposal(state: IStateModel) {
    state.requirements
      .filter(r => r.qty > 0)
      .map(r => {
        const raw = state.raw.find(raw => r.L === raw.L && r.lordosis === raw.lordosis && r.material === raw.material);
        r.setType = raw.setType;
        r.qtyInSet = raw.qtyInSet;
        r.numberOfSets = Math.ceil(r.qty / r.qtyInSet);

        if (state.consignedPresent === false) {
          switch (r.L) {
            case 18:
              r.setTypeAdd = 'CORXLINS';
              break;
            case 22:
              r.setTypeAdd = 'CORXLWINS';
              break;
            case 26:
              if (state.currentMaterial === 'TIC') {
                r.setTypeAdd = 'CORXLXW';
              }
              break;
          }
        }
      });
  }

  reset() {
    this._actionSubject$.next(Object.assign({ op: ACTION.RESET }));
  }

  updateCurrentMaterial(material: string) {
    this._actionSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }));
  }

  updateRequirements(requirement: IRequirementMessageModel) {
    this._actionSubject$.next(Object.assign({ op: ACTION.REQUIREMENT, requirement: requirement }));
  }

  updateConsignedPresent() {
    this._actionSubject$.next(Object.assign({ op: ACTION.CONSIGNED }));
  }
}
