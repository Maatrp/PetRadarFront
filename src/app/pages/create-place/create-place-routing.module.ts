import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePlacePage } from './create-place.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePlacePageRoutingModule {}
