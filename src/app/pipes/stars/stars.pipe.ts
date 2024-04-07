import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRating'
})
export class StarRatingPipe implements PipeTransform {
  transform(value: number): string {
    // Redondear el valor a 1 decimal y convertirlo en un entero
    const roundedValue = Math.round(value);

    // Crear una cadena de '★' y '☆' dependiendo del valor
    return '★'.repeat(roundedValue) + '☆'.repeat(5 - roundedValue);
  }
}
