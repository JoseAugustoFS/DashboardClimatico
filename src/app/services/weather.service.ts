import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  //https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2024-01-20&end_date=2025-01-20&hourly=temperature_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m
  //https://open-meteo.com/en/docs/historical-weather-api

  public getWeather(latitude: number, longitude: number): any{
    // this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,snowfall,wind_speed_10m,wind_direction_10m&forecast_days=1`).subscribe(res => {
    //   console.log(res)
    // });
  }


}
