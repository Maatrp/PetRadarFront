import { CommunicationService } from 'src/app/services/communication/communication.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PetRadarApiService } from '../../services/apis/pet-radar-api.service';
import { Component, ViewChild } from '@angular/core';
import { Icon, LatLngExpression, Layer, Map, marker, tileLayer } from 'leaflet';
import { MarkerData } from 'src/app/interface/marker-data';
import { FilterData } from 'src/app/interface/filter-data';
import { environment } from 'src/environments/environment';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  // Carga los datos
  data: MarkerData[] = [];
  map: Map | undefined;
  markerLayers: Layer[] = [];
  filterData: FilterData | undefined;
  @ViewChild(HeaderComponent) _headerComponent: HeaderComponent | undefined;
  
  constructor(
    private _petRadarApiService: PetRadarApiService,
    private _communicationService: CommunicationService,
    private _storageService: StorageService,
    private _geolocationService: GeolocationService,
    private _toastController: ToastController,
  ) { }

  async ionViewWillEnter() {
    try {
      // Comprobación de permisos para pintar el link
      await this._headerComponent?.checkPermissions();

      // Carga los datos
      this.filterData = await this._storageService.getFilters();

      await this._storageService.setViewMode('/map');

      if (!this.map) {
        this.map = new Map('map');
      }

      // Carga la ubicación
      const geolocation: number[] = await this._storageService.getMapCenter();
      let center: LatLngExpression = [geolocation[0], geolocation[1]];

      this.map.setView(center, 13);

      // Carga del mapa
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Carga los marcadores
      await this.fillMarkers();

      // Ajustar tamaño del mapa
      this.map.invalidateSize();

    } catch (error) {
       this.presentToast('Incidencia en la asignación de marcadores');
    }
  }

  // Carga los marcadores
  async fillMarkers() {
    if (!this.map) {
       this.presentToast('Incidencia al cargar el mapa. Intentalo de nuevo.');
      return;
    }
    const map = this.map as Map;

    if (this.markerLayers && this.markerLayers.length > 0) {
      this.markerLayers.forEach((layer) => {
        map.removeLayer(layer);
      });
    }
    const previousMarkerCount = this.markerLayers.length;

    //Devuelve el id del usuario si esta logeado
    const userData = (await this._storageService.getUserData());
    let userId = '';
    if (userData) {
      userId = userData.id;
    }

    const token = await this._storageService.getToken();
    // Carga los marcadores y favoritos del usuario si esta logeado
    this._petRadarApiService.postMarkers(token, userId).subscribe({
      next: (value) => {
        value.forEach((element: MarkerData) => {
          if (!this.shouldFilterElement(element)) {
            // Carga del icono
            const customIcon = this.createCustomIcon(element);

            // Carga del marcador
            this.markerLayers.push(
              marker([element.latitude, element.longitude], {
                icon: customIcon,
              })
                .addTo(map)
                .on('click', (event) => {
                  this.handleMarkerClick(element.id);
                  event.originalEvent.stopPropagation();
                })
            );
          }
        });
      },
      complete:  () => {
        if (this.markerLayers.length === previousMarkerCount) {
          this.presentToast('No hay coincidencias.');
        }
      },
      error: () => {
         this.presentToast('Incidencia al cargar los marcadores');
      },
    });
  }

  // Captura la llamada al marcador
  handleMarkerClick(placeId: string) {
    this._communicationService.emitMarkerClick(placeId);
  }

  // Actualiza la ubicación
  handleGeolocationButtonClick() {
    this._geolocationService
      .retrieveCurrentPosition()
      .catch((error) => {
        this.presentToast('Incidencia al actualizar la posición');
      });

    this.ionViewWillEnter();
  }

  // Filtra el elemento
  private shouldFilterElement(element: MarkerData): boolean {
    if (
      this.filterData?.placeName &&
      !element.name
        .toLocaleLowerCase()
        .includes(this.filterData?.placeName.toLocaleLowerCase())
    ) {
      return true;
    }
    if (this.filterData?.placeTypes && this.filterData?.placeTypes.length > 0) {
      if (
        !this.filterData?.placeTypes.some(
          (selectedType: string) => element.type === selectedType
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // Crea el icono
  private createCustomIcon(data: MarkerData): Icon {
    let type = data.type.toLowerCase();
    let iconUrl = '';

    if (data.favorite) {
      iconUrl = `${environment.iconUrl}favorite.png`;
    } else {
      iconUrl = `${environment.iconUrl}${type}.png`;
    }

    return new Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
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
