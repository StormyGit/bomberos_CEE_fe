import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../components/layouts/navbar-component/navbar-component";

@Component({
  selector: 'app-cce-layout-component',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './cce-layout-component.html',
  styleUrl: './cce-layout-component.css',
})
export class CceLayoutComponent {
  Departamento: string = "Centro de Coordinacion de Emergencias";
  Region: string = "Tegucigalpa";
}
