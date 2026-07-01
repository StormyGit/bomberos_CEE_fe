import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList
} from '@angular/core';

import { WizardStepComponent } from '../wizard-step-component/wizard-step-component';

@Component({
  selector: 'app-wizard-component',
  imports: [],
  templateUrl: './wizard-component.html',
  styleUrl: './wizard-component.css',
})
export class WizardComponent implements AfterContentInit {

  @ContentChildren(WizardStepComponent)
  steps!: QueryList<WizardStepComponent>;

  @Input() showHeader: boolean = true;
  @Input() showButtons: boolean = true;
  @Input() finishText: string = 'Finalizar';

  @Output() finished = new EventEmitter<void>();
  @Output() stepChange = new EventEmitter<number>();

  currentIndex: number = 0;
  stepsArray: WizardStepComponent[] = [];

  ngAfterContentInit(): void {
    this.stepsArray = this.steps.toArray();
    this.setActiveStep(0);

    this.steps.changes.subscribe(() => {
      this.stepsArray = this.steps.toArray();
      this.setActiveStep(this.currentIndex);
    });
  }

  setActiveStep(index: number): void {
    if (index < 0) return;
    if (index >= this.stepsArray.length) return;

    this.stepsArray.forEach((step, i) => {
      step.active = i === index;
    });

    this.currentIndex = index;
    this.stepChange.emit(index);
  }

  next(): void {
    if (this.isLastStep()) {
      this.finished.emit();
      return;
    }

    this.setActiveStep(this.currentIndex + 1);
  }

  previous(): void {
    this.setActiveStep(this.currentIndex - 1);
  }

  goToStep(index: number): void {
    this.setActiveStep(index);
  }

  isFirstStep(): boolean {
    return this.currentIndex === 0;
  }

  isLastStep(): boolean {
    return this.currentIndex === this.stepsArray.length - 1;
  }
}
