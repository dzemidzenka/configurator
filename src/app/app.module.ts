import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenubarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';

import { MenuComponent } from './menu/menu.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SetProposalComponent } from './configurator/set-proposal/set-proposal.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';
import { TableModule } from './table/table.module';

// import { MdAutocompleteModule } from '@angular/material';

import { DataService } from './services/data.service';
// import { RouteResolverService } from './services/route-resolver.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';



const ROUTES: Routes = [
  { path: '', redirectTo: '/configurator/', pathMatch: 'full' },
  { path: 'configurator/:material', component: ConfiguratorComponent },    //, data: { defaultMaterial: '' }
  { path: 'data', loadChildren: './table/table.module#TableModule' },
  { path: '**', redirectTo: '/configurator/' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
    TableModule,
    BrowserModule,
    MenubarModule,
    AutoCompleteModule,
    // MdAutocompleteModule
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
    // RouteResolverService
  ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
