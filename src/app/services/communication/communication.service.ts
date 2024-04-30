import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private markerClickSubject = new Subject<string>();
  private updatedFavorites = new Subject<void>();
  url: string = '';
  markerClick$ = this.markerClickSubject.asObservable();
  selectedList: string[] = [];

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

  // Comunicación de request-place a card-page
  emitRequestPlace() {
    this.url = '/request-place';
  }

  // Comunicación de los espacios seleccionados
  emitSelectedList(selectedItemId: string) {
    // Comprobamos si esta en la lista
    const index = this.selectedList.indexOf(selectedItemId);

    if (index === -1) {
      // Si no está en la lista lo añadimos
      this.selectedList.push(selectedItemId);
    } else {
      // Si está lo eliminamos
      this.selectedList.splice(index, 1);
    }
  }

  // Devuelve la lista de espacios seleccionados
  getSelectedList(): string[] {
    return this.selectedList;
  }

}  