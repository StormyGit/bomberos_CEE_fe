import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, output, QueryList, Signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface iFilePreview {
  file: File;
  name: string;
  size: number;
  url?: string; // solo para imágenes
}

@Component({

  selector: 'app-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-component.html'
})
export class FormComponent {
  @ViewChildren('panelRef') panels!: QueryList<ElementRef<HTMLElement>>;


  @Input() Formulary: iFormGroup | null = null;
  @Output() getSubmit = new EventEmitter<iFormEmit>();

  _OpenSelectInput: string = "";
  //svrToast = inject(ToastService);

  // previews de archivos/imágenes seleccionados, por nombre de campo
  _filesPreview: { [fieldName: string]: iFilePreview[] } = {};

  _formGroup!: FormGroup;
  fb = inject(FormBuilder);

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    const controls: any = {};
    if (this.Formulary)
      this.Formulary.seccions.forEach(section => {
        section.field.forEach(field => {
          const validators = [];
          // required
          if (field.required) {
            validators.push(Validators.required);
          }
          // email
          if (field.type === 'email') {
            validators.push(Validators.email);
          }
          //max y min
          if (field.type === 'number'){
            if (field.max) validators.push(Validators.max(field.max))
            if (field.min) validators.push(Validators.max(field.min))
          }else{
            if (field.max) validators.push(Validators.maxLength(field.max))
            if (field.min) validators.push(Validators.maxLength(field.min))
          }

          // valor inicial: arreglo vacío para múltiple, null para único
          const initialValue = (field.type === 'image' || field.type === 'file')
            ? (field.file_Multiple ? [] : null)
            : '';

          controls[field.name] = [initialValue, validators];
        });
      });

    this._formGroup = this.fb.group(controls);
  }

  Sudmit(){
    console.log(this._formGroup.value);
    const dataForm: iFormEmit = {
      status: this._formGroup.valid,
      data: this._formGroup.invalid ? null : this._formGroup.value
    }
    this.getSubmit.emit(dataForm);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideAny = this.panels.some(panel =>
      panel.nativeElement.contains(event.target as Node)
    );

    if (!clickedInsideAny) {
      this._OpenSelectInput = "";
    }
  }

  selectOption(name: string, value: any) {
    console.log(name, value)
    this._formGroup.get(name)?.setValue(value);
    this._OpenSelectInput = '';
  }
  toggleSelect(name: string) {
    console.log(name);
    this._OpenSelectInput =
      this._OpenSelectInput === name ? '' : name;
  }

  // ---------- Archivos / Imágenes ----------

  // mapea field.file -> accept del input nativo
  getFileAccept(field: iFormField): string {
    switch (field.file) {
      case 'pdf':   return '.pdf,application/pdf';
      case 'word':  return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'excel': return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'png':   return '.png,image/png';
      case 'jpg':   return '.jpg,.jpeg,image/jpeg';
      default:      return field.type === 'image' ? 'image/*' : '*';
    }
  }

  // texto de ayuda bajo el dropzone
  getFileHint(field: iFormField): string {
    const tipo = field.file ? field.file.toUpperCase() : (field.type === 'image' ? 'JPG, PNG' : 'Cualquier archivo');
    return field.file_Multiple ? `${tipo} · puedes subir varios` : `${tipo} · un solo archivo`;
  }

  onFileChange(event: Event, field: iFormField) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const filesArray = Array.from(input.files);

    const previews: iFilePreview[] = filesArray.map(file => ({
      file,
      name: file.name,
      size: file.size,
      url: field.type === 'image' ? URL.createObjectURL(file) : undefined
    }));

    this._filesPreview[field.name] = previews;

    const value = field.file_Multiple ? filesArray : filesArray[0];
    this._formGroup.get(field.name)?.setValue(value);
    this._formGroup.get(field.name)?.markAsTouched();
    this._formGroup.get(field.name)?.markAsDirty();

    // limpia el input nativo para poder re-seleccionar el mismo archivo si se borra y se vuelve a elegir
    input.value = '';
  }

  removeFile(field: iFormField, index: number) {
    const current = this._filesPreview[field.name] ?? [];
    const removed = current[index];
    if (removed?.url) URL.revokeObjectURL(removed.url);

    current.splice(index, 1);
    this._filesPreview[field.name] = [...current];

    const value = field.file_Multiple
      ? current.map(p => p.file)
      : (current[0]?.file ?? null);

    this._formGroup.get(field.name)?.setValue(value);
    this._formGroup.get(field.name)?.markAsTouched();
    this._formGroup.get(field.name)?.markAsDirty();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
