import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiedraPapelTijerasPage } from './piedra-papel-tijeras.page';

describe('PiedraPapelTijerasPage', () => {
  let component: PiedraPapelTijerasPage;
  let fixture: ComponentFixture<PiedraPapelTijerasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PiedraPapelTijerasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
