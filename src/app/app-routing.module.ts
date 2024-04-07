import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    loadChildren: () =>
      import('./pages/map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'cards-list',
    loadChildren: () =>
      import('./pages/cards-list/cards-list.module').then(
        (m) => m.CardsListPageModule
      ),
  },
  {
    path: 'filter',
    loadChildren: () =>
      import('./pages/filter/filter.module').then((m) => m.FilterPageModule),
  },
  {
    path: 'card-page/:id',
    loadChildren: () =>
      import('./pages/card-page/card-page.module').then(
        (m) => m.CardPagePageModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'my-account',
    loadChildren: () =>
      import('./pages/my-account/my-account.module').then(
        (m) => m.MyAccountPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: false,
      enableTracing: false, // Desactiva las trazas de navegación
      scrollPositionRestoration: 'enabled', // Restaura la posición de desplazamiento al cambiar de página
      anchorScrolling: 'enabled',
    }), // Permite el desplazamiento a anclas en la misma página
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
