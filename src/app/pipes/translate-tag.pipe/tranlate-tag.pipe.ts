import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'translateTag',
  })
  export class TranslateTagPipe implements PipeTransform {
    transform(tag: string): string {
      // Traducción de tags
      switch (tag) {
        case 'FOUNTAIN':
          return 'Fuente';
        case 'CREDITALLOWED':
          return 'Pago con tarjeta';
        case 'DOGARTICLES':
          return 'Arcticulos para perros';
        case 'CATARTICLES':
          return 'Arcticulos para gatos';
        case 'RESTROOM':
          return 'Baño';
        case 'PAIDPARKING':
          return 'Parking de pago';
        case 'TERRACE':
          return 'Terraza';
        case 'DOGPARK':
          return 'Parque de perros';
        default:
          return tag;
      }
    }
  }