import { Component, Input } from '@angular/core';
import { incidente } from '../../../types/cce/incidente.interface';

@Component({
  selector: 'app-incidente-info-components',
  imports: [],
  templateUrl: './incidente-info-components.html',
  styleUrl: './incidente-info-components.css',
})
export class IncidenteInfoComponents {
  @Input() dataIncidente: incidente | null = null
}
