import { Component } from '@angular/core';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { MarkerData } from 'src/app/interface/marker-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.page.html',
  styleUrls: ['./favorite-list.page.scss'],
})
export class FavoriteListPage {
  hasPermissions: boolean = false;
  totalData: MarkerData[] = [];
  showNoMatches: boolean = true;

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
  ) { }

  async ionViewWillEnter() {
    this.hasPermissions = await this._authService.checkPermission(PermissionEnum.FAVORITE_PLACE);

    if (this.hasPermissions) {
      //Carga los datos del storage
      await this._storageService.setViewMode('/cards-list');

      // Carga los datos
      this.fillData();
    }

  }

  private async fillData() {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;

    this._petRadarApiService.getFavoriteList(token, userId)
      .subscribe({
        next: (value) => {
          this.totalData = value;
          this.showNoMatches = false;
        },
        error: () => {
          this.showNoMatches = false;
        }
      });
  }

}
