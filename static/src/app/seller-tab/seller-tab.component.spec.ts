import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerTabComponent } from './seller-tab.component';

describe('SellerTabComponent', () => {
  let component: SellerTabComponent;
  let fixture: ComponentFixture<SellerTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerTabComponent]
    });
    fixture = TestBed.createComponent(SellerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
