import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Partie } from './partie';

describe('Partie', () => {
  let component: Partie;
  let fixture: ComponentFixture<Partie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Partie],
    }).compileComponents();

    fixture = TestBed.createComponent(Partie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
