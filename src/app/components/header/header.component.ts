import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userCanCreate: boolean = false;
  updateStatusPlace: boolean = false;

  constructor(
    private _router: Router,
    private _authService: AuthService
  ) { }

  async checkPermissions() {
    await this.checkCreatePlacePermission();
    await this.checkUpdateStatusPlacePermission();
  }

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

  isShowingCreatePlaceButton(): boolean {
    return this._router.url !== '/create-place';

  }

  isShowingUpdateStatusPlaceButton(): boolean {
    return this._router.url !== '/request-place';

  }

  private async checkCreatePlacePermission() {
    this.userCanCreate = await this._authService.checkPermission(PermissionEnum.CREATE_PLACE);
  }

  private async checkUpdateStatusPlacePermission() {
    this.updateStatusPlace = await this._authService.checkPermission(PermissionEnum.UPDATE_STATUS_PLACE);
  }

}