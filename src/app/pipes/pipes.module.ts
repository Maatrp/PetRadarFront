import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { TranslateTypePipe } from './translate-type/translate-type.pipe';
import { StarRatingPipe } from './stars/stars.pipe';
import { TranslateTagPipe } from './translate-tag/tranlate-tag.pipe';
import { TranslateRestrictionsPipe } from './translate-restrictions/translate-restrictions.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    TranslateTypePipe,
    StarRatingPipe,
    TranslateTagPipe,
    TranslateRestrictionsPipe
  ],
  imports: [
    CommonModule
  ], 
  exports:[
    FilterPipe,
    TranslateTypePipe,
    StarRatingPipe,
    TranslateTagPipe,
    TranslateRestrictionsPipe
  ]
})
export class PipesModule { }