import { Component, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-set-proposal',
  templateUrl: './set-proposal.component.html',
  styleUrls: ['./set-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetProposalComponent {

  setProposal$ = this.dataService.state$.map(state => state.setProposal);
    // .do(sets => {
    //   let a = [];
    //   const setsToCopy = document.querySelector('#copy');
    //   sets.forEach(set => a.push(set.setType));
    //   setsToCopy.textContent = a.join(',');
    // });

  constructor(private dataService: DataService) { }

  // copy() {
  //   const setsToCopy = document.getElementById('copy');
  //   const range = document.createRange();
  //   range.selectNode(setsToCopy);
  //   window.getSelection().addRange(range);
  //   document.execCommand('copy');
  //   document.execCommand('copy');    
  //   window.getSelection().removeAllRanges();
  // }
}
