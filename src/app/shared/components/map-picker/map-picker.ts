import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';

export interface MapPoint {
  lat: number;
  lng: number;
}

export interface MapMarker extends MapPoint {
  id?: number | string;
  title?: string;
  subtitle?: string;
  status?: string;
  total?: number;
  data?: any;
}

@Component({
  selector: 'app-map-picker',
  imports: [],
  templateUrl: './map-picker.html',
  styleUrl: './map-picker.css',
})
export class MapPickerComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  @Input() height: string = '350px';

  @Input() center: MapPoint = {
    lat: 14.0723,
    lng: -87.1921
  };

  @Input() zoom: number = 13;

  /**
   * Punto único seleccionado manualmente.
   */
  @Input() markerPosition: MapPoint | null = null;

  /**
   * Varios puntos enviados por el sistema.
   */
  @Input() markers: MapMarker[] = [];

  /**
   * Si está en false, el usuario no puede agregar puntos con click.
   */
  @Input() enablePicker: boolean = true;

  /**
   * Si está en true, el mapa se ajusta para mostrar todos los puntos.
   */
  @Input() fitBounds: boolean = true;

  @Output() pointSelected = new EventEmitter<MapPoint>();
  @Output() markerClicked = new EventEmitter<MapMarker>();

  private map?: L.Map;
  private marker?: L.CircleMarker;
  private markersLayer = L.layerGroup();
  private resizeObserver?: ResizeObserver;
  private refreshTimers: number[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.observeResize();
    this.refreshMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markerPosition'] && this.markerPosition && this.map) {
      this.setMarker(this.markerPosition, false);
      this.refreshMap();
    }

    if (changes['center'] && this.center && this.map) {
      this.map.setView([this.center.lat, this.center.lng], this.zoom);
      this.refreshMap();
    }

    if (changes['markers'] && this.map) {
      this.renderMarkers();
      this.refreshMap();
    }
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.center.lat, this.center.lng],
      zoom: this.zoom,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      if (!this.enablePicker) return;

      const point: MapPoint = {
        lat: event.latlng.lat,
        lng: event.latlng.lng
      };

      this.setMarker(point, true);
      this.pointSelected.emit(point);
    });

    if (this.markerPosition) {
      this.setMarker(this.markerPosition, false);
    }

    this.renderMarkers();

    this.map.whenReady(() => {
      this.refreshMap();
    });
  }

private renderMarkers(): void {
  if (!this.map) return;

  this.markersLayer.clearLayers();

  if (!this.markers || this.markers.length === 0) return;

  const bounds = L.latLngBounds([]);

  this.markers.forEach(item => {
    const style = this.getMarkerStyle(item.status);

    const circle = L.circleMarker([item.lat, item.lng], {
      radius: item.total && item.total > 1 ? 10 : 8,
      color: style.color,
      fillColor: style.fillColor,
      fillOpacity: 0.9,
      weight: 2
    });

    circle.bindPopup(this.getPopupContent(item));

    circle.on('click', () => {
      this.markerClicked.emit(item);
    });

    circle.addTo(this.markersLayer);

    bounds.extend([item.lat, item.lng]);
  });

  if (this.fitBounds && bounds.isValid()) {
    if (this.markers.length === 1) {
      const marker = this.markers[0];

      this.map.setView([marker.lat, marker.lng], this.zoom);
    } else {
      this.map.fitBounds(bounds, {
        padding: [30, 30]
      });
    }
  }
}

  private setMarker(point: MapPoint, openPopup: boolean = true): void {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([point.lat, point.lng]);
    } else {
      this.marker = L.circleMarker([point.lat, point.lng], {
        radius: 8,
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 1,
        weight: 2
      }).addTo(this.map);
    }

    this.marker.bindPopup(`
      <strong>Ubicación seleccionada</strong><br>
      Latitud: ${point.lat}<br>
      Longitud: ${point.lng}
    `);

    if (openPopup) {
      this.marker.openPopup();
    }
  }

  private getMarkerStyle(status?: string): { color: string; fillColor: string } {
    const styles: Record<string, { color: string; fillColor: string }> = {
      pendiente: {
        color: '#ca8a04',
        fillColor: '#eab308'
      },
      ejecucion: {
        color: '#ea580c',
        fillColor: '#f97316'
      },
      asignado: {
        color: '#2563eb',
        fillColor: '#3b82f6'
      },
      en_camino: {
        color: '#0891b2',
        fillColor: '#06b6d4'
      },
      en_proceso: {
        color: '#ea580c',
        fillColor: '#f97316'
      },
      finalizado: {
        color: '#16a34a',
        fillColor: '#22c55e'
      },
      cancelado: {
        color: '#dc2626',
        fillColor: '#ef4444'
      }
    };

    return styles[status ?? ''] ?? {
      color: '#4b5563',
      fillColor: '#6b7280'
    };
  }

  private getPopupContent(marker: MapMarker): string {
    const title = this.escapeHtml(marker.title ?? 'Incidente');
    const subtitle = this.escapeHtml(marker.subtitle ?? '');
    const status = this.escapeHtml(marker.status ?? 'Sin estado');
    const total = marker.total ?? 1;

    return `
      <div style="min-width: 180px">
        <strong>${title}</strong><br>
        ${subtitle ? `<span>${subtitle}</span><br>` : ''}
        <span>Estado: ${status}</span><br>
        <span>Total: ${total}</span>
      </div>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  public refreshMap(): void {
    const delays = [0, 100, 300, 600];

    delays.forEach(delay => {
      const timer = window.setTimeout(() => {
        this.map?.invalidateSize();
      }, delay);

      this.refreshTimers.push(timer);
    });
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      this.refreshMap();
    });

    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.refreshTimers.forEach(timer => clearTimeout(timer));
    this.refreshTimers = [];

    this.resizeObserver?.disconnect();

    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = undefined;
    }
  }
}
