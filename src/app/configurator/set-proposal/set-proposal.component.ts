import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-set-proposal',
  templateUrl: './set-proposal.component.html',
  styleUrls: ['./set-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class SetProposalComponent implements OnInit {

  // setProposal$: Observable<Array<RequirementsModel>>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.setProposal$ = this.dataService.getRequirements()
    //   .map(a => _.sortBy(a.filter(e => e.qty > 0), ['L', 'lordosis']));


  }

}
