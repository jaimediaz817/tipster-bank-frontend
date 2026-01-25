import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAmountBarChart } from './status-amount-bar-chart';

describe('StatusAmountBarChart', () => {
  let component: StatusAmountBarChart;
  let fixture: ComponentFixture<StatusAmountBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusAmountBarChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusAmountBarChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
