
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './datepicker.component';

@NgModule({
  imports : [
    CommonModule,
    FormsModule
  ],
  declarations : [
    DatePickerComponent
  ],
  exports: [DatePickerComponent]
})
export class DatePickerModule {
}
