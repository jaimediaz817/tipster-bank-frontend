import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreditsPage } from './client-credits-page';

describe('ClientCreditsPage', () => {
  let component: ClientCreditsPage;
  let fixture: ComponentFixture<ClientCreditsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreditsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCreditsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
