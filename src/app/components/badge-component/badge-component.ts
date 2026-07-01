import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type EstadoIncidente =
  | 'pendiente'
  | 'asignado'
  | 'en_camino'
  | 'en_proceso'
  | 'finalizado'
  | 'cancelado';

@Component({
  selector: 'app-badge-component',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.css',
})
export class BadgeComponent {
  @Input() estado: EstadoIncidente | string = 'pendiente';

  get badgeLabel(): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      asignado: 'Asignado',
      en_camino: 'En camino',
      en_proceso: 'En proceso',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };

    return labels[this.estado] ?? this.estado;
  }

  get badgeClass(): string {
    const classes: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      asignado: 'bg-blue-100 text-blue-800 border-blue-300',
      en_camino: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      en_proceso: 'bg-orange-100 text-orange-800 border-orange-300',
      finalizado: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
    };

    return classes[this.estado] ?? 'bg-gray-100 text-gray-700 border-gray-300';
  }

  get dotClass(): string {
    const dots: Record<string, string> = {
      pendiente: 'bg-yellow-500',
      asignado: 'bg-blue-500',
      en_camino: 'bg-cyan-500',
      en_proceso: 'bg-orange-500',
      finalizado: 'bg-green-500',
      cancelado: 'bg-red-500',
    };

    return dots[this.estado] ?? 'bg-gray-400';
  }
}
