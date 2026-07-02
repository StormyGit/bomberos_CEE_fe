import { inject, Injectable } from '@angular/core';
import { incidentes_list } from '../types/cce/incidente.interface';
import { BomberosMantenimiento } from '../service/bomberos-mantenimiento';

@Injectable({
  providedIn: 'root',
})
export class DataFormService {
  private svrBomberosMantenimiento = inject(BomberosMantenimiento);
  public login(): iFormGroup {
    return {
      seccions: [
        {
          title: 'login',
          showTitle: false,
          field:[
            {label:'Correo', type:'email', name:"email", w:1, placeholder:"Correo@gmail.com", required: true},
            {label:'Contraseña', type:'text', name:"password", w:1, required: true}
          ]
        }
      ]
    }
  }

  public incidente(type: 'info' | 'recursos'):iFormGroup{
    const incidente_list = incidentes_list().map((incidente) => ({
      label: incidente,
      value: incidente,
    }));
    const ahora = new Date();
    const fechaActual = ahora.toISOString().split("T")[0];
    const horaActual = ahora.toTimeString().slice(0, 5);

  const listEstaciones = this.svrBomberosMantenimiento.getAllEstaciones().map((i) => ({
      label: i.nombre,
      value: i.nombre,
    }));

    switch(type){
      case 'info':
        return {
          seccions:[
            {
              title: "informacion de incidente",
              showTitle: true,
              w: 1,
              field:[
                {label:'incidente', type:'select', name:"incidente", w:2, required: true, option: incidente_list},
                {label:'Colonia / barrio', type:'text', name:"colonia", w:2, required: true},
                {label:'punto de referencia', type:'text', name:"referencia", w:1, required: false},
                {label:'Dirección', type:'textarea', name:"direccion", w:1, required: true},
              ]
            },
            {
              title: "Datos del denunciante",
              showTitle: true,
              w: 2,
              field:[
                {label:'nombre', type:'text', name:"denunciante_nombre", w:1, required: true},
                {label:'telefono', type:'text', name:"denunciante_telefono", w:1, required: true},
              ]
            },
            {
              title: "informacion de recepcion",
              showTitle: true,
              w: 2,
              field:[
                {label:'Operador', type:'text', name:"recepcion_nombre", w:1, required: true},
                {label:'Hora y Fecha', type:'text', name:"recepcion_date", w:2, readonly: true, value: fechaActual + " " + horaActual},
                {label:'tipo', type:'select', name:"recepcion_tipo", w:2, required: true, option:[{label: "CCE", value: "cce"},{label: "911", value: "911"}]},
              ]
            }
          ]
        }
      break;
      case 'recursos':
        return {
          seccions:[
            {
              title: "Asignacion de Recursos",
              showTitle: true,
              w: 1,
              //rows: {min: 0, limit: null},
              field:[
                {label:'Estacion', type:'select', name:"recursos_est", w:3, required: true, option:listEstaciones},
                {label:'Unidades', type:'select', name:"recursos_uni", w:3, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
                {label:'Operador', type:'text', name:"recursos_oper", w:3, required: true},
                {label:'Encargado', type:'text', name:"recursos_encar", w:2, required: true},
                {label:'Personal', type:'number', name:"recursos_personal", w:5, required: true},
              ]
            },
          ]
        }
      break;
    }

    return {
      seccions:[
        {
          title: "Asignacion de Recursos",
          showTitle: true,
          w: 2,
          //rows: {min: 0, limit: null},
          field:[
            {label:'Estacion', type:'select', name:"recursos_est", w:3, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
            {label:'Unidades', type:'select', name:"recursos_uni", w:3, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
            {label:'Operador', type:'text', name:"recursos_oper", w:3, required: true},
            {label:'Encargado', type:'text', name:"recursos_encar", w:2, required: true},
            {label:'Personal', type:'number', name:"recursos_personal", w:2, required: true},
          ]
        },
        {
          title: "Resultado",
          showTitle: true,
          w: 2,
          field:[
            {label:'Propietario / Afectado', type:'text', name:"resultado_pro", w:3, required: true},
            {label:'Beneficiados', type:'text', name:"resultado_benf", w:3, required: true},
            {label:'Galones Agua', type:'text', name:"resultado_agua", w:3, required: true},
            {label:'Observaciones', type:'textarea', name:"resultado_obs", w:1, required: false}
          ]
        },
        {
          title: "Evidencias",
          showTitle: true,
          w: 2,
          field:[
            {label:'Foto del incidente', type:'image', name:"incidente_foto", file:'png', file_Multiple: true, readonly: true, w:2},
          ]
        }
      ]
    }
  }

}




            // {label:'rol', type:'select', name:"rol", required: true, w:1, option:[
            //   {label: "", value:null},
            //   {label: "Admin", value:"Admin"},
            //   {label: "Estudiante", value:"Estudiante"}
            // ]},
