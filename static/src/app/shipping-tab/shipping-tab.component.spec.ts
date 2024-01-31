import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTabComponent } from './shipping-tab.component';

describe('ShippingTabComponent', () => {
  let component: ShippingTabComponent;
  let fixture: ComponentFixture<ShippingTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingTabComponent]
    });
    fixture = TestBed.createComponent(ShippingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
