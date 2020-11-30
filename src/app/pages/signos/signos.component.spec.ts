import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosComponent } from './signos.component';

describe('SignosComponent', () => {
  let component: SignosComponent;
  let fixture: ComponentFixture<SignosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
