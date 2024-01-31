import { Component } from '@angular/core';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-seller-tab',
  templateUrl: './seller-tab.component.html',
  styleUrls: ['./seller-tab.component.css']
})
export class SellerTabComponent {
  itemDetails: any;
  Index: number = 0;
  ebayData:any;
  sellerInfo: any;

  constructor(
    private detailDataService: DetailDataService
    ) {

      this.loadSellerInfo();
    }

  loadSellerInfo() {
    this.Index = this.detailDataService.getItemIndex();
    this.ebayData = this.detailDataService.getEbayData();
    this.sellerInfo = this.ebayData[this.Index].sellerInfo;
    console.log('Seller tab index:', this.Index);
    console.log('Seller tab ebayData:', this.ebayData);
    console.log('Seller tab shippingInfo:', this.sellerInfo);
  }

  getButtonClass(feedbackRatingStar: string): string {
    switch (feedbackRatingStar) {
      case 'Yellow':
        return 'btn-yellow';
      case 'Blue':
        return 'btn-blue';
      case 'Turquoise':
        return 'btn-turquoise';
      // Add more cases for other feedback rating stars
      default:
        return 'btn-default';
    }
  }

}
