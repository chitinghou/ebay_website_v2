import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarProductsTabComponent } from './similar-products-tab.component';

describe('SimilarProductsTabComponent', () => {
  let component: SimilarProductsTabComponent;
  let fixture: ComponentFixture<SimilarProductsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimilarProductsTabComponent]
    });
    fixture = TestBed.createComponent(SimilarProductsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
