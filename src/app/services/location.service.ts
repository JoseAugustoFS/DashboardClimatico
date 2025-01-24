import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ILocation } from '../interfaces/ilocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private location?: ILocation;
  private searchSubject = new Subject<string>();
  private locationChangeSubject = new Subject<ILocation>();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLocation = {
        name: localStorage.getItem('location-name'),
            coordinates: {
              lat : localStorage.getItem('location-lat'),
              long : localStorage.getItem('location-long')
            }
      };
      if (storedLocation.name) {
        this.location = storedLocation as unknown as ILocation;
      }
    }
  }

  get getLocation() {
    return this.location;
  }


  get locationChange(): Observable<ILocation> {
    return this.locationChangeSubject.asObservable();
  }


  set setLocation(location: ILocation) {
    this.location = location;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('location-name', location.name);
      localStorage.setItem('location-lat', ''+location.coordinates.lat);
      localStorage.setItem('location-long', ''+location.coordinates.long);
    }
    this.locationChangeSubject.next(location);
  }

  public search(search: string): void {
    this.searchSubject.next(search);
  }

  public searchLocation(): Observable<ILocation[]> {
    return this.searchSubject.pipe(
      switchMap((searchTerm: string) => {
        if (!searchTerm) {
          return of([]);
        }
        return this.http.get(`https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=geojson`);
      }),
      map((res: any) => {
        const features = res.features || [];
        return features.map((feature: any) => ({
          name: feature.properties.display_name,
          coordinates: {
            lat : feature.geometry.coordinates[1],
            long : feature.geometry.coordinates[0]
          }
        }));
      })
    );
  }
}
