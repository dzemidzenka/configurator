import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguratorButtonComponent } from './configurator/configurator-button/configurator-button.component';
import { MaterialSelectionComponent } from './configurator/material-selection/material-selection.component';
import { SettingsComponent } from './configurator/settings/settings.component';
import { RequirementsComponent } from './configurator/requirements/requirements.component';

import { ReduxService } from './services/redux.service';
import { PROVIDERS } from './services/providers';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';


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
    ClipboardModule
  ],
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    MaterialSelectionComponent,
    SettingsComponent,
    ConfiguratorButtonComponent,
    RequirementsComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    ReduxService,
    ...PROVIDERS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
