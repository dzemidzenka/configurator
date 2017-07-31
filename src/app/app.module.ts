import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenubarModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';
import { DataService } from './services/data.service';
import { MenuComponent } from './menu/menu.component';
import { DataComponent } from './data/data.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SetProposalComponent } from './configurator/set-proposal/set-proposal.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';



const ROUTES: Routes = [
  { path: '', redirectTo: '/configurator', pathMatch: 'full' },
  { path: 'configurator', component: ConfiguratorComponent },
  { path: 'data', component: DataComponent },
  { path: '**', redirectTo: '/configurator' }  
];


@NgModule({
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    MenuComponent,
    DataComponent,
    MaterialSelectionComponent,
    SetProposalComponent,
    ConfiguratorButtonComponent,
    RequirementsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    MenubarModule,
    DataTableModule,
    SharedModule,
    ButtonModule,
    AutoCompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
  providers: [
    DataService
  ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
