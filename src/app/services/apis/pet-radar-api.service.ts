import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarkerData } from 'src/app/interface/marker-data';
import { PlaceData } from 'src/app/interface/place-data';
import { UserData } from 'src/app/interface/user-data';
import { environment } from 'src/environments/environment';
import { AuthResponse } from 'src/app/interface/auth-response';
import { TypeData } from 'src/app/interface/type-data';
import { TagsData } from 'src/app/interface/tags-data';
import { RestrictionsData } from 'src/app/interface/restrictions-data';

@Injectable({
  providedIn: 'root',
})
export class PetRadarApiService {
  private placeListUrl: string = environment.placeListUrl;
  private placeCardUrl: string = environment.placeCardUrl;
  private authUserUrl: string = environment.authUserUrl;
  private createUserUrl: string = environment.createUserUrl;
  private addFavoriteUrl: string = environment.addFavoriteUrl;
  private removeFavoriteUrl: string = environment.removeFavoriteUrl;
  private listFavoriteUrl: string = environment.listFavoriteUrl;
  private createPlaceUrl: string = environment.createPlaceUrl;
  private typePlaceUrl: string = environment.typePlaceUrl;
  private tagsPlaceUrl: string = environment.tagsPlaceUrl;
  private restrictionsPlaceUrl: string = environment.restrictionsPlaceUrl;

  constructor(private _http: HttpClient) { }


  // Obtiene todos los marcadores
  public postMarkers(token: string, userId?: string): Observable<MarkerData[]> {

    const req = {
      latitude: environment.defaultLatitude,
      longitude: environment.defaultLongitude,
      radius: 4,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token != null) {
      token = 'Bearer ' + token;
      headers = headers.set('Authorization', token);
    }

    let url = '';

    if (userId) {
      url = this.placeListUrl + '?userId=' + userId;
    } else {
      url = this.placeListUrl + '?';
    }

    return this._http.post<MarkerData[]>(
      url,
      req,
      { headers: headers }
    );
  }

  // Obtiene un marcador por su id
  getPlaceById(token: string, placeId: string, userId?: string): Observable<PlaceData> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token != null) {
      token = 'Bearer ' + token;
      headers = headers.set('Authorization', token);
    }

    let url = '';

    if (userId) {
      url = this.placeCardUrl + placeId + '?userId=' + userId;
    } else {
      url = this.placeCardUrl + placeId + '?';
    }

    return this._http.get<PlaceData>(
      url,
      { headers: headers }
    );
  }

  // Crea un usuario
  postCreateUser(UserData: UserData): Observable<string> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post<string>(
      this.createUserUrl,
      UserData,
      { headers: headers }
    );
  }

  // Obtiene un usuario
  postAuthUser(userName: string, password: string): Observable<AuthResponse> {

    return this._http.post<AuthResponse>(
      this.authUserUrl,
      { userName, password }
    );
  }

  // Añade a favorito
  putAddFavorite(token: string, placeId: string, userId: string): Observable<string> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this._http.put(
      this.addFavoriteUrl + '/' + userId + '/' + placeId,
      null,
      { headers: headers, responseType: 'text' }
    );
  }

  // Elimina de favorito
  deleteRemoveFavorite(token: string, placeId: string, userId: string): Observable<string> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this._http.delete(
      this.removeFavoriteUrl + '/' + userId + '/' + placeId,
      { headers: headers, responseType: 'text' }
    );
  }

  // Obtiene la lista de favoritos
  getFavoriteList(token: string, userId: string): Observable<MarkerData[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this._http.get<MarkerData[]>(
      this.listFavoriteUrl + '/' + userId,
      { headers: headers }
    );
  }

  // Crear espacio
  postCreatePlace(token: string, idUser: string, placeData: PlaceData): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this._http.post<string>(
      this.createPlaceUrl + '/' + idUser, placeData,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  // Obtiene la lista de tipos de lugar
  getTypePlace(): Observable<TypeData[]> {
    return this._http.get<TypeData[]>(this.typePlaceUrl);

  }

  // Obtiene la lista de tags
  getTagsPlace(): Observable<TagsData[]> {
    return this._http.get<TagsData[]>(this.tagsPlaceUrl);

  }

  // Obtiene la lista de restricciones de un lugar
  getRestrictionsPlace(): Observable<RestrictionsData[]> {
    return this._http.get<RestrictionsData[]>(this.restrictionsPlaceUrl);

  }

}
