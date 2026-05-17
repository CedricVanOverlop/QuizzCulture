import { TestBed } from '@angular/core/testing';

import { Partie } from './partie';

describe('Partie', () => {
  let service: Partie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Partie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
