import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PlaceTypeOption } from 'src/app/interface/place-type-option';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage {
  selectedTypes: string[] = [];
  searchName: string = '';
  viewMode: string = '';
  options: PlaceTypeOption[] = [
    { name: 'MALL', selected: false },
    { name: 'PARK', selected: false },
    { name: 'RESTAURANT', selected: false },
    { name: 'SUPERMARKET', selected: false },
    { name: 'HOTEL', selected: false },
    { name: 'COFFESHOP', selected: false },
    { name: 'DOGTRAINER', selected: false },
    { name: 'VETERINARY', selected: false },
    { name: 'HAIRDRESSER', selected: false },
    { name: 'BEACH', selected: false },
  ];

  constructor(
    private _storageService: StorageService,
    private _router: Router,
    private _toastController: ToastController,
  ) {}

  async ionViewWillEnter() {
    try {
      await this.initFilters();
    } catch (error) {
      this.presentToast('Incidencia en la asignación de marcadores');
      
    }
  }

  // Método que captura los filtros
  async filterSearch() {
    await this._storageService.setFilters(this.searchName, this.selectedTypes);

    this.viewMode = await this._storageService.getViewMode();

    await this._router.navigate([this.viewMode], { replaceUrl: true });
  }

  // Método para marcar las opciones
  onSelectionChange() {
    this.selectedTypes = this.options
      .filter((option) => option.selected)
      .map((option) => option.name);
  }

  // Método que inicializa los filtros
  async initFilters() {
    let filterData = await this._storageService.getFilters();
    // Lo dejamos vacío porque no queremos mantenerlo.
    this.searchName = '';
    if (filterData && filterData.placeTypes) {
      // Las opciones que cuadran con lo que tenemos en el storage, las marcamos como selected.
      filterData.placeTypes.forEach((updatedOption) => {
        const existingOption = this.options.find(
          (option) => option.name === updatedOption
        );

        if (existingOption) {
          existingOption.selected = true;
        }
      });
    }
  }

  // Método para marcar todos los checkboxes
  selectAll() {
    this.options.forEach(option => option.selected = true);
    this.onSelectionChange(); 
  }

  // Método para desmarcar todos los checkboxes
  deselectAll() {
    this.options.forEach(option => option.selected = false);
    this.onSelectionChange(); 
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