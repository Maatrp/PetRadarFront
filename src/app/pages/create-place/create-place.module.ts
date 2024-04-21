import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePlacePageRoutingModule } from './create-place-routing.module';

import { CreatePlacePage } from './create-place.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    declarations: [CreatePlacePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreatePlacePageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule,
    ]
})
export class CreatePlacePageModule {}
