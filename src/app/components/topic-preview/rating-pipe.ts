import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rating', standalone: true })
export class RatingPipe implements PipeTransform {
  transform(value: number) {
    if (isNaN(value)) {
      return '';
    }

    const parts = value.toFixed(1).split('.');
    const intPart = parts[0];
    const floatPart = parts[1];

    return `${intPart}.${floatPart}`;
  }
}
