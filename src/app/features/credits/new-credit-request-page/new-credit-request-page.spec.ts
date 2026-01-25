import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreditRequestPage } from './new-credit-request-page';

describe('NewCreditRequestPage', () => {
  let component: NewCreditRequestPage;
  let fixture: ComponentFixture<NewCreditRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCreditRequestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCreditRequestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
