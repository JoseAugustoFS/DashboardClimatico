import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { ICurrentWeather } from '../interfaces/icurrent-weather';

type temperature = 'C' | 'F' | 'K';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private currentUnit: temperature = 'C';
  private temperatureUnitChangeSubject = new Subject<temperature>();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const unit = localStorage.getItem('temperatureUnit') ? localStorage.getItem('temperatureUnit') as temperature : 'C';
      this.currentUnit = unit;
    }
  }

  //https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2024-01-20&end_date=2025-01-20&hourly=temperature_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m
  //https://open-meteo.com/en/docs/historical-weather-api

  private convertTemperature(temp: number, toUnit: temperature): number {
    let convertTemp: number = temp;
    if (toUnit === 'F') {
      convertTemp = (temp * 9 / 5) + 32;
    }
    if (toUnit === 'K') {
      convertTemp = temp + 273.15;
    }
    return parseFloat(convertTemp.toFixed(1));
  }

  get currentTemperatureUnit(): temperature {
    return this.currentUnit;
  }

  get temperatureUnitChange(): Observable<temperature> {
      return this.temperatureUnitChangeSubject.asObservable();
  }

  setTemperatureUnit(unit: temperature): void {
    this.currentUnit = unit;
    localStorage.setItem('temperatureUnit', unit);
    this.temperatureUnitChangeSubject.next(unit);
  }

  public getCurrentWeather(latitude: number, longitude: number): Observable<ICurrentWeather> {
    return this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,snowfall,wind_speed_10m,wind_direction_10m&forecast_days=1`)
      .pipe(
        map((response: any) => {
          const filteredData = {
            min_temperature: this.convertTemperature(Math.min(...response.hourly.temperature_2m), this.currentUnit),
            min_apparent_temperature: this.convertTemperature(Math.min(...response.hourly.apparent_temperature), this.currentUnit),
            max_temperature: this.convertTemperature(Math.max(...response.hourly.temperature_2m), this.currentUnit),
            max_apparent_temperature: this.convertTemperature(Math.max(...response.hourly.apparent_temperature), this.currentUnit),
            rain: Math.max(...response.hourly.rain),
            windSpeed: Math.max(...response.hourly.wind_speed_10m),
            windDirection: Math.round(response.hourly.wind_direction_10m.reduce((acc: any, value: any) => acc + value, 0) / response.hourly.wind_direction_10m.length),
            precipitationProbability: Math.max(...response.hourly.precipitation_probability),
            snowfall: Math.max(...response.hourly.snowfall)
          };
          return filteredData as ICurrentWeather;
        })
      );
  }


}
