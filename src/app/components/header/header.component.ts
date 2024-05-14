import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { MarkerData } from 'src/app/interface/marker-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userCanCreate: boolean = false;
  updateStatusPlace: boolean = false;
  badgeButton: boolean = false;
  totalData: MarkerData[] = [];

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
  ) { }

  async ngOnInit() {
    this.loadRequestPlaceListLength();
  }

  async checkPermissions() {
    await this.checkCreatePlacePermission();
    await this.checkUpdateStatusPlacePermission();
  }

  // Método para mostrar el botón del index
  isShowingIndexButton(): boolean {
    return this._router.url !== '/index';
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
  async loadRequestPlaceListLength() {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;

    this._petRadarApiService.getPendingPlaces(token, userId).subscribe({
      next: (value) => {
        this.totalData = value;
        this.badgeButton = this.totalData.length > 0;
      },
      error: () => {
        this.badgeButton = false;
      },
    });

    return this.badgeButton;

  }
  private async checkCreatePlacePermission() {
    this.userCanCreate = await this._authService.checkPermission(PermissionEnum.CREATE_PLACE);
  }

  private async checkUpdateStatusPlacePermission() {
    this.updateStatusPlace = await this._authService.checkPermission(PermissionEnum.UPDATE_STATUS_PLACE);
  }

}