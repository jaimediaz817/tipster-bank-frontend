import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDonutChart } from './status-donut-chart';

describe('StatusDonutChart', () => {
  let component: StatusDonutChart;
  let fixture: ComponentFixture<StatusDonutChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusDonutChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDonutChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
