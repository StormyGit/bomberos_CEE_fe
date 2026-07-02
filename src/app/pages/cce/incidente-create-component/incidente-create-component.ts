import { Component, inject } from '@angular/core';
import { TableColumn, TableCustomComponent } from "../../../components/table-custom/table-custom"
import { CardComponent } from "../../../components/card-component/card-component";
import { ModalComponent } from "../../../components/modal-component/modal-component";
import { WizardComponent } from "../../../components/wizard-component/wizard-component";
import { WizardStepComponent } from '../../../components/wizard-step-component/wizard-step-component';
import { FormComponent } from "../../../components/form-component/form-component";
import { DataFormService } from '../../../utils/data-form-service';
import { MapPickerComponent, MapPoint } from "../../../components/map-picker/map-picker";
import { IncidenteInfoComponents } from "../../components/incidente-info-components/incidente-info-components";
import { BadgeComponent } from "../../../components/badge-component/badge-component";
import { incidente } from '../../../types/cce/incidente.interface';



@Component({
  selector: 'app-incidente-create-component',
  imports: [CardComponent, TableCustomComponent, ModalComponent, WizardComponent, WizardStepComponent, FormComponent, MapPickerComponent, IncidenteInfoComponents, BadgeComponent],
  templateUrl: './incidente-create-component.html',
  styleUrl: './incidente-create-component.css',
})
export class IncidenteCreateComponent {

  ubicacionSeleccionada: MapPoint | null = null;

  obtenerPunto(point: MapPoint) {
    this.ubicacionSeleccionada = point;

    console.log('Latitud:', point.lat);
    console.log('Longitud:', point.lng);
  }

onPointSelected(point: { lat: number; lng: number }): void {
  console.log('PUNTO RECIBIDO EN PADRE:', point);

  this.incidente_create = {
    ...(this.incidente_create ?? {}),
    punto: {
      x: point.lng,
      y: point.lat
    }
  };

  console.log('incidente_create:', this.incidente_create);
}

  incidente_selection: incidente | null = null;
  incidente_create: incidente | null = {};

list: any[] = [
  { id:0, status: 'ejecucion', lugar: 'Col. Ayestas', region: 'Tegucigalpa', incidente: 'Incendio estructural', unidad: 'B-12', fecha: '2026-07-01', hora: '08:15' },
  { id:1, status: 'ejecucion', lugar: 'Barrio La Granja', region: 'Tegucigalpa', incidente: 'Persona herida', unidad: 'A-04', fecha: '2026-07-01', hora: '08:45' },
  { id:2, status: 'ejecucion', lugar: 'Col. Kennedy', region: 'Tegucigalpa', incidente: 'Accidente vehicular', unidad: 'R-07', fecha: '2026-07-01', hora: '09:10' },
  { id:3, status: 'pendiente', lugar: 'Col. Las Brisas', region: 'Comayagüela', incidente: 'Disturbios', unidad: 'Pendiente', fecha: '2026-07-01', hora: '09:35' },
  { id:4, status: 'pendiente', lugar: 'Mercado Zonal Belén', region: 'Comayagüela', incidente: 'Alarma activada', unidad: 'Pendiente', fecha: '2026-07-01', hora: '10:00' },
  { id:5, status: 'pendiente', lugar: 'Col. San Miguel', region: 'Tegucigalpa', incidente: 'Fuga de gas', unidad: 'Pendiente', fecha: '2026-07-01', hora: '10:25' },
  { id:6, status: 'pendiente', lugar: 'Residencial Honduras', region: 'Tegucigalpa', incidente: 'Árbol caído', unidad: 'Pendiente', fecha: '2026-07-01', hora: '11:00' },
  { id:7, status: 'finalizado', lugar: 'Col. El Carrizal', region: 'Comayagüela', incidente: 'Quema de basura', unidad: 'B-02', fecha: '2026-07-01', hora: '11:30' },
  { id:8, status: 'finalizado', lugar: 'Anillo Periférico', region: 'Tegucigalpa', incidente: 'Derrame de combustible', unidad: 'R-03', fecha: '2026-07-01', hora: '12:05' },
  { id:9, status: 'cancelado', lugar: 'Col. Miraflores', region: 'Tegucigalpa', incidente: 'Falsa alarma', unidad: 'N/A', fecha: '2026-07-01', hora: '12:40' },
  { id:10, status: 'pendiente', lugar: 'Col. Hato de Enmedio', region: 'Tegucigalpa', incidente: 'Rescate animal', unidad: 'Pendiente', fecha: '2026-07-01', hora: '13:15' },
  { id:11, status: 'ejecucion', lugar: 'Bulevar Suyapa', region: 'Tegucigalpa', incidente: 'Emergencia médica', unidad: 'A-09', fecha: '2026-07-01', hora: '13:50' }
];

columnasUsuarios: TableColumn[] = [
  { key: 'status', label: 'Estado', type: 'badge' },
  { key: 'region', label: 'Región' },
  { key: 'lugar', label: 'Lugar' },
  { key: 'incidente', label: 'Incidente' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'hora', label: 'Hora' }
];


getListEjecucion() {
  return this.list.filter((item: any) => item.status === 'ejecucion');
}
getCountByStatus(status: string): number {
  return this.list.filter((item: any) => item.status === status).length;
}

actions = [
  {
    key: 'view',
    label: 'Ver',
    class: 'btn btn-sm btn-blue'
  },
  {
    key: 'edit',
    label: 'Editar',
    class: 'btn btn-sm btn-yellow'
  },
  {
    key: 'delete',
    label: 'Eliminar',
    class: 'btn btn-sm btn-red'
  }
];
onTableAction(event: any): void {
  console.log(event.action);
  console.log(event.row);

  if (event.action === 'view') {
    console.log('Ver registro', event.row);
    this.showModal_detalles = true;
  }

  if (event.action === 'edit') {
    console.log('Editar registro', event.row);
  }

  if (event.action === 'delete') {
    console.log('Eliminar registro', event.row);
  }
}

listTimer = [
  {
    key: 'reporte',
    title: 'Hora de reporte',
    description: 'Momento en que se recibe el incidente'
  },
  {
    key: 'despacho',
    title: 'Hora de despacho',
    description: 'Momento en que se asigna la unidad'
  },
  {
    key: 'salida',
    title: 'Salida de estación',
    description: 'Unidad sale hacia el lugar'
  },
  {
    key: 'llegada',
    title: 'Llegada al lugar',
    description: 'Unidad llega a la escena'
  },
  {
    key: 'controlado',
    title: 'Incidente controlado',
    description: 'La emergencia queda bajo control'
  },
  {
    key: 'finalizado',
    title: 'Finalización',
    description: 'Cierre operativo del incidente'
  }
];

showModal: boolean = false;
showModal_detalles: boolean = false;

abrirModal() {
  this.showModal = true;
}

cerrarModal() {
  this.showModal = false;
}

guardarWizard() {
  console.log('Wizard finalizado');
  this.cerrarModal();
}


abrirModal_detalles() {
  this.showModal_detalles = true;
}

cerrarModal_detalles() {
  this.showModal_detalles = false;
}



  svFormData = inject(DataFormService);
  submitForm_info(data: iFormEmit) {
    const newData = this.removeEmptyValues(data.data);

    this.incidente_create = {
      ...(this.incidente_create ?? {}),
      ...newData
    };

    console.log('incidente_create:', this.incidente_create);
  }

  private removeEmptyValues<T extends object>(obj: T): Partial<T> {
    const cleanObject: Partial<T> = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanObject[key as keyof T] = value as T[keyof T];
      }
    });

    return cleanObject;
  }
}
