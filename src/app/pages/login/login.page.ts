import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthResponse } from 'src/app/interface/auth-response';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  temPassword: string = '';
  showPassword: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
    private _toastController: ToastController,
  ) { }

  async ngOnInit() {
    this.form = new LoginPageForm(this._formBuilder).createForm();
  }

  // Redirige a la pantalla de registro
  async register() {
    await this._router.navigate(['/register']);
  }

  // Busca al usuario
  async authUser(userName: string, password: string) {

    return this._petRadarApiService.postAuthUser(userName, password).subscribe({
      next: async (value: AuthResponse) => {
        if (value.jwt != null) {
          await this._storageService.setToken(value.jwt);
          await this._storageService.setUserData(value.user);
          await this._router.navigate(['/map']);
          this.presentToast('Sesión iniciada');
        }
        else {
          this.presentToast('Nombre de usuario o contraseña incorrecta');
        }

      },
      error: (err) => {
        if (err.status === 401) {
          this.presentToast('No puede loguearse sin haber verificado su email');
        } else {
          this.presentToast('Nombre de usuario o contraseña incorrecta');
        }
      },
    });
  }

  // Cambiar visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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