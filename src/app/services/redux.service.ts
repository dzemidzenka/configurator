import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ACTION, IStateModel, IActionModel, IConfiguratorDataModel, ISetContentModel, IRequirementMessageModel } from '../models/models';
import { DEFAULT_MATERIAL_PROVIDER, DATA_PROVIDER, SET_CONTENT_PROVIDER, LOCAL_STORAGE_NAME_PROVIDER } from './providers';

import sortBy from 'lodash-es/sortBy';
import sortedUniq from 'lodash-es/sortedUniq';
import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';

@Injectable()
export class ReduxService {
    constructor(
        @Inject(DEFAULT_MATERIAL_PROVIDER) private _defaultMaterial: string,
        @Inject(DATA_PROVIDER) private _data: Array<IConfiguratorDataModel>,
        @Inject(SET_CONTENT_PROVIDER) private _setContent: Array<ISetContentModel>,
        @Inject(LOCAL_STORAGE_NAME_PROVIDER) private _localStorageName: string
    ) {
        this._initReducers();

        this.state$.subscribe(state => {
            console.log('Redux state', state);
            if (this._localStorageName) {
                const _state = cloneDeep(state);
                _state.actions = [];
                _state.raw = [];
                _state.setContent = [];
                _state.materials = [];
                _state.W = [];
                _state.lordosis = [];
                localStorage.setItem(this._localStorageName, JSON.stringify(_state));
            }
        });
    }

    private _reducers: Array<Function> = [];
    private _actionSubject$ = new Subject<IActionModel>();

    private _initialState: IStateModel = function() {
        let state: IStateModel;
        let rememberSelections = true;

        if (this._localStorageName) {
            state = JSON.parse(localStorage.getItem(this._localStorageName));
            if (!isEmpty(state)) {
                rememberSelections = state.rememberSelections;
                if (rememberSelections === false) {
                    state = null;
                }
            }
        }
        if (isEmpty(state)) {
            state = {
                actions: [],
                raw: [],
                setContent: [],
                materials: [],
                W: [],
                lordosis: [],
                currentMaterial: this._defaultMaterial,
                consignedPresent: false,
                requirements: [],
                rememberSelections: rememberSelections,
                compress: false
            };
        } else {
            state.raw = this._data;
        }
        return state;
    }.bind(this)();

    state$: Observable<IStateModel> = this._actionSubject$
        .startWith(
            Object.assign({
                op: ACTION.RAW,
                raw: this._data,
                setContent: this._setContent
            })
        )
        .scan((state: IStateModel, action: IActionModel) => this._reducer(state, action), this._initialState)
        .publishBehavior({})
        .refCount() as Observable<IStateModel>;

    private _reducer(state: IStateModel, action: IActionModel) {
        const _state = cloneDeep(state);
        if (action.op in ACTION) {
            _state.requirements.map(o => (o.animationActive = false));
            this._reducers[action.op].call(this, _state, action);
            _state.actions.unshift(action);
        }
        return _state;
    }

    private _initReducers() {
        this._reducers[ACTION.RESET] = (state: IStateModel, action: IActionModel) => {
            state.requirements.map(o => (o.qty = 0));
        };

        this._reducers[ACTION.REMEMBER] = (state: IStateModel, action: IActionModel) => {
            state.rememberSelections = !state.rememberSelections;
        };

        this._reducers[ACTION.COMPRESS] = (state: IStateModel, action: IActionModel) => {
            state.compress = !state.compress;
        };

        this._reducers[ACTION.MATERIAL] = (state: IStateModel, action: IActionModel) => {
            state.currentMaterial = action.currentMaterial;
            state.requirements.map(requirement => {
                requirement.avail = requirement.availMaterials.includes(state.currentMaterial);
                requirement.material = requirement.avail ? state.currentMaterial : this._defaultMaterial;
                return requirement;
            });
            this._initSetProposal(state);
        };

        this._reducers[ACTION.CONSIGNED] = (state: IStateModel, action: IActionModel) => {
            state.consignedPresent = !state.consignedPresent;
            this._initSetProposal(state);
        };

        this._reducers[ACTION.REQUIREMENT] = (state: IStateModel, action: IActionModel) => {
            state.requirements
                .filter(requirement => requirement.W === action.requirement.W && requirement.lordosis === action.requirement.lordosis)
                .map(requirement => {
                    requirement.qty += action.requirement.qty;
                    if (requirement.qty < 0) {
                        requirement.qty = 0;
                    }

                    requirement.avail = requirement.availMaterials.includes(state.currentMaterial);
                    if (!requirement.avail) {
                        requirement.material = this._defaultMaterial;
                    }

                    requirement.animationActive = true;
                    return requirement;
                });
            this._initSetProposal(state);
        };

        this._reducers[ACTION.RAW] = (state: IStateModel, action: IActionModel) => {
            state.raw = action.raw;
            state.setContent = action.setContent;
            state.materials = sortedUniq(sortBy(action.raw.map(o => o.material)));
            state.W = sortedUniq(sortBy(action.raw.map(o => o.W)));
            state.lordosis = sortedUniq(sortBy(action.raw.map(o => o.lordosis)));
            this._initRequirements(state);
            this._initSetProposal(state);
        };
    }

