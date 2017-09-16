import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';

import { TableComponent } from './table.component';


const ROUTES: Routes = [
  { path: '', component: TableComponent }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    DataTableModule,
    SharedModule,
    ButtonModule
  ],
  declarations: [
    TableComponent
  ]
})
export class TableModule { }
