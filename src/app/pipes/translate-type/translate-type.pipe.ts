import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateType',
})
export class TranslateTypePipe implements PipeTransform {
  transform(type: string): string {
    // Traducción de types
    switch (type) {
      case 'MALL':
        return 'Centro comercial';
      case 'PARK':
        return 'Parque';
      case 'RESTAURANT':
        return 'Restaurante';
      case 'SUPERMARKET':
        return 'Supermercado';
      case 'HOTEL':
        return 'Hotel';
      case 'COFFESHOP':
        return 'Cafetería';
      case 'DOGTRAINER':
        return 'Entrenador de perros';
      case 'VETERINARY':
        return 'Veterinaria';
      case 'HAIRDRESSER':
        return 'Peluquería';
      default:
        return type;
    }
  }
}
