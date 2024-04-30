import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { TypeData } from 'src/app/interface/type-data';
import { TagsData } from 'src/app/interface/tags-data';
import { RestrictionsData } from 'src/app/interface/restrictions-data';
import { CreatePlacePageForm } from './create-place.page.form';
import { PlaceData } from 'src/app/interface/place-data';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PermissionEnum } from 'src/app/enum/permission-enum';

@Component({
  selector: 'app-create-place',
  templateUrl: './create-place.page.html',
  styleUrls: ['./create-place.page.scss'],
})
export class CreatePlacePage {
  form!: FormGroup;
  typePlaceList: string[] = [];
  tagsPlaceList: string[] = [];
  restrictionsPlaceList: string[] = [];
  selectedFiles: File[] = [];
  hasPermissions: boolean = false;

  selectedTags: string[] = [];
  selectedRestrictions: string[] = [];

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _formBuilder: FormBuilder,
    private _petRadarApiService: PetRadarApiService,
    private _router: Router
  ) { }

  async ionViewWillEnter() {
    this.hasPermissions = await this._authService.checkPermission(PermissionEnum.CREATE_PLACE);

    if (this.hasPermissions) {
      this.form = new CreatePlacePageForm(this._formBuilder).createForm();
      this.getTypePlace();
      this.getTagsPlace();
      this.getRestrictionsPlace();
    }
  }

  onFileSelected(event: any): void {
    const files: FileList | null = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          this.selectedFiles.push(file);
        }
      }
    }
  }

  async accept() {
    try {
      if (this.form.valid) {
        await this.createPlace(this.form.value);
        this._router.navigate(['/map']);
      }
    } catch (error) {
      console.log('Incidencia en la creación de lugar', error);
    }
  }

  // Obtiene la lista de tipos de lugar y los 
  getTypePlace(): void {
    this._petRadarApiService.getTypePlace()
      .subscribe((data: TypeData[]) => {
        // Añade a una lista de strings
        this.typePlaceList = data.map(type => type.id);
      });
  }

  // Obtiene la lista de tags del lugar
  getTagsPlace(): void {
    this._petRadarApiService.getTagsPlace()
      .subscribe((data: TagsData[]) => {
        // Añade a una lista de strings
        this.tagsPlaceList = data.map(tag => tag.id);
      });
  }

  // Obtiene la lista de restricciones del lugar
  getRestrictionsPlace(): void {
    this._petRadarApiService.getRestrictionsPlace()
      .subscribe((data: RestrictionsData[]) => {
        // Añade a una lista de strings
        this.restrictionsPlaceList = data.map(restrictions => restrictions.id);
      });
  }

  addOrRemoveTag(element: string) {
    const index = this.selectedTags.indexOf(element);
    if (index !== -1) {
      // Si el string ya existe, lo eliminamos
      this.selectedTags.splice(index, 1);
    } else {
      // Si el string no existe, lo agregamos
      this.selectedTags.push(element);
    }
  }
  
  addOrRemoveRestrictions(element: string) {
    const index = this.selectedRestrictions.indexOf(element);
    if (index !== -1) {
      // Si el string ya existe, lo eliminamos
      this.selectedRestrictions.splice(index, 1);
    } else {
      // Si el string no existe, lo agregamos
      this.selectedRestrictions.push(element);
    }
  }

  // Crea el lugar
  private async createPlace(placeData: PlaceData) {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;
    placeData.tags = this.selectedTags;
    placeData.restrictions = this.selectedRestrictions;
    
    this._petRadarApiService.postCreatePlace(token, userId, placeData)
      .subscribe(
        () => {
          console.log('Creado con éxito');
          this._router.navigate(['/map']);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

}
