import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'translateRestrictions',
})
export class TranslateRestrictionsPipe implements PipeTransform {

  transform(restriction: string): string {
    // Traducción de tags
    switch (restriction) {
      case 'CARRIER':
        return 'Transportín';
      case 'MUZZLE':
        return 'Bozal';
      case 'NONMAXSIZE':	
        return 'Sin tamaño máximo';
      case 'MAXSIZEMEDIUM':
        return 'Máximo mediano';
      case 'MAXSIZELARGE':
        return 'Máximo grande';
      case 'PETTYPEDOG':
        return 'Perros';
      case 'PETTYPECAT':
        return 'Gatos';
      case 'LEASH':
        return 'Correa obligatoria';
      case 'VACCINESOK':
        return 'Vacunas al día';
      default:
        return restriction;
    }
  }
}