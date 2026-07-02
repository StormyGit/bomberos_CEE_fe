import { estaciones } from './../types/cce/incidente.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BomberosMantenimiento {
  getAllEstaciones(): estaciones[] {
    return [
      {
        nombre: 'Estación Central CCE',
        point: { x: -87.20333, y: 14.09626 }
      },
      {
        nombre: 'Estación #1 - Colonia Granada',
        point: { x: -87.26129, y: 14.09605 }
      },
      {
        nombre: 'Estación #2 - Colonia Kennedy',
        point: { x: -87.17694, y: 14.06456 }
      },
      {
        nombre: 'Estación #3 - Colonia Las Vegas',
        point: { x: -87.2200, y: 14.0900 }
      },
      {
        nombre: 'Estación #4 - Colonia El Carrizal',
        point: { x: -87.2500, y: 14.1050 }
      },
      {
        nombre: 'Estación #5 - La Nueva Capital',
        point: { x: -87.2700, y: 14.1250 }
      },
      {
        nombre: 'Estación #7 - El Hatillo',
        point: { x: -87.1750, y: 14.1500 }
      }
    ];
  }
}