    private _initRequirements(state: IStateModel) {
        const _requirements = cloneDeep(state.requirements);
        let _index = 0;

        state.requirements = [];
        for (const W of state.W) {
            for (const lordosis of state.lordosis) {
                const availMaterials = sortedUniq(
                    sortBy(state.raw.filter(raw => raw.W === W && raw.lordosis === lordosis).map(raw => raw.material))
                );
                const avail = availMaterials.includes(state.currentMaterial);

                state.requirements[_index] = Object.assign({
                    id: _index,
                    W: W,
                    lordosis: lordosis,
                    partNumber: '',
                    description: '',
                    material: avail ? state.currentMaterial : this._defaultMaterial,
                    avail: avail,
                    availMaterials: availMaterials,
                    qty: _requirements[_index] ? _requirements[_index].qty : 0
                    // excluded: lordosis === 15 && (W === 18 || W === 26)
                });
                _index++;
            }
        }
    }

    private _initSetProposal(state: IStateModel) {
        state.requirements.filter(requirement => requirement.qty > 0).map(requirement => {
            const rawData = state.raw.find(
                raw => raw.W === requirement.W && raw.lordosis === requirement.lordosis && raw.material === requirement.material
            );
            if (rawData) {
                requirement.setType = rawData.setType;
                requirement.qtyInSet = rawData.qtyInSet;
                requirement.numberOfSets = Math.ceil(requirement.qty / requirement.qtyInSet);

                requirement.setTypeAdd = '';
                if (!state.consignedPresent) {
                    switch (requirement.W) {
                        case 18:
                            requirement.setTypeAdd = 'CORXLINS';
                            break;
                        case 22:
                            requirement.setTypeAdd = 'CORXLWINS';
                            break;
                        case 26:
                            if (state.currentMaterial === 'Ti-C') {
                                requirement.setTypeAdd = 'CORXLXW';
                            }
                            break;
                    }
                }

                if (requirement.setType) {
                    requirement.setContent = state.setContent.filter(
                        content => content.setType.toUpperCase() === requirement.setType.toUpperCase()
                    );
                }
                if (requirement.setTypeAdd) {
                    requirement.setContentAdd = state.setContent.filter(
                        content => content.setType.toUpperCase() === requirement.setTypeAdd.toUpperCase()
                    );
                }
            }
        });
    }

    reset() {
        this._actionSubject$.next(Object.assign({ op: ACTION.RESET }));
    }

    updateCurrentMaterial(material: string) {
        this._actionSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: material }));
    }

    updateRequirements(requirement: IRequirementMessageModel) {
        this._actionSubject$.next(Object.assign({ op: ACTION.REQUIREMENT, requirement: requirement }));
    }

    updateConsignedPresent() {
        this._actionSubject$.next(Object.assign({ op: ACTION.CONSIGNED }));
    }

    updateRememberSelections() {
        this._actionSubject$.next(Object.assign({ op: ACTION.REMEMBER }));
    }

    updateCompress() {
        this._actionSubject$.next(Object.assign({ op: ACTION.COMPRESS }));
    }
}
