import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteListPageRoutingModule } from './favorite-list-routing.module';

import { FavoriteListPage } from './favorite-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [FavoriteListPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FavoriteListPageRoutingModule,
        ComponentsModule,
        PipesModule
    ]
})
export class FavoriteListPageModule {}
