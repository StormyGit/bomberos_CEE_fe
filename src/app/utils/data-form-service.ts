import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataFormService {

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
    switch(type){
      case 'info':
        return {
          seccions:[
            {
              title: "informacion de incidente",
              showTitle: true,
              w: 1,
              field:[
                {label:'incidente', type:'select', name:"incidente_name", w:2, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
                {label:'tipo', type:'select', name:"incidente_tipo", w:2, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
                {label:'Colonia / barrio', type:'text', name:"incidente_col", w:2, required: true},
                {label:'punto de referencia', type:'text', name:"incidente_pun", w:2, required: true},
                {label:'Dirección', type:'text', name:"incidente_dir", w:1, required: true},
              ]
            },
            {
              title: "Datos del denunciante",
              showTitle: true,
              w: 2,
              field:[
                {label:'nombre', type:'text', name:"denuncuante_name", w:1, required: true},
                {label:'telefono', type:'text', name:"denuncuante_telefono", w:1, required: true},
              ]
            },
            {
              title: "informacion de recepcion",
              showTitle: true,
              w: 2,
              field:[
                {label:'Operador', type:'text', name:"recepcion_telefono", w:1, required: true},
                {label:'Hora y Fecha', type:'text', name:"recepcion_date", w:2, required: true},
                {label:'tipo', type:'select', name:"recepcion_tipo", w:2, required: true, option:[{label: "CCE", value: "CCE"},{label: "911", value: "911"}]},
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
                {label:'Estacion', type:'select', name:"recursos_est", w:3, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
                {label:'Unidades', type:'select', name:"recursos_uni", w:3, required: true, option:[{label: "opcion 1", value: "opcion 1"}]},
                {label:'Operador', type:'text', name:"recursos_oper", w:3, required: true},
                {label:'Encargado', type:'text', name:"recursos_encar", w:2, required: true},
                {label:'Personal', type:'number', name:"recursos_personal", w:2, required: true},
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
