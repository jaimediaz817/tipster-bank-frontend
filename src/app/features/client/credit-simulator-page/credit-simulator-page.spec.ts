import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSimulatorPage } from './credit-simulator-page';

describe('CreditSimulatorPage', () => {
  let component: CreditSimulatorPage;
  let fixture: ComponentFixture<CreditSimulatorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditSimulatorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditSimulatorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
