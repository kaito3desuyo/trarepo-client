import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutemapComponent } from './routemap.component';

describe('RoutemapComponent', () => {
  let component: RoutemapComponent;
  let fixture: ComponentFixture<RoutemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
