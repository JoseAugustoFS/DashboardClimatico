import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { RainComponent } from './components/pages/rain/rain.component';
import { TemperatureComponent } from './components/pages/temperature/temperature.component';
import { WindComponent } from './components/pages/wind/wind.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'temperature',
        component: TemperatureComponent,
    },
    {
        path: 'rain',
        component: RainComponent,
    },
    {
        path: 'wind',
        component: WindComponent,
    },
    {
        path: '**', 
        redirectTo: ''
    },
];
