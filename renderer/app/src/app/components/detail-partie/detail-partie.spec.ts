import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPartie } from './detail-partie';

describe('DetailPartie', () => {
  let component: DetailPartie;
  let fixture: ComponentFixture<DetailPartie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPartie],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPartie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
