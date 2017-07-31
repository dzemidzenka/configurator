import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menuItems: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.menuInit();
  }


  menuInit() {
    this.menuItems = [    
      {
        label: 'Configurator', icon: 'fa-database', routerLink: '/'
      },
      {
        label: 'Data', icon: 'fa-table', routerLink: 'data'
      }      
    ];
  }

}
