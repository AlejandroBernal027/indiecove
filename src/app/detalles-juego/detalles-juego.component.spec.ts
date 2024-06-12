import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesJuegoComponent } from './detalles-juego.component';

describe('DetallesJuegoComponent', () => {
  let component: DetallesJuegoComponent;
  let fixture: ComponentFixture<DetallesJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallesJuegoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallesJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
