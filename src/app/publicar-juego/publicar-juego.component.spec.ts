import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarJuegoComponent } from './publicar-juego.component';

describe('PublicarJuegoComponent', () => {
  let component: PublicarJuegoComponent;
  let fixture: ComponentFixture<PublicarJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicarJuegoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicarJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
