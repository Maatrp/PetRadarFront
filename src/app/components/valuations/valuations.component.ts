import { Component, Input, OnInit } from '@angular/core';
import { ValuationsData } from 'src/app/interface/valuations-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-valuations',
  templateUrl: './valuations.component.html',
  styleUrls: ['./valuations.component.scss'],
})
export class ValuationsComponent implements OnInit {
  @Input() placeId!: string;
  valuation!: ValuationsData;
  valuationsList: ValuationsData[] = [];


  constructor(
    private _communicationService: CommunicationService,
    private _petRadarApiService: PetRadarApiService,
    private _storageService: StorageService,
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
      next: async (valuations: ValuationsData[]) => {
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
            console.log(this.valuation);
            this.valuationsList.push(this.valuation);
          }
        }

      }, error: (error) => {
        console.log('Error al cargar los comentarios', error);
      }
    });
  }

}
