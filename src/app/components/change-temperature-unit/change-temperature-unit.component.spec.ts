import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTemperatureUnitComponent } from './change-temperature-unit.component';

describe('ChangeTemperatureUnitComponent', () => {
  let component: ChangeTemperatureUnitComponent;
  let fixture: ComponentFixture<ChangeTemperatureUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeTemperatureUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeTemperatureUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
