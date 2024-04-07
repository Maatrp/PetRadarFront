import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardsListPageRoutingModule } from './cards-list-routing.module';

import { CardsListPage } from './cards-list.page';
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [CardsListPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CardsListPageRoutingModule,
        ComponentsModule,
        PipesModule
    ]
})
export class CardsListPageModule {}
