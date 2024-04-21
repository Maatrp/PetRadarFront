import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  public isLoggedIn: boolean = false;
  

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _storageService: StorageService,
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this._storageService.getIsLoggedIn();

    if(!this.isLoggedIn){
      this._router.navigate(['/login']);
    }
  }

  async logout() {
    await this._authService.logout();
  }

}
