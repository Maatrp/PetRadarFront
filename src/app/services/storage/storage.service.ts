import { UserData } from 'src/app/interface/user-data';
import { FilterData } from './../../interface/filter-data';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(private _storage: Storage) {
  }

  async init() {
  }

  // Configuración de filtros
  public async setFilters(searchName: string, selectedTypes: string[]) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('placeName', searchName);
    await this._storage?.set('placeType', selectedTypes);
  }

  // Obtiene los filtros
  public async getFilters(): Promise<FilterData> {
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
  public async setViewMode(mode: string) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('viewMode', mode);
  }

  // Obtiene la vista
  public async getViewMode(): Promise<string> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('viewMode');
  }

  // Configuración del mapa
  public async setMapCenter(latitude: number, longitude: number) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('mapCenterLat', latitude);
    await this._storage?.set('mapCenterLng', longitude);
  }

  // Obtiene el mapa
  public async getMapCenter(): Promise<number[]> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    const geolocation: number[] = [
      await this._storage?.get('mapCenterLat'),
      await this._storage?.get('mapCenterLng')
    ];
    if (geolocation[0] === null && geolocation[1] === null) {
      geolocation[0] = 37.36247679369061;
      geolocation[1] = -6.034726252104273;
    }
    return geolocation;
  }

  // Configuración del si eta logueado
  public async setIsLoggedIn(value: boolean) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('isLoggedIn', value);
  }

  // Obtiene estado del logueo
  public async getIsLoggedIn(): Promise<boolean> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('isLoggedIn');
  }

  // Configuración del token
  public async setToken(token: string) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('token', token);
  }

  // Obtiene el token
  public async getToken(): Promise<string> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('token');
  }

  // Configuración de los datos del usuario
  public async setUserData(userData: UserData) {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    await this._storage?.set('userData', userData);
  }

  public async destroyUserData() {
    await this._storage?.remove('userData');
  }

  // Obtiene los datos del usuario
  public async getUserData(): Promise<UserData> {
    if (!this.storage) {
      this.storage = await this._storage.create();
    }
    return await this._storage?.get('userData');
  }

}