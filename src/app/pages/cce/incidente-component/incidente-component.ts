import { Component, inject, ViewChild } from '@angular/core';
import { CardComponent } from "../../../components/card-component/card-component";
import { FormComponent } from "../../../components/form-component/form-component";
import { DataFormService } from '../../../utils/data-form-service';


import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TableColumn, TableCustomComponent } from "../../../components/table-custom/table-custom"
import { MapMarker, MapPickerComponent } from "../../../shared/components/map-picker/map-picker";
export interface IncidenteInforme {
  id: number;
  status: 'pendiente' | 'ejecucion' | 'finalizado' | 'cancelado';
  lugar: string;
  region: string;
  incidente: string;
  unidad: string;
  fecha: string;
  hora: string;
  lat: number;
  lng: number;
}

export interface MarkerInforme {
  key: string;
  lat: number;
  lng: number;
  lugar: string;
  region: string;
  total: number;
  incidentes: IncidenteInforme[];
  unidades: string[];
}


@Component({
  selector: 'app-incidente-component',
  imports: [MatTableModule, MatPaginatorModule, MapPickerComponent],
  templateUrl: './incidente-component.html',
  styleUrl: './incidente-component.css',
})
export class IncidenteComponent {
listInformes: IncidenteInforme[] = [
  {
    id: 1,
    status: 'ejecucion',
    lugar: 'Col. Ayestas',
    region: 'Tegucigalpa',
    incidente: 'Incendio estructural',
    unidad: 'B-12',
    fecha: '2026-07-01',
    hora: '08:15',
    lat: 14.0818,
    lng: -87.2068
  },
  {
    id: 2,
    status: 'ejecucion',
    lugar: 'Col. Ayestas',
    region: 'Tegucigalpa',
    incidente: 'Fuga de gas',
    unidad: 'B-04',
    fecha: '2026-07-01',
    hora: '09:30',
    lat: 14.0818,
    lng: -87.2068
  },
  {
    id: 3,
    status: 'pendiente',
    lugar: 'Col. Kennedy',
    region: 'Tegucigalpa',
    incidente: 'Accidente vehicular',
    unidad: 'Pendiente',
    fecha: '2026-07-01',
    hora: '10:10',
    lat: 14.0627,
    lng: -87.1766
  },
  {
    id: 4,
    status: 'finalizado',
    lugar: 'Barrio La Granja',
    region: 'Comayagüela',
    incidente: 'Persona herida',
    unidad: 'A-09',
    fecha: '2026-07-01',
    hora: '11:20',
    lat: 14.0943,
    lng: -87.2209
  },
  {
    id: 5,
    status: 'cancelado',
    lugar: 'Col. Miraflores',
    region: 'Tegucigalpa',
    incidente: 'Falsa alarma',
    unidad: 'N/A',
    fecha: '2026-07-01',
    hora: '12:40',
    lat: 14.0835,
    lng: -87.1871
  }
];


get totalIncidentes(): number {
  return this.listInformes.length;
}

get totalEnEjecucion(): number {
  return this.getTotalPorEstado('ejecucion');
}

get totalPendientes(): number {
  return this.getTotalPorEstado('pendiente');
}

get totalFinalizados(): number {
  return this.getTotalPorEstado('finalizado');
}

get totalCancelados(): number {
  return this.getTotalPorEstado('cancelado');
}

getTotalPorEstado(status: string): number {
  return this.listInformes.filter(item => item.status === status).length;
}

getAgrupadoPor(campo: keyof IncidenteInforme) {
  const result = new Map<string, number>();

  this.listInformes.forEach(item => {
    const key = String(item[campo] ?? 'Sin dato');
    result.set(key, (result.get(key) ?? 0) + 1);
  });

  return Array.from(result.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
}
get incidentesPorRegion() {
  return this.getAgrupadoPor('region');
}

get incidentesPorTipo() {
  return this.getAgrupadoPor('incidente');
}

get incidentesPorEstado() {
  return this.getAgrupadoPor('status');
}

get incidentesPorLugar() {
  return this.getAgrupadoPor('lugar');
}
getTopLugares(limit: number = 5) {
  return this.incidentesPorLugar.slice(0, limit);
}

getMarkersMapa(): MarkerInforme[] {
  const markers = new Map<string, MarkerInforme>();

  this.listInformes.forEach(incidente => {
    const key = `${incidente.lat}-${incidente.lng}`;

    const current = markers.get(key);

    if (!current) {
      markers.set(key, {
        key,
        lat: incidente.lat,
        lng: incidente.lng,
        lugar: incidente.lugar,
        region: incidente.region,
        total: 1,
        incidentes: [incidente],
        unidades: [incidente.unidad]
      });

      return;
    }

    current.total += 1;
    current.incidentes.push(incidente);

    if (!current.unidades.includes(incidente.unidad)) {
      current.unidades.push(incidente.unidad);
    }
  });

  return Array.from(markers.values());
}


get markersInforme(): MapMarker[] {
  return this.listInformes.map((inc: any) => ({
    id: inc.id,
    lat: inc.lat,
    lng: inc.lng,
    title: inc.lugar,
    subtitle: `${inc.incidente} · Unidad ${inc.unidad}`,
    status: inc.status,
    total: 1,
    data: inc
  }));
}

  svFormData = inject(DataFormService);
  submitForm(data: iFormEmit){
    console.log("data::::: ", data)
    this.list = [...this.list, data.data];
  }
  listTimer = [
    {title: "recibido", time: 0},
    {title: "Despacho", time: 0},
    {title: "Desplazo", time: 0},
    {title: "Llegada", time: 0},
    {title: "finalizacion", time: 0},
    {title: "retorno", time: 0},
  ];



  list: any = [];

  columnasUsuarios: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'incidente_name', label: 'Nombre' },
    { key: 'incidente_dir', label: 'Correo' }
  ];


}
