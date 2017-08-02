import { Injectable } from '@angular/core';
import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel } from '../models/requirements.model';
import { data } from '../app.data';
import { Observable, Subject } from 'rxjs';

 
@Injectable()
export class DataService {

  private data$: Observable<ConfiguratorDataModel>;
  currentMaterial: string;

  private setProposalSubject$ = new Subject();
  private setProposal$ = this.setProposalSubject$.asObservable();

  private resetSubject$ = new Subject();
  reset$ = this.resetSubject$.asObservable();

  private materialSelectedSubject$ = new Subject();
  materialSelected$ = this.materialSelectedSubject$.asObservable();


  constructor() { 
    this.data$ = Observable.from(data).share();
    this.currentMaterial = 'PEEK';       //need to get the 1st material
  }


  setCurrentMaterial(material: string) {
    if (this.currentMaterial !== material) {
      this.currentMaterial = material.toUpperCase();
      this.materialSelectedSubject$.next(material);
      this.reset();
    }
  }


  getConfiguratorData(material?: string): Observable<ConfiguratorDataModel> {
    if (arguments.length === 0) {
      return this.data$;
    }
    return this.data$.filter(e => e.material === this.currentMaterial);
  }


  updateRequirements(changes: Array<RequirementsModel>) {
    this.setProposalSubject$.next(changes);
  }


  getRequirements(): Observable<Array<RequirementsModel>> {
    return this.setProposal$ as Observable<Array<RequirementsModel>>;
  }

  reset() {
    this.resetSubject$.next();
  }

}
