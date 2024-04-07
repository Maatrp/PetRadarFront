import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsListPage } from './cards-list.page';

const routes: Routes = [
  {
    path: '',
    component: CardsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsListPageRoutingModule {}
