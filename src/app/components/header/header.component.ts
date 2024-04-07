import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {

  constructor(private _router: Router) { }

  // Método para mostrar el botón del mapa
  isShowingMapButton(): boolean {
    return this._router.url !== '/map';
  }

  // Método para mostrar el botón de la lista de cards
  isShowingCardsListButton(): boolean {
    return this._router.url !== '/cards-list';
  }

  // Método para mostrar el botón de los filtros
  isShowingFilterButton(): boolean {
    return this._router.url === '/map' || this._router.url === '/cards-list';
  }

}