import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenubarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';
import { DataService } from './services/data.service';
import { MenuComponent } from './menu/menu.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SetProposalComponent } from './configurator/set-proposal/set-proposal.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';
import { TableModule } from './table/table.module';



const ROUTES: Routes = [
  { path: '', redirectTo: '/configurator', pathMatch: 'full' },
  { path: 'configurator', component: ConfiguratorComponent },
  { path: 'data', loadChildren: './table/table.module#TableModule' },
  { path: '**', redirectTo: '/configurator' }
];


@NgModule({
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    MenuComponent,
    MaterialSelectionComponent,
    SetProposalComponent,
    ConfiguratorButtonComponent,
    RequirementsComponent,
  ],
  imports: [
    TableModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    MenubarModule,
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
