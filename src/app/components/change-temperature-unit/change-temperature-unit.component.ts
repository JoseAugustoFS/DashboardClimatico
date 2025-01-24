import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-change-temperature-unit',
  imports: [],
  templateUrl: './change-temperature-unit.component.html',
  styleUrl: './change-temperature-unit.component.css'
})
export class ChangeTemperatureUnitComponent implements OnInit {

  private weatherService: WeatherService = inject(WeatherService);
  public unit: 'C' | 'F' | 'K' = this.weatherService.currentTemperatureUnit;

  ngOnInit(): void {
    this.weatherService.temperatureUnitChange.subscribe(unit => {
      this.unit = unit;
    });
  }


  onUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;  // Cast explícito para HTMLSelectElement
    const value = selectElement.value as 'C' | 'F' | 'K';
    this.unit = value;
    this.weatherService.setTemperatureUnit(value);
  }

}
