import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncryptService } from 'src/app/services/encrypt/encrypt.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';
  email: string = '';
  name: string = '';
  password: string = '';
  hasPermissions: boolean = false;
  updateData: boolean = false;
  showPassword: boolean = false;
  

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _router: Router,
    private _petRadarApiService: PetRadarApiService,
    private _encryptService: EncryptService,
    private _toastController: ToastController,
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    if(!this.isLoggedIn){
      this._router.navigate(['/login']);

    }else{
      this.hasPermissions = await this._authService.checkPermission(
        PermissionEnum.MODIFY_USER &&
        PermissionEnum.DELETE_USER
      );
      if (this.hasPermissions && this.isLoggedIn) {
        // Carga los datos del usuario
        await this.fillUserData();
      }
    }
  }



  // Obtenemos los datos del usuario si esta logeado
  async fillUserData() {
    const userData = await this._storageService.getUserData();

    if (userData) {
      this.username = userData.username;
      this.email = userData.email;
      this.name = userData.name;
      this.password = userData.password;
    }
  }

  updateUserData() {
    this.updateData = !this.updateData;
  }

  clearData() {
    this.password = '';
  }

  async handleClickUpdateUserData() {
    if (!this.disableUpdateData()) {
      const token = await this._storageService.getToken();
      const userData = await this._storageService.getUserData();

      if (userData.name !== this.name) {
        userData.name = this.name;
      }

      if (userData.email !== this.email) {
        userData.email = this.email;
      }

      if (userData.password !== this.password) {
        userData.password = await this._encryptService.encryptPassword(this.password);

      }

      this._petRadarApiService.putModifyUser(token, userData)
        .subscribe(
          () => {
            this.presentToast('Modificado con éxito');
          },
          (error) => {
            this.presentToast('Error al modificar los datos');
          }
        );

      this.updateUserData();
    }
  }


  async handleClickDeleteUser() {
    const token = await this._storageService.getToken();
    const userName = (await this._storageService.getUserData()).username;

    this._petRadarApiService.deleteUser(token, userName)
      .subscribe(
        () => {
          this.presentToast('Usuario eliminado con éxito');
        },
        (error) => {
          this.presentToast('Error al eliminar el usuario');
        }
      );

    this.logout();
  }

  disableUpdateData(): boolean {
    let disabledbutton = false;

    if (this.name === '' || this.email === '' || this.password === '') {
      this.presentToast('No puede quedar ningun campo vacio');
      disabledbutton = true;
    } else if (this.checkEmail(this.email)) {
      this.presentToast('Email invalido');
      disabledbutton = true;
    }

    return disabledbutton;
  }

  async logout() {
    await this._authService.logout();
  }

  private checkEmail(email: string) {
    const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return EMAIL_REGEXP.test(email) ? null : { email: true };
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
