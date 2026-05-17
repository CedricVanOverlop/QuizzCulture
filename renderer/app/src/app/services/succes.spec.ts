import { TestBed } from '@angular/core/testing';

import { Succes } from './succes';

describe('Succes', () => {
  let service: Succes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Succes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
