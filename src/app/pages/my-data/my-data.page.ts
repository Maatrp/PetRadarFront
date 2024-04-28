import { Component } from '@angular/core';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncryptService } from 'src/app/services/encrypt/encrypt.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
})
export class MyDataPage {
  public isLoggedIn: boolean = false;
  public username: string = '';
  public email: string = '';
  public name: string = '';
  public password: string = '';
  public hasPermissions: boolean = false;
  public updateData: boolean = false;
  public showPassword: boolean = false;


  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
    private _encryptService: EncryptService
  ) { }

  async ionViewWillEnter() {
    this.hasPermissions = await this._authService.checkPermission(
      PermissionEnum.MODIFY_USER &&
      PermissionEnum.DELETE_USER
    );
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    if (this.hasPermissions && this.isLoggedIn) {
      // Carga los datos del usuario
      await this.fillUserData();
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
          console.log('Modificado con éxito');
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    this.updateUserData();
  }


async handleClickDeleteUser() {
    const token = await this._storageService.getToken();
    const userName = (await this._storageService.getUserData()).username;

    this._petRadarApiService.deleteUser(token, userName)
      .subscribe(
        () => {
          console.log('Usuario eliminado con éxito');
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    this.logout();
  }

  private async logout() {
    await this._authService.logout();
  }

}