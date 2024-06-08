import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { MarkerData } from 'src/app/interface/marker-data';
import { PlaceData } from 'src/app/interface/place-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.page.html',
  styleUrls: ['./favorite-list.page.scss'],
})
export class FavoriteListPage {
  data!: PlaceData;
  hasPermissions: boolean = false;
  totalData: MarkerData[] = [];
  showNoMatches: boolean = true;
  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
    private _toastController: ToastController,
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

  async generatePDF() {
    const doc = new jsPDF();
    const tableData: any[] = [];

    for (const element of this.totalData) {
      const placeData = await this.getPlaceData(element.id);

      if (placeData) {
        tableData.push([
          placeData.name,
          placeData.type,
          placeData.address,
          placeData.zip,
          placeData.town,
          placeData.averageRating
        ]);
      }
    }

    autoTable(doc, {
      head: [['Nombre', 'Tipo', 'Dirección', 'Código postal', 'Ciudad', 'Valoración media']],
      body: tableData,
      startY: 10,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('favorite-list.pdf');
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

  private async getPlaceData(placeId: string): Promise<PlaceData | null> {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;

    return new Promise((resolve, reject) => {
      this._petRadarApiService.getPlaceById(token, placeId, userId).subscribe({
        next: (place: PlaceData) => resolve(place),
        error: () => resolve(null)
      });
    });
  }

  private async presentToast(message: string) {
    const toast = await this._toastController.create({
      message: message,
      position: 'middle',
      duration: 3000,
    });
    toast.present();
  }

}
