import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { TranslateTypePipe } from './translate-type/translate-type.pipe';
import { StarRatingPipe } from './stars/stars.pipe';
import { TranslateTagPipe } from './translate-tag.pipe/tranlate-tag.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    TranslateTypePipe,
    StarRatingPipe,
    TranslateTagPipe
  ],
  imports: [
    CommonModule
  ], 
  exports:[
    FilterPipe,
    TranslateTypePipe,
    StarRatingPipe,
    TranslateTagPipe
  ]
})
export class PipesModule { }