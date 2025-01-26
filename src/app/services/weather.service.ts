import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { IHistoricalTemperature } from '../interfaces/ihistorical-temperature';
import { IHistoricalRain } from '../interfaces/ihistorical-rain';
import { IHistoricalWind } from '../interfaces/ihistorical-wind';

type temperature = 'C' | 'F' | 'K';
const YEAR_DIFERENCE: number = 1;

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private currentUnit: temperature = 'C';
  private temperatureUnitChangeSubject = new Subject<temperature>();
  private startDate?: string;
  private endDate?: string;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const unit = localStorage.getItem('temperatureUnit') ? localStorage.getItem('temperatureUnit') as temperature : 'C';
      this.currentUnit = unit;
    }
    this.setDates();
  }

  private setDates(): void {
    const today = new Date();
    const finalDate = new Date(today);
    finalDate.setDate(today.getDate() - 7);
    const initialDate = new Date(finalDate);
    initialDate.setFullYear(finalDate.getFullYear() - YEAR_DIFERENCE);
    this.startDate = initialDate.toISOString().split('T')[0];
    this.endDate = finalDate.toISOString().split('T')[0];
  }

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

  public getHistoricalTemperature(latitude: number, longitude: number): Observable<IHistoricalTemperature[]> {
    return this.http.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${this.startDate}&end_date=${this.endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean`)
      .pipe(
        map((response: any) => {
          const filteredData = response.daily.time.map((date: string, index: number) => {
            return {
              date: new Date(date),
              temperature_max: this.convertTemperature(response.daily.temperature_2m_max[index], this.currentUnit),
              temperature_min: this.convertTemperature(response.daily.temperature_2m_min[index], this.currentUnit),
              temperature_mean: this.convertTemperature(response.daily.temperature_2m_mean[index], this.currentUnit),
              apparent_temperature_max: this.convertTemperature(response.daily.apparent_temperature_max[index], this.currentUnit),
              apparent_temperature_min: this.convertTemperature(response.daily.apparent_temperature_min[index], this.currentUnit),
              apparent_temperature_mean: this.convertTemperature(response.daily.apparent_temperature_mean[index], this.currentUnit)
            };
          });
          return filteredData as IHistoricalTemperature[];
        })
      );
  }

  public getHistoricalRain(latitude: number, longitude: number): Observable<IHistoricalRain[]> {
    return this.http.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${this.startDate}&end_date=${this.endDate}&daily=precipitation_sum,rain_sum,snowfall_sum,precipitation_hours`)
      .pipe(
        map((response: any) => {
          const filteredData = response.daily.time.map((date: string, index: number) => {
            return {
              date: new Date(date),
              precipitation: response.daily.precipitation_sum[index],
              rain: response.daily.rain_sum[index],
              snowfall: response.daily.snowfall_sum[index],
              precipitation_hours: response.daily.precipitation_hours[index],
            };
          });
          return filteredData as IHistoricalRain[];
        })
      );
  }

  public getHistoricalWind(latitude: number, longitude: number): Observable<IHistoricalWind[]> {
    return this.http.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${this.startDate}&end_date=${this.endDate}&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant`)
      .pipe(
        map((response: any) => {
          const filteredData = response.daily.time.map((date: string, index: number) => {
            return {
              date: new Date(date),
              wind_speed: response.daily.wind_speed_10m_max[index],
              wind_gusts: response.daily.wind_gusts_10m_max[index],
              wind_direction: response.daily.wind_direction_10m_dominant[index],
            };
          });
          return filteredData as IHistoricalWind[];
        })
      );
  }

}
