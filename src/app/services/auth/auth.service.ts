import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PermissionEnum } from 'src/app/enum/permission-enum';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private _storageService: StorageService,
        private _router: Router,
    ) { }


    async logout(): Promise<void> {
        // Limpiar el token y cualquier otra información de autenticación almacenada
        await this._storageService.setToken('');
        await this._storageService.setIsLoggedIn(false);
        await this._storageService.destroyUserData();

        // Redirigir al usuario a la página de inicio de sesión
        await this._router.navigate(['/login']);
    }


    async handleError(error: HttpErrorResponse) {
        if (error.status === 403) {

            this.logout();
        }
        return 'La sesión ha caducado: ' + error.message;
    }

    async checkPermission(permission: PermissionEnum) {
        try {
            const userData = await this._storageService.getUserData();
            const userPermissions = userData?.permission.permissions.includes(permission);
            if (!userData || !userPermissions) {
                return false;
            }

            return userPermissions;

        } catch (error) {
            console.log(error);

            return false;

        }
    }
}