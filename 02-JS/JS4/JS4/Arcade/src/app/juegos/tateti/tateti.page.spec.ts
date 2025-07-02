import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TatetiPage } from './tateti.page';

describe('TatetiPage', () => {
  let component: TatetiPage;
  let fixture: ComponentFixture<TatetiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TatetiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
