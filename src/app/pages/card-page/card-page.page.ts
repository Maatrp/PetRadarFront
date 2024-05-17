import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { PlaceData } from 'src/app/interface/place-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CardPageForm } from './card-page.form';
import { ValuationsData } from 'src/app/interface/valuations-data';
import { IonModal, ToastController } from '@ionic/angular';
import { ValuationsComponent } from 'src/app/components/valuations/valuations.component';

@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.page.html',
  styleUrls: ['./card-page.page.scss'],
})
export class CardPagePage implements OnInit, OnChanges {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(ValuationsComponent) valuations!: ValuationsComponent;
  data!: PlaceData;
  form!: FormGroup;
  placeId: string = '';
  showSkeleton: boolean = false;
  showNoData: boolean = false;
  isLoggedIn: boolean = false;
  showUpdateStatusButton: boolean = false;
  hasUpdateStatusPermissions: boolean = false;
  hasValuationsPlacePermissions: boolean = false;
  hasValuationsListNotEmpty: boolean = false;
  showButtonCreateCommit: boolean = false;
  showCreateCommit: boolean = false;

  constructor(
    private _petRadarApiService: PetRadarApiService,
    private _activatedRoute: ActivatedRoute,
    private _communicationService: CommunicationService,
    private _storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _toastController: ToastController,
  ) { }

  async ngOnInit() {
    // Comprobamos si el usuario esta logeado
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    // Obtenemos los permisos del usuario si esta logeado
    this.hasUpdateStatusPermissions = await this._authService.checkPermission(PermissionEnum.UPDATE_STATUS_PLACE);
    // Carga el permiso de valoraciones
    this.hasValuationsPlacePermissions = await this._authService.checkPermission(PermissionEnum.VALUATION_PLACE);

    // Obtención de plaiceId de la url
    this._activatedRoute.params.subscribe((params) => {
      this.placeId = params['id'];

      // Si tiene permisos de administrador puede ver los botónes para aceptar o declinar la publicación
      this.showUpdateStatusButton = params['updateStatus'] === 'true' && this.hasUpdateStatusPermissions;
    });

    // Inicializar la card
    if (this.placeId) {
      await this.fillData(this.placeId);

      this.showButtonCreateCommit = await this.showButtonCreateValoration();
    }

  }

  // Método para actualizar favorito de la card
  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      const dataChange = changes['data'];

