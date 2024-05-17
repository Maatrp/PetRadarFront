import { Component, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ValuationsData } from 'src/app/interface/valuations-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-valuations',
  templateUrl: './valuations.component.html',
  styleUrls: ['./valuations.component.scss'],
})
export class ValuationsComponent implements OnInit {
  @Input() placeId!: string;
  @Output() valuation!: ValuationsData;
  valuationsList: ValuationsData[] = [];


  constructor(
    private _petRadarApiService: PetRadarApiService,
    private _storageService: StorageService,
    private _toastController: ToastController,
  ) { }

  async ngOnInit() {
    // Inicializamos las valoraciones
    if (this.placeId) {
      await this.fillData(this.placeId);
    }

  }

  async fillData(placeId: string) {
    const token = await this._storageService.getToken();

    // Obtenemos los datos del comentario
    this._petRadarApiService.getValuationsPlace(token, placeId).subscribe({
      next: (valuations: ValuationsData[]) => {
        if (valuations.length > 0) {
          for (const valuation of valuations) {
            this.valuation = {
              id: valuation.id,
              placeId: valuation.placeId,
              userId: valuation.userId,
              userName: valuation.userName,
              averageRating: valuation.averageRating,
              commentMessage: valuation.commentMessage
            };
            this.valuationsList.push(this.valuation);
          }
        }

      }, error: () => {
        this.presentToast('Error al cargar los comentarios');
      }
    });
  }

  // Añadir la valoración a la lista
  addValuation(valuation: ValuationsData) {
    this.valuationsList.push(valuation);
  }

  // Muestra un toast
  private async presentToast(message: string) {
    const toast = await this._toastController.create({
      message: message,
      position: 'middle',
      duration: 3000,
    });
    toast.present();
  }
}
