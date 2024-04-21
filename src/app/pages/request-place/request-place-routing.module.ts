import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestPlacePage } from './request-place.page';

const routes: Routes = [
  {
    path: '',
    component: RequestPlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPlacePageRoutingModule {}
