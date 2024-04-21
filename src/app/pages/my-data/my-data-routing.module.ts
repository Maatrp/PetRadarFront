import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDataPage } from './my-data.page';

const routes: Routes = [
  {
    path: '',
    component: MyDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDataPageRoutingModule {}