      if (dataChange.currentValue && dataChange.previousValue) {
        const isFavoriteChanged =
          dataChange.currentValue.isFavorite !==
          dataChange.previousValue.isFavorite;

        if (isFavoriteChanged) {
          this.fillData(this.placeId);
        }
      }
    }
  }

  // Método para rellenar los datos de la card
  async fillData(placeId: string) {
    this.showSkeleton = true;
    const token = await this._storageService.getToken();

    // Obtenemos el id del usuario si esta logeado
    const userData = (await this._storageService.getUserData());
    let userId = '';
    if (userData) {
      userId = userData.id;
    }

    // Obtenemos los datos de la card
    this._petRadarApiService.getPlaceById(token, placeId, userId).subscribe({
      next: async (place: PlaceData) => {
        if (place) {
          this.data = {
            id: place.id,
            name: place.name,
            type: place.type,
            latitude: place.latitude,
            longitude: place.longitude,
            placeImages: place.placeImages,
            description: place.description,
            tags: place.tags,
            restrictions: place.restrictions,
            averageRating: place.averageRating,
            address: place.address,
            zip: place.zip,
            town: place.town,
            website: place.website,
            phone: place.phone,
            favorite: place.favorite,
          };
        }
        this.showSkeleton = false;
      },
      error: () => {
        this.presentToast('Error al obtener los datos');
        this.showSkeleton = false;
        this.showNoData = true;
      },
    });

  }

  // Método para actualizar favorito de la card
  async handleClickFavoritePlace() {
    const userId = (await this._storageService.getUserData()).id;

    if (!this.data.favorite) {
      this._petRadarApiService.putAddFavorite(await this._storageService.getToken(), this.data.id, userId).subscribe({
        next: () => {
          this.data.favorite = true;
          this._communicationService.emitUpdatedFavorites();
        },
        error: () => {
          this.presentToast('Error al añadir a favoritos');
        },
      });
    } else {
      this._petRadarApiService
        .deleteRemoveFavorite(await this._storageService.getToken(), this.data.id, userId)
        .subscribe({
          next: () => {
            this.data.favorite = false;
            this._communicationService.emitUpdatedFavorites();
          },
          error: () => {
            this.presentToast('Error al eliminar el favoritos');
          },
        });
    }
  }

  // Método para  sanear el teléfono para ser utilizado
  sanitizeTelLink(phone: string): any {
    const telLink = 'tel:' + phone;
    return this._sanitizer.bypassSecurityTrustUrl(telLink);
  }

  // Aceptar la publicación
  async accept() {
    const token = await this._storageService.getToken();

    return this._petRadarApiService.putUpdateStatusPlace(token, this.placeId, 'AC')
      .subscribe({
        error: (err) => {
          if (err.status === 200) {
            this.presentToast('Publicación aceptada');
            this._router.navigate(['/request-place']);
          } else {
            this.presentToast('Error al aceptar la publicación');
            this._router.navigate(['/request-place']);
          }
        },
      });

  }

  async decline() {
    const token = await this._storageService.getToken();

    return this._petRadarApiService.putUpdateStatusPlace(token, this.placeId, 'DC')
      .subscribe({
        error: (err) => {
          if (err.status === 200) {
            this.presentToast('Publicación declinada');
            this._router.navigate(['/request-place']);
          } else {
            this.presentToast('Error al declinar la publicación');
            this._router.navigate(['/request-place']);
          }
        },
      });
  }

  // Abrir y cerrar el formulario de creación de valoración
  async openCloseCreateValuation() {
    this.showCreateCommit = !this.showCreateCommit;

    if (this.showCreateCommit) {
      this.form = new CardPageForm(this._formBuilder).createForm();
    }
  }

  //Botón de puntuación de las valoraciones
  handleRadioChange(event: Event) {
    if (event instanceof CustomEvent) {
      const selectedValue = event.detail.value;
      const logElement = document.getElementById('log');
      if (logElement) {
        logElement.textContent = selectedValue;
      }
    }
  }

  // Crear valoración
  async acceptCreateValuation() {
    try {
      if (this.form.valid) {
        await this.createValuation(this.form.value);
        //Añadimos la valoración a la lista que pintamos
        this.valuations.addValuation(this.form.value);
      }
    } catch (error) {
      this.presentToast('Incidencia en la creación de usuario');
    } 
  }

  // Muestra el botón si el usuario no ha valorado
  private async showButtonCreateValoration() {
    try {
      const token = await this._storageService.getToken();
      const userId = (await this._storageService.getUserData()).id;

      const isAlreadyValuated = await this._petRadarApiService.getIsAlreadyValuated(token, userId, this.placeId).toPromise();

      return !!isAlreadyValuated; // Convertir a booleano

    } catch (error) {
      this.presentToast('No se ha podido valorar el espacio');
      return false;
    }
  }


  // Metodo para crear valoración
  private async createValuation(valuationsData: ValuationsData) {
    const token = await this._storageService.getToken();
    valuationsData.placeId = this.placeId;
    valuationsData.userId = (await this._storageService.getUserData()).id;
    valuationsData.userName = (await this._storageService.getUserData()).username;

    this._petRadarApiService.postCreateValuation(token, valuationsData).subscribe({
      next: () => {
        this.presentToast('Valoración creada');
        this.showCreateCommit = false;
      }, error: (error) => {
        if (error.status === 409) {
          this.presentToast('Ya has valorado este lugar');
        } else {
          this.presentToast('No se ha podido valorar el espacio');
        }
        this.showCreateCommit = false;
      },
    })
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