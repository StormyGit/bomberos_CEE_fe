import { estaciones } from './../../types/cce/incidente.interface';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';
import { BomberosMantenimiento } from '../../service/bomberos-mantenimiento';

export interface MapPoint {
  lat: number;
  lng: number;
}
export enum pointsMaps {
  estaciones, hidrantes
}

@Component({
  selector: 'app-map-picker',
  imports: [],
  templateUrl: './map-picker.html',
  styleUrl: './map-picker.css',
})
export class MapPickerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  @Input() height: string = '350px';

  @Input() center: MapPoint = {
    lat: 14.0723,
    lng: -87.1921
  };

  @Input() zoom: number = 13;

  @Output() pointSelected = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  svrBomberosMantenimiento = inject(BomberosMantenimiento);
  listEstaciones = this.svrBomberosMantenimiento.getAllEstaciones();



  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private refreshTimers: number[] = [];

  private pointsLayer = L.layerGroup();


  private selectedPointLayer = L.layerGroup();
  private nearestStationLayer = L.layerGroup();
  private nearestStationLineLayer = L.layerGroup();

  private handleMapClickFindNearest = (event: L.LeafletMouseEvent): void => {
    this.showSelectedPointAndNearestStation(
      event.latlng.lat,
      event.latlng.lng
    );
  };


  ngAfterViewInit(): void {
    this.initMap();
    this.observeResize();
    this.refreshMap();
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

    this.map.whenReady(() => {
      this.refreshMap();
    });
    this.pointsLayer.addTo(this.map);
    this.showPoint(this.center.lat, this.center.lng);

    this.enableOnlyPointOnClick();
    //this.enableFindNearestStationOnClick();
    //this.disableFindNearestStationOnClick();
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

  // PUNTOS DRAWS
  private addPoint(title:string, lat:number, lng:number): void {
    if (!this.map) return;

    const marker = L.circleMarker([lat, lng], {
      radius: 10,
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 1,
      weight: 2
    });

    marker.bindPopup(this.getPointPopup(title, "", lat, lng));

    marker.addTo(this.pointsLayer);
  }
  public showPoint(lat:number, lng:number): void {
    if (!this.map) return;

    this.listEstaciones.forEach(est => {
      //console.log(this.listEstaciones);
      this.addPoint(est.nombre, est.point.y, est.point.x);
    });

    this.map.setView([lat, lng, this.zoom]);
  }

  private getPointPopup(title:string, subtitle:string, lat:number, lng:number): string {
    const _title = this.escapeHtml(title ?? 'Punto');
    const _subtitle = this.escapeHtml(subtitle ?? '');

    return `
      <div style="min-width: 160px">
        <strong>${_title}</strong><br>
        ${subtitle ? `<span>${subtitle}</span><br>` : ''}
        <span>Latitud: ${lat}</span><br>
        <span>Longitud: ${lng}</span>
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

  // COLOCAR PUNTO
  public enableFindNearestStationOnClick(): void {
    if (!this.map) return;

    this.ensureNearestStationLayers();

    this.map.off('click', this.handleMapClickFindNearest);
    this.map.on('click', this.handleMapClickFindNearest);
  }

  public disableFindNearestStationOnClick(): void {
    if (!this.map) return;

    this.map.off('click', this.handleMapClickFindNearest);
  }

  private ensureNearestStationLayers(): void {
    if (!this.map) return;

    if (!this.map.hasLayer(this.selectedPointLayer)) {
      this.selectedPointLayer.addTo(this.map);
    }

    if (!this.map.hasLayer(this.nearestStationLayer)) {
      this.nearestStationLayer.addTo(this.map);
    }

    if (!this.map.hasLayer(this.nearestStationLineLayer)) {
      this.nearestStationLineLayer.addTo(this.map);
    }
  }
  public showSelectedPointAndNearestStation(lat: number, lng: number): void {
    if (!this.map) return;

    this.ensureNearestStationLayers();

    this.selectedPointLayer.clearLayers();
    this.nearestStationLayer.clearLayers();
    this.nearestStationLineLayer.clearLayers();

    const nearest = this.findNearestStation(lat, lng);

    const selectedMarker = L.circleMarker([lat, lng], {
      radius: 9,
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 1,
      weight: 2
    });

    selectedMarker.bindPopup(`
      <div style="min-width: 160px">
        <strong>Punto seleccionado</strong><br>
        <span>Latitud: ${lat}</span><br>
        <span>Longitud: ${lng}</span>
      </div>
    `);

    selectedMarker.addTo(this.selectedPointLayer);

    if (!nearest) {
      selectedMarker.openPopup();
      return;
    }

    const stationLat = nearest.estacion.point.y;
    const stationLng = nearest.estacion.point.x;

    const stationMarker = L.circleMarker([stationLat, stationLng], {
      radius: 30,
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 0.2,
      weight: 3
    });

    stationMarker.bindPopup(`
      <div style="min-width: 180px">
        <strong>Estación más cercana</strong><br>
        <span>${this.escapeHtml(nearest.estacion.nombre)}</span><br>
        <span>Distancia: ${nearest.distanceKm.toFixed(2)} km</span><br>
        <span>Latitud: ${stationLat}</span><br>
        <span>Longitud: ${stationLng}</span>
      </div>
    `);

    stationMarker.addTo(this.nearestStationLayer);

    const line = L.polyline(
      [
        [lat, lng],
        [stationLat, stationLng]
      ],
      {
        color: '#16a34a',
        weight: 3,
        opacity: 0.8
      }
    );

    line.addTo(this.nearestStationLineLayer);

    const bounds = L.latLngBounds([
      [lat, lng],
      [stationLat, stationLng]
    ]);

    this.map.fitBounds(bounds, {
      padding: [40, 40]
    });

    selectedMarker.openPopup();

    console.log('Estación más cercana:', nearest.estacion);
    console.log('Distancia metros:', nearest.distanceMeters);
    console.log('Distancia km:', nearest.distanceKm);
  }

  private findNearestStation(
    lat: number,
    lng: number
  ): {
    estacion: any;
    distanceMeters: number;
    distanceKm: number;
  } | null {
    if (!this.listEstaciones || this.listEstaciones.length === 0) {
      return null;
    }

    let nearestStation: any = null;
    let nearestDistance = Infinity;

    const selectedLatLng = L.latLng(lat, lng);

    this.listEstaciones.forEach(estacion => {
      const stationLat = estacion.point.y; // latitud
      const stationLng = estacion.point.x; // longitud

      const stationLatLng = L.latLng(stationLat, stationLng);

      const distanceMeters = selectedLatLng.distanceTo(stationLatLng);

      if (distanceMeters < nearestDistance) {
        nearestDistance = distanceMeters;
        nearestStation = estacion;
      }
    });

    if (!nearestStation) return null;

    return {
      estacion: nearestStation,
      distanceMeters: nearestDistance,
      distanceKm: nearestDistance / 1000
    };
  }
  private handleMapClickOnlyPoint = (event: L.LeafletMouseEvent): void => {
    this.showOnlySelectedPoint(
      event.latlng.lat,
      event.latlng.lng
    );
  };

  public enableOnlyPointOnClick(): void {
    if (!this.map) return;

    this.ensureNearestStationLayers();

    // Apaga el click que busca estación cercana
    this.map.off('click', this.handleMapClickFindNearest);

    // Enciende el click que solo coloca punto
    this.map.off('click', this.handleMapClickOnlyPoint);
    this.map.on('click', this.handleMapClickOnlyPoint);
  }

  public disableOnlyPointOnClick(): void {
    if (!this.map) return;

    this.map.off('click', this.handleMapClickOnlyPoint);
  }
  public showOnlySelectedPoint(lat: number, lng: number): void {
    if (!this.map) return;

    this.ensureNearestStationLayers();

    this.selectedPointLayer.clearLayers();

    this.nearestStationLayer.clearLayers();
    this.nearestStationLineLayer.clearLayers();

    const selectedMarker = L.circleMarker([lat, lng], {
      radius: 9,
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 1,
      weight: 2
    });

    selectedMarker.bindPopup(`
      <div style="min-width: 160px">
        <strong>Punto seleccionado</strong><br>
        <span>Latitud: ${lat}</span><br>
        <span>Longitud: ${lng}</span>
      </div>
    `);

    selectedMarker.addTo(this.selectedPointLayer);

    this.map.setView([lat, lng], this.zoom);

    this.emitPointSelected(lat, lng);

    selectedMarker.openPopup();
  }

private emitPointSelected(lat: number, lng: number): void {
  console.log('EMITIENDO PUNTO:', { lat, lng });

  this.pointSelected.emit({
    lat,
    lng
  });
}
}
