import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard-step',
  imports: [],
  templateUrl: './wizard-step-component.html',
  styleUrl: './wizard-step-component.css',
})
export class WizardStepComponent {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';

  active: boolean = false;
}
