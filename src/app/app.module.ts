import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenubarModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';
import { MenuComponent } from './menu/menu.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SetProposalComponent } from './configurator/set-proposal/set-proposal.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';
import { data, defaultMaterial } from './app.data';


import { DataService } from './services/data.service';
// import { RouteResolverService } from './services/route-resolver.service';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';


// determine outliers
(function modifyData() {
  data.map(o => {
    o.lordosisOrig = o.lordosis;
    if (o.H === 14 || o.H === 16 || o.W === 40) {
      o.lordosis = 99;
    }
    return o;
  });
})();




const ROUTES: Routes = [
  { path: '', redirectTo: '/configurator/' + defaultMaterial, pathMatch: 'full' },
  { path: 'configurator/:material', component: ConfiguratorComponent },    //, data: { defaultMaterial: '' }
  { path: 'data', loadChildren: './table/table.module#TableModule' },
  { path: '**', redirectTo: '/configurator/' + defaultMaterial }
];


@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    MenubarModule
  ],
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    MenuComponent,
    MaterialSelectionComponent,
    SetProposalComponent,
    ConfiguratorButtonComponent,
    RequirementsComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    DataService,
    {
      provide: 'defaultMaterial',
      useValue: defaultMaterial
    },
    {
      provide: 'data',
      useValue: data
    }
    // RouteResolverService
  ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
