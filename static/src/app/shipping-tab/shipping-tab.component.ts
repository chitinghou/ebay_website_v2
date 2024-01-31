import { Component, Input} from '@angular/core';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-shipping-tab',
  templateUrl: './shipping-tab.component.html',
  styleUrls: ['./shipping-tab.component.css']
})

export class ShippingTabComponent{
  itemDetails: any;
  Index: number = 0;
  ebayData:any;
  shippingInfo: any;

  constructor(
    private detailDataService: DetailDataService
    ) {

      this.loadShippingInfo();
    }

  loadShippingInfo() {
    this.Index = this.detailDataService.getItemIndex();
    this.ebayData = this.detailDataService.getEbayData();
    this.shippingInfo = this.ebayData[this.Index].shippingInfo;
    console.log('shipping tab index:', this.Index);
    console.log('shipping tab ebayData:', this.ebayData);
    console.log('shipping tab shippingInfo:', this.shippingInfo);
  }
}
