import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PlaceData } from 'src/app/interface/place-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.page.html',
  styleUrls: ['./card-page.page.scss'],
})
export class CardPagePage implements OnInit, OnChanges {
  data!: PlaceData;
  placeId: string = '';
  showSkeleton = false;
  showNoData: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(
    private _petRadarApiService: PetRadarApiService,
    private _route: ActivatedRoute,
    private _communicationService: CommunicationService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    // Comprobamos si el usuario esta logeado
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    // Obtención de plaiceId de la url
    this._route.params.subscribe((params) => {
      this.placeId = params['id'];
    });

    // Inicializar la card
    if (this.placeId) {
      await this.fillData(this.placeId);
    }
  }

  // Método para actualizar favorito de la card
  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      const dataChange = changes['data'];

      if (dataChange.currentValue && dataChange.previousValue) {
        const isFavoriteChanged =
          dataChange.currentValue.isFavorite !==
          dataChange.previousValue.isFavorite;

        if (isFavoriteChanged) {
          this.fillData(this.placeId);
        }
      }
    }
  }

  // Método para rellenar los datos de la card
  async fillData(placeId: string) {
    this.showSkeleton = true;

    // Obtenemos el id del usuario si esta logeado
    const userData = (await this._storageService.getUserData());
    let userId = '';
    if (userData) {
      userId = userData.id;
    }

    // Obtenemos los datos de la card
    this._petRadarApiService.getPlaceById(await this._storageService.getToken(), placeId, userId).subscribe({
      next: async (place: PlaceData) => {
        if (place) {
          this.data = {
            id: place.id,
            name: place.name,
            type: place.type,
            latitude: place.latitude,
            longitude: place.longitude,
            placeImages: place.placeImages,
            description: place.description,
            tags: place.tags,
            restrictions: place.restrictions,
            averageRating: place.averageRating,
            address: place.address,
            zip: place.zip,
            town: place.town,
            website: place.website,
            phone: place.phone,
            favorite: place.favorite,
          };
        }
        this.showSkeleton = false;
      },
      error: () => {
        console.log('Error al obtener los datos');
        this.showSkeleton = false;
        this.showNoData = true;
      },
    });
  }

  // Método para actualizar favorito de la card
  async handleClickFavoritePlace() {
    const userId = (await this._storageService.getUserData()).id;

    if (!this.data.favorite) {
      this._petRadarApiService.putAddFavorite(await this._storageService.getToken(), this.data.id, userId).subscribe({
        next: () => {
          this.data.favorite = true;
          this._communicationService.emitUpdatedFavorites();
        },
        error: () => {
          console.log('Error al añadir a favoritos');
        },
      });
    } else {
      this._petRadarApiService
        .deleteRemoveFavorite(await this._storageService.getToken(), this.data.id, userId)
        .subscribe({
          next: () => {
            this.data.favorite = false;
            this._communicationService.emitUpdatedFavorites();
          },
          error: () => {
            console.log('Error al eliminar el favoritos');
          },
        });
    }
  }

  // Método para  sanear el teléfono para ser utilizado
  sanitizeTelLink(phone: string): any {
    const telLink = 'tel:' + phone;
    return this._sanitizer.bypassSecurityTrustUrl(telLink);
  }
}
