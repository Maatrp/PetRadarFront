import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@angular/common';
import { PlaceData } from 'src/app/interface/place-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent implements OnInit, OnChanges {
  @Input() placeId!: string;
  @Input() showCard!: boolean;
  @Input() canBeClosed: boolean = false;
  @Output() dataChange = new EventEmitter<PlaceData>();
  data!: PlaceData;
  showSkeleton: boolean = false;
  isLoggedIn: boolean = false;
  selected: boolean = false;
  currentUrl: string = '';
  isRequestPlaceUrl: boolean = false;

  constructor(
    private _el: ElementRef,
    private _communicationService: CommunicationService,
    private _petRadarApiService: PetRadarApiService,
    private _router: Router,
    private _storageService: StorageService,
    private _location: Location,
  ) { }

  async ngOnInit() {
    // Comprobamos si el usuario esta logeado
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    // Comprobamos la url actual
    this.getCurrentUrl();

    // Inicializar la card
    if (this.placeId) {
      await this.fillData(this.placeId);
    }

    // Suscripción al evento de click en el marker
    this._communicationService.markerClick$.subscribe(async (placeId) => {
      this.isLoggedIn = await this._storageService.getIsLoggedIn();

      if (this.canBeClosed && (placeId === this.placeId || !this.placeId)) {
        await this.fillData(placeId);
      }
      this.showCard = true;
    });
  }

  // Método para actualizar favorito de la card
  async ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes) {
      const dataChange = changes['data'];

      if (dataChange.currentValue && dataChange.previousValue) {
        const isFavoriteChanged =
          dataChange.currentValue.isFavorite !==
          dataChange.previousValue.isFavorite;

        if (isFavoriteChanged) {
          await this.fillData(this.placeId);
        }
      }
    }
  }

  // Método para rellenar los datos de la card
  async fillData(placeId: string) {
    if (this.canBeClosed) {
      this.showSkeleton = true;
    }

    // Obtenemos el id del usuario si esta logeado
    const UserData = await this._storageService.getUserData();
    let userId = '';
    if (UserData) {
      userId = UserData.id;
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
          this.showSkeleton = false;
        }
      },
      error: () => {
        this.showCard = false;
        this.showSkeleton = false;
      },
    });
  }

  // Método para cerrar la card
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (this.canBeClosed) {
      // Comprueba si el click se encuentra dentro del elemento
      const isClickInside = this._el.nativeElement.contains(event.target);

      // Si el click no se encuentra dentro del elemento, destruye la card
      if (!isClickInside) {
        this.showCard = false;
      }
    }
  }

  // Método para abrir la card
  handleClickOpenCardPage(placeId: string) {
    this._router.navigate(['/card-page', placeId, this.isRequestPlaceUrl], { replaceUrl: false });
  }

  // Método para gestionar a favoritos
  async handleClickFavoritePlace(event: Event) {
    event.stopPropagation(); // Evitar la propagación a handleClickOpenCardPage

    // Obtenemos el token
    const token = await this._storageService.getToken();

    // Obtenemos el id del usuario si esta logeado
    const userId = (await this._storageService.getUserData()).id;

    // Anadimos o eliminamos el favorito
    if (!this.data.favorite) {
      this._petRadarApiService.putAddFavorite(token, this.data.id, userId).subscribe({
        next: () => {
          this.data.favorite = true;
          this._communicationService.emitUpdatedFavorites();
        },
        error: (error) => {
          console.log('Error al añadir a favoritos', error);
        },
      });
    } else {
      this._petRadarApiService
        .deleteRemoveFavorite(token, this.data.id, userId)
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

  async handleClickSelectedPlace(event: Event) {
    event.stopPropagation(); 

    this.selected = !this.selected;

    this._communicationService.emitSelectedList(this.data.id);
  }

  private getCurrentUrl() {
    this.currentUrl = this._location.path();
    if (this.currentUrl === '/request-place') {
      this.isRequestPlaceUrl = true;
    } else {
      this.isRequestPlaceUrl = false;
    }
  }
}
