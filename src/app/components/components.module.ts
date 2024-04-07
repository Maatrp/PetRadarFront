import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule  } from '@ionic/angular';
import { PlaceCardComponent } from './place-card/place-card.component';
import { LoginPageRoutingModule } from '../pages/login/login-routing.module';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { PlaceCardSkeletorComponent } from './place-card-skeletor/place-card-skeletor.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PlaceCardComponent,
    PlaceCardSkeletorComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LoginPageRoutingModule,
    FormsModule,
    PipesModule
  ], exports: [
    HeaderComponent,
    PlaceCardComponent,
    PlaceCardSkeletorComponent
    ]
})
export class ComponentsModule { }
