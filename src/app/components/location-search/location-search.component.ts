import { Component, inject, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ILocation } from '../../interfaces/ilocation';

@Component({
  selector: 'app-location-search',
  imports: [ReactiveFormsModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.css'
})
export class LocationSearchComponent implements OnInit {
  
  private locationService = inject(LocationService)
  public searchString?: string
  public locations: ILocation[] = [];
  public searchLocationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchLocationForm = this.fb.group({
      searchString: [this.locationService.getLocation?.name]
    });
  }

  ngOnInit(): void {
    this.locationService.searchLocation().subscribe(locations => {
      this.locations = locations;
    });

    this.searchLocationForm.get('searchString')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        if (searchTerm) {
          this.locationService.search(searchTerm);
        }else {
          this.locations = [];
        }
        return [];
      })
    ).subscribe();
  }

  selectLocation(location: ILocation): void {
    this.locationService.setLocation = location;
    this.searchString = location.name;
    this.locations = [];
  }

}
