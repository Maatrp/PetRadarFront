import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PermissionEnum } from 'src/app/enum/permission-enum';
import { MarkerData } from 'src/app/interface/marker-data';
import { PetRadarApiService } from 'src/app/services/apis/pet-radar-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';


@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.page.html',
  styleUrls: ['./favorite-list.page.scss'],
})
export class FavoriteListPage {
  hasPermissions: boolean = false;
  totalData: MarkerData[] = [];
  showNoMatches: boolean = true;
  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _petRadarApiService: PetRadarApiService,
  ) { }

  async ionViewWillEnter() {
    this.hasPermissions = await this._authService.checkPermission(PermissionEnum.FAVORITE_PLACE);

    if (this.hasPermissions) {
      //Carga los datos del storage
      await this._storageService.setViewMode('/cards-list');

      // Carga los datos
      this.fillData();
    }

  }

  async generatePDF() {
    const content = this.content.nativeElement;

    if (!content) {
      console.error('Elemento #content no encontrado.');
      return;
    }

    await this.captureContentAsPDF(content);
  }

  private async fillData() {
    const token = await this._storageService.getToken();
    const userId = (await this._storageService.getUserData()).id;

    this._petRadarApiService.getFavoriteList(token, userId)
      .subscribe({
        next: (value) => {
          this.totalData = value;
          this.showNoMatches = false;
        },
        error: () => {
          this.showNoMatches = false;
        }
      });
  }

  private async captureContentAsPDF(content: HTMLElement) {
    const imgPromises: any[] = [];

    // Pre-cargar imágenes
    const imgElements = content.querySelectorAll('img');
    imgElements.forEach(img => {
      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Error al cargar la imagen.'));
      });
      imgPromises.push(promise);
    });
  
    // Esperar a que todas las imágenes se carguen
    try {
      await Promise.all(imgPromises);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      return;
    }
  
    // Una vez que todas las imágenes están cargadas, capturar el contenido como PDF
    html2canvas(content).then(canvas => {
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      const contentDataURL = canvas.toDataURL('image/jpeg'); 
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save('documento.pdf');
    }).catch(error => {
      console.error('Error al generar PDF:', error);
    });
  }

}
