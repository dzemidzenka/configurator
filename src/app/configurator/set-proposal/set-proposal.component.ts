import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data.service';
// import { SetProposalModel } from '../../data/set-proposal.model';
import { RequirementsModel } from '../../models/requirements.model';

import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-set-proposal',
  templateUrl: './set-proposal.component.html',
  styleUrls: ['./set-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class SetProposalComponent implements OnInit {

  setProposal$: Observable<Array<RequirementsModel>>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.setProposal$ = this.dataService.getRequirements()
    //   .map(a => _.sortBy(a.filter(e => e.qty > 0), ['L', 'lordosis']));


  }

}
