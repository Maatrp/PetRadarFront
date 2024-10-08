import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FilterData } from 'src/app/interface/filter-data';
import { MarkerData } from 'src/app/interface/marker-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.page.html',
  styleUrls: ['./cards-list.page.scss'],
})
export class CardsListPage {
  totalData: MarkerData[] = [];
  data: MarkerData[] = [];
  filterData: FilterData | undefined;
  numPage: number = 0;
  pageSize: number = 5;
  noMoreData: boolean = false;
  isTypeEmpty: boolean = false;
  showNoMatches: boolean = true;
  @ViewChild(HeaderComponent) _headerComponent: HeaderComponent | undefined;
  
  constructor(
    private _petRadarApiService: PetRadarApiService,
    private _storageService: StorageService
  ) { }

  async ionViewWillEnter() {
    // Comprobación de permisos para pintar el link
    await this._headerComponent?.checkPermissions();

    // Carga los datos del storage
    this.filterData = await this._storageService.getFilters();
    await this._storageService.setViewMode('/cards-list');

    // Carga los datos
    this.fillData();
  }

  // Carga los datos
  async fillData() {
    const token = await this._storageService.getToken();
    
    return this._petRadarApiService.postMarkers(token).subscribe({
      next: (value) => {
        this.totalData = value;
        this.showNoMatches = false;
      },
      error: () => {
        this.showNoMatches = false;
      },
    });
  }
}
