import { Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
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
  isLoggedIn: boolean = false;
  isDropdownVisible: boolean = false;

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
    private _elementRef: ElementRef
  ) { }

  async ngOnInit() {
    // Escucha el evento NavigationEnd
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(async () => {
      // Realiza las acciones necesarias después de cada navegación
      await this.isLogged();
      if (this.isLoggedIn) {
        await this.loadRequestPlaceListLength();
      }
    });
  }

  async checkPermissions() {
    await this.isLogged();

    if(this.isLoggedIn){
      await this.checkCreatePlacePermission();
      await this.checkUpdateStatusPlacePermission();
    }
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

  // Método para mostrar el botón de crear una publicación
  isShowingCreatePlaceButton(): boolean {
    return this._router.url !== '/create-place';
  }

  // Método para mostrar el botón de actualizar el estado de una publicación
  isShowingUpdateStatusPlaceButton(): boolean {
    return this._router.url !== '/request-place';
  }

  // Método para comprobar si esta logueado el usuario
  async isLogged() {
    const isUserLogged = await this._storageService.getIsLoggedIn();

    if (isUserLogged) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  // Método para el desplegable de my-account
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Método para cerrar el desplegable de my-account
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      // Cerrar el menú si el clic no ocurrió dentro del botón o del menú desplegable
      this.isDropdownVisible = false;
    }
  }

  // Método para comprobar cuantas solicitudes pendientes hay
  async loadRequestPlaceListLength() {
    const token = await this._storageService.getToken();
    const userData = await this._storageService.getUserData();
    const userId = userData? userData.id : null;
    
    if (userId !== null) {
      this._petRadarApiService.getPendingPlaces(token, userId).subscribe({
        next: (value) => {
          this.totalData = value;
          this.badgeButton = this.totalData.length > 0;
        },
        error: () => {
          this.badgeButton = false;
        },
      });
    }

    return this.badgeButton;

  }

  // Método para comprobar si el usuario puede crear un lugar
  private async checkCreatePlacePermission() {
    this.userCanCreate = await this._authService.checkPermission(PermissionEnum.CREATE_PLACE);
  }

  // Método para comprobar si el usuario puede actualizar el estado de una publicación
  private async checkUpdateStatusPlacePermission() {
    this.updateStatusPlace = await this._authService.checkPermission(PermissionEnum.UPDATE_STATUS_PLACE);
  }

}