import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeColor',
  standalone: true
})
export class TypeColorPipe implements PipeTransform {

  transform(type: string): string {
    switch (type) {
      case 'masculine': { return 'lightblue'; }
      case 'feminine': { return 'lightpink'; }
      case 'neuter': { return 'palegoldenrod'; }
      case 'verb': { return 'plum'; }
      case 'other': { return 'lightgreen'; }
      default: { return 'gray'; }
    }
  }

}
