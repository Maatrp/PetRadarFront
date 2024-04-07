import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/interface/user-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { RegisterPageForm } from './register.page.form';
import { EncryptService } from 'src/app/services/encrypt/encrypt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _petRadarApiService: PetRadarApiService,
    private _encryptService: EncryptService
  ) { }

  ngOnInit() {
    this.form = new RegisterPageForm(this._formBuilder).createForm();
  }

  // Envia la petición
  async accept() {
    try {
      if (this.form.valid) {
        await this.createUser(this.form.value);
      }
    } catch (error) {
      console.log('Incidencia en la creación de usuario');
    }
  }

  // Cambiar visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Cambiar visibilidad de la contraseña de confirmación
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Crea el usuario
  private async createUser(userData: UserData) {
    const userCreated = userData;
    userCreated.password = await this._encryptService.encryptPassword(userData.password);

    this._petRadarApiService.postCreateUser(userCreated).subscribe({
      error: (err) => {
        if (err.status === 201) {
          console.log('Usuario creado con éxito');
          this._router.navigate(['/login']);
        } else if (err.status === 409) {
          console.log('El usuario ya existe en la base de datos');
          this._router.navigate(['/map']);
        } else {
          console.log('No se ha podido crear el usuario');
          this._router.navigate(['/map']);
        }
      },
    });
  }

}
