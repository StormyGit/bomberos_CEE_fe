import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface NavbarChild {
  path: string;
  name: string;
}

interface NavbarButton {
  path: string | null;
  name: string;
  child?: NavbarChild[];
}

@Component({
  selector: 'app-navbar-component',
  imports: [],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {

  route = inject(Router);

  openIndex: number | null = null;

listButtons: NavbarButton[] = [
  { path: '/cce', name: 'Dashboard' },
  {
    path: null,
    name: 'Incidentes',
    child: [
      { path: '/cce/incidente', name: 'Información' },
      { path: '/cce/incidente/create', name: 'Informes' }
    ],
  },
  {
    path: 'inventario',
    name: 'Inventario',
  }
];

  clickButton(item: NavbarButton, index: number) {
    if (item.child && item.child.length > 0) {
      this.openIndex = this.openIndex === index ? null : index;
      return;
    }

    if (item.path) {
      this.irPagina(item.path);
    }
  }

  irPagina(path: string) {
    this.route.navigate([path]);
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  isActive(path: string | null): boolean {
    if (!path) return false;
    return this.route.url === path;
  }
}
