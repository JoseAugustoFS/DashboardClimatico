import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../../services/weather.service';
import { LocationSearchComponent } from '../../location-search/location-search.component';


@Component({
  standalone: true,
  imports: [LocationSearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private weatherService: WeatherService = inject(WeatherService);

  ngOnInit(): void {
    // console.log(Object.values(cities).filter(city => city.name.includes("Pará") && city.country.includes("BR")));
    this.weatherService.getWeather(52.52, 13.41);
     
  }

  

}
