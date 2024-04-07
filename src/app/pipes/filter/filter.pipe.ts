import { Pipe, PipeTransform } from '@angular/core';
import { MarkerData } from 'src/app/interface/marker-data';
import { FilterData } from 'src/app/interface/filter-data';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: MarkerData[], filterData: FilterData | undefined): MarkerData[] {
    if (value == null || value == undefined || value.length == 0) {
      return [];
    }
    if(filterData == null || filterData == undefined){
      return value;
    }

    return value.filter((item: MarkerData) => {

      //Si el filtro de nombre no coincide con el nombre, lo filtramos 
      if (filterData.placeName && !item.name.toLocaleLowerCase().includes(filterData.placeName.toLocaleLowerCase())){
        return false;
      }
      //Si el filtro de tipo no coincide con el tipo, lo filtramos 
      if(filterData.placeTypes && filterData.placeTypes.length > 0){       
        if (!filterData.placeTypes.some((selectedType: string) => item.type === selectedType)) {
          return false;
        }
      }
      return true;
    });
  }
}