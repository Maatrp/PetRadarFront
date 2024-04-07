import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private latitude: number = environment.defaultLatitude;
  private longitude: number = environment.defaultLongitude;
  
  constructor(private _storageService: StorageService) {}

  async retrieveCurrentPosition() {
    // Comprueba los permisos
    const hasPermissions = await Geolocation.checkPermissions();

    // Si los permisos no están activados, los activa
    if (hasPermissions.location && hasPermissions.coarseLocation) {
      let geolocation = await Geolocation.getCurrentPosition();
      if (geolocation && geolocation.coords) {
        this._storageService.setMapCenter(
          geolocation.coords.latitude,
          geolocation.coords.longitude
        );
      }
    } else {// Si los permisos estan activados, coge una ubicación por defecto
      this._storageService.setMapCenter(this.latitude, this.longitude);
    }
  }
}
