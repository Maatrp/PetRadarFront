import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { MarkerData } from 'src/app/interface/marker-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-request-place',
  templateUrl: './request-place.page.html',
  styleUrls: ['./request-place.page.scss'],
})
export class RequestPlacePage {
  hasPermissions: boolean = false;
  totalData: MarkerData[] = [];
  showNoMatches: boolean = true;
  selectedList: string[] = [];

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
    private _communicationService: CommunicationService,
    private _router: Router
  ) { }

  async ionViewWillEnter() {
    this.hasPermissions = await this._authService.checkPermission(PermissionEnum.UPDATE_STATUS_PLACE);

    if (this.hasPermissions) {
      //Carga los datos del storage
      await this._storageService.setViewMode('/cards-list');

      // Carga los datos
      this.fillData();
    }
  }

  // Carga los datos
  async fillData() {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;

    return this._petRadarApiService.getPendingPlaces(token, userId).subscribe({
      next: (value) => {
        this.totalData = value;
        this.showNoMatches = false;
        this._communicationService.emitRequestPlace();
      },
      error: () => {
        this.showNoMatches = false;
      },
    });
  }

  isNotEmptySelectedList() {
    this.selectedList = this._communicationService.getSelectedList();
    return this.selectedList.length > 0;
  }

  async accept() {
    const token = await this._storageService.getToken();

    return this._petRadarApiService.putUpdateAllStatusPlaces(token, this.selectedList, 'AC')
      .subscribe({
        next: () => {
          console.log('Publicación aceptada');
          location.reload();
        },
        error: (err) => {
          console.log('Error al aceptar la publicación', err);

        },
      });

  }

  async decline() {
    const token = await this._storageService.getToken();

    return this._petRadarApiService.putUpdateAllStatusPlaces(token, this.selectedList, 'DC')
      .subscribe({
        next: () => {
          console.log('Publicación declinada');
          location.reload();
        },
        error: (err) => {
          console.log('Error al declinar la publicación', err);

        },
      });
  }
}
