import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private markerClickSubject = new Subject<string>();
  private updatedFavorites = new Subject<void>();
  markerClick$ = this.markerClickSubject.asObservable();

  // Comunicación de markerClickSubject para emitir el valor (placeId) a los observadores
  emitMarkerClick(placeId: string) {
    this.markerClickSubject.next(placeId);
  }

  // Comunicación de updatedFavorites para emitir un evento de actualización a los observadores
  emitUpdatedFavorites() {
    this.updatedFavorites.next();
  }

  // Devuelve el Observable asociado a updatedFavorites
  getUpdatedFavorites(): Observable<void> {
    return this.updatedFavorites.asObservable();
  }

}