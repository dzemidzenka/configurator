import { Component, ChangeDetectionStrategy } from '@angular/core';
// import { trigger, state, style, transition, animate } from "@angular/animations";

import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // animations: [
  //   trigger('signal', [   
  //     state('void', style({
  //       'color': 'red', 
  //       'opacity': '0',
  //     })),      
  //     transition('* => active', animate('500ms')),      
  //   ])
  // ],
})
export class RequirementsComponent {

  requirements$ = this.dataService.state$.map(state => state.requirements.filter(requirement => requirement.qty > 0));

  constructor(public dataService: DataService) { }
  
}
