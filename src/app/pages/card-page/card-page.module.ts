import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPagePageRoutingModule } from './card-page-routing.module';

import { CardPagePage } from './card-page.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [CardPagePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CardPagePageRoutingModule,
        ComponentsModule,
        PipesModule
    ]
})
export class CardPagePageModule {}
