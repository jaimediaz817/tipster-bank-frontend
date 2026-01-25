import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCreditsPage } from './analyst-credits-page';

describe('AnalystCreditsPage', () => {
  let component: AnalystCreditsPage;
  let fixture: ComponentFixture<AnalystCreditsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystCreditsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystCreditsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
