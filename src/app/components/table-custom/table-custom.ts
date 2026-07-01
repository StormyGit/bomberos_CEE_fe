import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { BadgeComponent } from '../badge-component/badge-component';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge';
}

export interface TableAction {
  key: string;
  label: string;
  class?: string;
  show?: (row: any) => boolean;
  disabled?: (row: any) => boolean;
}

export interface TableActionEvent {
  action: string;
  row: any;
  index: number;
}

@Component({
  selector: 'app-table-custom',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    BadgeComponent
  ],
  templateUrl: './table-custom.html',
  styleUrl: './table-custom.css'
})
export class TableCustomComponent implements AfterViewInit, OnChanges {

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  // Nuevo parámetro para botones
  @Input() actions: TableAction[] = [];

  // Señal hacia el componente padre
  @Output() actionClick = new EventEmitter<TableActionEvent>();

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private actionsColumnKey = '__actions';

  get displayedColumns(): string[] {
    const columns = this.columns.map(column => column.key);

    if (this.actions.length > 0) {
      return [...columns, this.actionsColumnKey];
    }

    return columns;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
  }

  onActionClick(action: TableAction, row: any, index: number): void {
    this.actionClick.emit({
      action: action.key,
      row,
      index
    });
  }

  isActionVisible(action: TableAction, row: any): boolean {
    return action.show ? action.show(row) : true;
  }

  isActionDisabled(action: TableAction, row: any): boolean {
    return action.disabled ? action.disabled(row) : false;
  }
}
