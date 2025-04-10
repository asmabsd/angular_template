import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';

@NgModule({
  declarations: [PhoneFormatPipe],
  imports: [CommonModule],
  exports: [PhoneFormatPipe]
})
export class SharedModule {}
