import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTabComponent } from './product-tab.component';

describe('ProductTabComponent', () => {
  let component: ProductTabComponent;
  let fixture: ComponentFixture<ProductTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTabComponent]
    });
    fixture = TestBed.createComponent(ProductTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
