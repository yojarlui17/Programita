import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TusviajesPage } from './tusviajes.page';

describe('TusviajesPage', () => {
  let component: TusviajesPage;
  let fixture: ComponentFixture<TusviajesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TusviajesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TusviajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
