import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { MenubarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';
// import { MenuComponent } from './menu/menu.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SettingsComponent } from './configurator/settings/settings.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';
import { data, defaultMaterial } from './app.data';


import { DataService } from './services/data.service';
// import { RouteResolverService } from './services/route-resolver.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';


// determine outliers
(function () {
  data.map(o => {
    o.lordosisOrig = o.lordosis;
    if (o.H === 14 || o.H === 16 || o.W === 40) {
      o.lordosis = 99;
    }
    return o;
  });
})();

// const ROUTES: Routes = [
//   { path: '', redirectTo: '/configurator/' + defaultMaterial, pathMatch: 'full' },
//   { path: 'configurator/:material', component: ConfiguratorComponent },
//     // data: { defaultMaterial: '' }   resolve: {data: RouteResolverService}
//   { path: 'data', loadChildren: './table/table.module#TableModule' },
//   { path: '**', redirectTo: '/configurator/' + defaultMaterial }
// ];

const _LOCAL_STORAGE_NAME = 'configurator_state';
// const _localState = JSON.parse(localStorage.getItem(_LOCAL_STORAGE_NAME));



const ROUTES: Routes = [
  { path: '', redirectTo: '/configurator', pathMatch: 'full' },
  { path: 'configurator', component: ConfiguratorComponent },
  { path: 'data', loadChildren: './table/table.module#TableModule' },
  { path: '**', redirectTo: '/configurator' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    ClipboardModule,
    TooltipModule
    // MenubarModule
  ],
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    // MenuComponent,
    MaterialSelectionComponent,
    SettingsComponent,
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
    },
    // {
    //   provide: 'localState',
    //   useValue: _localState
    // },
    {
      provide: 'localStorageName',
      useValue: _LOCAL_STORAGE_NAME
    }
    // RouteResolverService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
