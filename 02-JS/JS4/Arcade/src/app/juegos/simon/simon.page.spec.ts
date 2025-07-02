import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimonPage } from './simon.page';

describe('SimonPage', () => {
  let component: SimonPage;
  let fixture: ComponentFixture<SimonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
