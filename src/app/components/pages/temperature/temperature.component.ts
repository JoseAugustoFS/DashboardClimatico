import { Component, inject, OnInit } from '@angular/core';
import { ILocation } from '../../../interfaces/ilocation';
import { LocationService } from '../../../services/location.service';
import { WeatherService } from '../../../services/weather.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { IHistoricalTemperature } from '../../../interfaces/ihistorical-temperature';

@Component({
  selector: 'app-temperature',
  imports: [BaseChartDirective],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent implements OnInit {

  private weatherService: WeatherService = inject(WeatherService);
  private locationService = inject(LocationService)
  public location: ILocation | undefined = this.locationService.getLocation;
  public temperatureData: IHistoricalTemperature[] = [];
  public unit: 'C' | 'F' | 'K' = this.weatherService.currentTemperatureUnit;

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartTemperatureData?: ChartConfiguration<'bar'>['data'];
  public barChartApparentTemperatureData?: ChartConfiguration<'bar'>['data'];

  public maxTemperature?: number;
  public maxTemperatureDate?: Date;
  public minTemperature?: number;
  public minTemperatureDate?: Date;
  public maxApparentTemperature?: number;
  public maxApparentTemperatureDate?: Date;
  public minApparentTemperature?: number;
  public minApparentTemperatureDate?: Date;



  ngOnInit(): void {

    this.weatherService.temperatureUnitChange.subscribe(unit => {
      this.getTemperature();
      this.unit = unit;
    });

    this.locationService.locationChange.subscribe((location: ILocation) => {
      this.location = location;
      this.getTemperature();
    });
    this.getTemperature();
  }

  private getTemperature() {
    if (this.location) {
      this.weatherService.getHistoricalTemperature(this.location?.coordinates.lat, this.location?.coordinates.long).subscribe(temperatureData => {
        this.temperatureData = temperatureData;

        this.maxTemperature = Math.max(...this.temperatureData?.map((weather: IHistoricalTemperature) => weather.temperature_max));
        this.maxTemperatureDate = this.temperatureData?.find((weather: IHistoricalTemperature) => weather.temperature_max === this.maxTemperature)?.date;
        this.minTemperature = Math.min(...this.temperatureData?.map((weather: IHistoricalTemperature) => weather.temperature_min));
        this.minTemperatureDate = this.temperatureData?.find((weather: IHistoricalTemperature) => weather.temperature_min === this.minTemperature)?.date;
        this.maxApparentTemperature = Math.max(...this.temperatureData?.map((weather: IHistoricalTemperature) => weather.apparent_temperature_max));
        this.maxApparentTemperatureDate = this.temperatureData?.find((weather: IHistoricalTemperature) => weather.apparent_temperature_max === this.maxApparentTemperature)?.date;
        this.minApparentTemperature = Math.min(...this.temperatureData?.map((weather: IHistoricalTemperature) => weather.apparent_temperature_min));
        this.minApparentTemperatureDate = this.temperatureData?.find((weather: IHistoricalTemperature) => weather.apparent_temperature_min === this.minApparentTemperature)?.date;

        this.updateChartData();
      });
    }
  }

  private updateChartData(): void {
    this.barChartTemperatureData = {
      labels: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.date.toLocaleDateString()),
      datasets: [
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.temperature_max), label: 'Temperatura máxima' },
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.temperature_min), label: 'Temperatura mínima' },
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.temperature_mean), label: 'Temperatura média' }
      ]
    }
    this.barChartApparentTemperatureData = {
      labels: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.date.toLocaleDateString()),
      datasets: [
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.apparent_temperature_max), label: 'Sensação térmica máxima' },
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.apparent_temperature_min), label: 'Sensação térmica mínima' },
        { data: this.temperatureData?.map((weather: IHistoricalTemperature) => weather.apparent_temperature_mean), label: 'Sensação térmica média' }
      ]
    }
  }


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: typeof window !== 'undefined' && window.innerWidth > 600 ?'top':'right' } }
  };

}
