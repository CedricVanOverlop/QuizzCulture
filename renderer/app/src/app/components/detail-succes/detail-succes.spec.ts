import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSucces } from './detail-succes';

describe('DetailSucces', () => {
  let component: DetailSucces;
  let fixture: ComponentFixture<DetailSucces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSucces],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSucces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
