import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantDetailPage } from './merchant-detail.page';

describe('MerchantDetailPage', () => {
  let component: MerchantDetailPage;
  let fixture: ComponentFixture<MerchantDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MerchantDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
