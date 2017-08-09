import { Injectable } from '@angular/core';
import { Router, ResolveEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { StateModel, ActionModel, ACTION, RequirementsModel } from '../models/models';
import { data } from '../app.data';


@Injectable()
export class DataService {

  constructor(private _router: Router) {
    this.state$.subscribe(state => console.log('STATE', state));
  }


  private _requirementsSubject$ = new Subject();
  private _resetSubject$ = new Subject();
  private _currentMaterialSubject$ = new Subject();


  private _data$: Observable<Array<ActionModel>> = Observable.of(data)
    .map(data => Object.assign({ op: ACTION.RAW, raw: data }))
    .publishBehavior({})
    .refCount();


  // private _routerEvent$ = this._router.events
  //   // .do(event => console.log(event))
  //   .filter(event => event instanceof ResolveEnd && event.state.root.firstChild.params.material)
  //   .map((event: ResolveEnd) => event.state.root.firstChild.params.material)
  //   .map(material => Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }))
  //   .do(material => this.reset());



  state$: Observable<StateModel> = this._requirementsSubject$
    .merge(this._resetSubject$, this._data$, this._currentMaterialSubject$)
    .scan((state: StateModel, action: ActionModel) => {
      let _state = _.cloneDeep(state);

      switch (action.op) {
        case ACTION.RESET:
          _state.requirements = [];
          break;

        case ACTION.MATERIAL:
          _state.currentMaterial = action.currentMaterial;

          let _L = _state.raw
            .filter(o => o.material === action.currentMaterial)
            .map(o => o.L);
          let __L = _.sortBy(_L);
          _state.L = _.sortedUniq(__L);

          let _lordosis = _state.raw
            .filter(o => o.material === action.currentMaterial)
            .map(o => o.lordosis);
          let __lordosis = _.sortBy(_lordosis);
          _state.lordosis = _.sortedUniq(__lordosis);
          break;

        case ACTION.REQUIREMENT:
          let index = state.requirements.findIndex(o => o.L === action.requirement.L && o.lordosis === action.requirement.lordosis);
          let _array = [];
          if (index === -1) {
            _array = _state.requirements.concat(action.requirement);
          } else {
            _array = _state.requirements;
            let newQty = _array[index].qty + action.requirement.qty;
            if (newQty <= _array[index].qtyAvail) {
              _array[index].qty = newQty;
            }
          }
          _state.requirements = _.sortBy(_array.filter(requirement => requirement.qty > 0), 'lordosis');
          break;

        case ACTION.RAW:
          _state.raw = action.raw;

          _state.materials = action.raw.map(o => o.material);
          let _a = _state.materials.sort();
          _state.materials = _.sortedUniq(_a);

          // if (!_state.currentMaterial) {
          //   _state.currentMaterial = _state.materials[0];
          //   this._router.navigate(['/configurator', _state.currentMaterial]);
          //   this._currentMaterialSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: _state.currentMaterial.toUpperCase() }));
          // }

          break;
      }

      _state.actions.unshift(action);
      return _state;
    }, { actions: [], requirements: [] })
    .publishBehavior({})
    .refCount() as Observable<StateModel>;





  setCurrentMaterial(material: string) {
    this.reset();
    this._currentMaterialSubject$.next(Object.assign({ op: ACTION.MATERIAL, currentMaterial: material.toUpperCase() }));
  }


  reset() {
    this._resetSubject$.next(Object.assign({ op: ACTION.RESET }));
  }


  updateRequirements(requirement: RequirementsModel) {
    this._requirementsSubject$.next(Object.assign({ op: ACTION.REQUIREMENT, requirement: requirement }));
  }
}




// constructor( ele: ElementRef, private ngZone: NgZone ) {
//     this.ngZone.runOutsideAngular( () => {
//         Observable.fromEvent(ele.nativeElement, "dragover")
//             .subscribe( (event: Event) => {
//                 event.preventDefault();
//             }
//         );
//     });
// }



//  {{ (userObs|async).?lastName}}, {{ (userObs|async).?firstName}} 




// @Component({
//   selector: 'my-app',
//   template: `
//     <ng-template #templateRef let-label="label" let-url="url">
//       <div><a href="{{url}}">{{label}}</a>LOL</div>
//     </ng-template>
    
//     <ng-template #templateRef1 let-label="label" let-url="url">
//       <div><a href="{{url}}">{{label}}</a>HAHAHA</div>
//     </ng-template>
    
//     <ng-template [ngIf]="true">
//     <div [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="menu[0]"></div>
//     <div [ngTemplateOutlet]="templateRef1" [ngTemplateOutletContext]="menu[1]"></div>
//     <ng-container *ngTemplateOutlet="templateRef; context: menu[1]"></ng-container>
//     <div *ngTemplateOutlet="templateRef; context: menu[0]"></div>  
//     </ng-template>
//   `
// })
// export class App {
//   menu:any = [{
//            "id": 1,
//            "label": "AngularJS",
//            "url": "http:\/\/www.learn-angular.fr\/angularJS"
//           }, {
//            "id": 2,
//            "label": "Angular",
//            "url": "http:\/\/www.learn-angular.fr\/angular"
//           }];
  
//   constructor() {
    
//   }
// }




// <a routerLink="/path">
// <a [routerLink]="[ '/path', routeParam ]">
// <a [routerLink]="[ '/path', { matrixParam: 'value' } ]">
// <a [routerLink]="[ '/path' ]" [queryParams]="{ page: 1 }">
// <a [routerLink]="[ '/path' ]" fragment="anchor"> 