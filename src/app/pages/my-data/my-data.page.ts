import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
})
export class MyDataPage implements OnInit {
  public isLoggedIn: boolean = false;
  public username: string = '';
  public email: string = '';
  public name: string = '';
  public password: string = '';

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this._storageService.getIsLoggedIn();
    if (this.isLoggedIn) {
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


}