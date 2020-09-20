import { MatPaginatorIntl } from "@angular/material/paginator";
import { Injectable } from "@angular/core";

@Injectable()
export class MatPaginatorImpl extends MatPaginatorIntl{

  itemsPerPageLabel = 'Items por página';
  nextPageLabel = 'Siguiente';
  previousPageLabel = 'Anterior';

  getRangeLabel = function (page, pageSize, length){
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const starIndex = page + pageSize;

    const endIndex = starIndex < length ?
      Math.min(starIndex + pageSize, length):
      starIndex + pageSize;
    return starIndex + 1 + ' - ' + endIndex + ' de ' + length;
  }
}
