import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage {
  public isLoggedIn: boolean = false;
  public userId: string = '';
  public userName: string = '';
  public email: string = '';


  constructor(
    private _router: Router,
    private _storageService: StorageService,
  ) { }

  async ionViewWillEnter() {
    this.isLoggedIn = await this._storageService.getIsLoggedIn();
    await this.fillUserData();

    if (!this.isLoggedIn) {
      await this.redirectToLogin();
    }

  }

  // Redireccionamos al login
  async redirectToLogin() {
    await this._router.navigate(['/login']);
  }

  // Redireccionamos al mapa si clicamos en el icono atrás
  async redirectToMap() {
    await this._router.navigate(['/map']);
  }

  // Obtenemos los datos del usuario si esta logeado
  async fillUserData() {
    const userData = await this._storageService.getUserData();

    if (userData) {
      this.userId = userData.id;
      this.userName = userData.userName;
      this.email = userData.email;
    }
  }

  // Cerramos la sesion
  async logout() {
    await this._storageService.destroyUserData();
    await this._storageService.setIsLoggedIn(false);
    await this.redirectToMap();
  }
}
