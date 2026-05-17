import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jouer } from './jouer';

describe('Jouer', () => {
  let component: Jouer;
  let fixture: ComponentFixture<Jouer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jouer],
    }).compileComponents();

    fixture = TestBed.createComponent(Jouer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
