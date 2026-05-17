import { TestBed } from '@angular/core/testing';

import { Joueur } from './joueur';

describe('Joueur', () => {
  let service: Joueur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Joueur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
