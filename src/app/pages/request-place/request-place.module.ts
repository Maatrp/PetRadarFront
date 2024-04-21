import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPlacePageRoutingModule } from './request-place-routing.module';

import { RequestPlacePage } from './request-place.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPlacePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [RequestPlacePage]
})
export class RequestPlacePageModule {}
