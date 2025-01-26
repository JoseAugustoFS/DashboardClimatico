import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../../services/weather.service';
import { LocationService } from '../../../services/location.service';
import { ILocation } from '../../../interfaces/ilocation';


@Component({
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private weatherService: WeatherService = inject(WeatherService);
  private locationService = inject(LocationService)
  public location: ILocation | undefined = this.locationService.getLocation;
  public weatherData?: any;
  public unit: 'C' | 'F' | 'K' = this.weatherService.currentTemperatureUnit;

  ngOnInit(): void {

    this.weatherService.temperatureUnitChange.subscribe(unit => {
      this.getWeather();
      this.unit = unit;
    });

    this.locationService.locationChange.subscribe((location: ILocation) => {
      this.location = location;
      this.getWeather();
    });
    this.getWeather();
  }

  private getWeather(){
    if (this.location) {  
      this.weatherService.getCurrentWeather(this.location?.coordinates.lat, this.location?.coordinates.long).subscribe(weatherData => {
        this.weatherData = weatherData;
      });
    }
  }





}
