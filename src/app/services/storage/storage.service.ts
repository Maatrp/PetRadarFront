import { UserData } from 'src/app/interface/user-data';
import { FilterData } from './../../interface/filter-data';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(private _storage: Storage, private _router: Router) {
  }

  // Configuración de filtros
  async setFilters(searchName: string, selectedTypes: string[]) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('placeName', searchName);
    await this._storage?.set('placeType', selectedTypes);
  }

  // Obtiene los filtros
  async getFilters(): Promise<FilterData> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    const filterData: FilterData = {
      placeName: await this._storage?.get('placeName'),
      placeTypes: await this._storage?.get('placeType'),
    };

    return filterData;
  }

  // Configuración de la vista
  async setViewMode(mode: string) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('viewMode', mode);
  }

  // Obtiene la vista
  async getViewMode(): Promise<string> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('viewMode');
  }

  // Configuración del mapa
  async setMapCenter(latitude: number, longitude: number) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('mapCenterLat', latitude);
    await this._storage?.set('mapCenterLng', longitude);
  }

  // Obtiene el mapa
  async getMapCenter(): Promise<number[]> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    const geolocation: number[] = [
      await this._storage?.get('mapCenterLat'),
      await this._storage?.get('mapCenterLng')
    ];
    if (geolocation[0] === null && geolocation[1] === null) {
      geolocation[0] = environment.defaultLatitude
      geolocation[1] = environment.defaultLongitude;
    }
    return geolocation;
  }

  // Obtiene estado del logueo
  async getIsLoggedIn(): Promise<boolean> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    let token = await this.getToken();
    return token != null && token.length > 0;
  }

  // Configuración del token
  async setToken(token: string) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    await this._storage?.set('tokenV1', token);
    await this._storage?.set('tokenV1Expiration', expirationDate.toISOString());
  }


  // Configuración del token
  async removeToken() {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.remove('tokenV1');
    await this._storage?.remove('tokenV1Expiration');
  }

  // Obtiene el token
  async getToken(): Promise<string> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    const token = await this._storage?.get('tokenV1');
    const expirationDateStr = await this._storage?.get('tokenV1Expiration');

    if (token && expirationDateStr) {
      const expirationDate = new Date(expirationDateStr);
      const now = new Date();

      if (now < expirationDate) {
        // El token es válido
        return token;
      } else {
        // El token ha expirado y lo borramos
        await this._storage?.remove('tokenV1');
        await this._storage?.remove('tokenV1Expiration');
        await this._router.navigate(['/login']);
      }
    }
    return "";
  }

  // Configuración de los datos del usuario
  async setUserData(userData: UserData) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('userData', userData);
  }

  async destroyUserData() {
    await this._storage?.remove('userData');
  }

  // Obtiene los datos del usuario
  async getUserData(): Promise<UserData> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('userData');
  }

}