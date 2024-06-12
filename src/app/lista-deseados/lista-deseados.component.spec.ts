import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeseadosComponent } from './lista-deseados.component';

describe('ListaDeseadosComponent', () => {
  let component: ListaDeseadosComponent;
  let fixture: ComponentFixture<ListaDeseadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaDeseadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaDeseadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
