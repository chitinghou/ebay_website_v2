import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { HomeService } from '../home.service';
import { PhotosTabComponent } from '../photos-tab/photos-tab.component';
import {DetailDataService} from '../detail-data.service';
import {ShippingTabComponent} from '../shipping-tab/shipping-tab.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit,OnChanges{
  @Input() itemId : string = '';
  @Input() Index : number = 0;
  item:any;
  data : any = {};
  //itemId = '132961484706';
  constructor(
    private homeService: HomeService,
    private detailDataService: DetailDataService
    ) {}
  // Make a GET request to retrieve details for the item
  ngOnInit(): void {
    // this.itemId = this.data.itemId;
    // this.loadItemDetails();
    this.item = this.detailDataService.getItemDetailsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId'] && !changes['itemId'].firstChange) {
      this.loadItemDetails();
      this.item = this.detailDataService.getItemDetailsData();
      console.log('item details index:', this.Index);
    }
  }
  loadItemDetails(){
    //console.log('Item id:', this.itemId);
    // this.homeService.getSingleEbayItem(this.itemId).subscribe({
    //   next: (data) => {
    //     this.data = data;
    //     console.log('Single Item Details:', this.data);
    //     this.detailDataService.setItemDetailsData(this.data);
    //     //console.log('Single Item data.Title:', this.data.Title);
    //   },
    //   error: (error) => {
    //     console.error('Error:', error);
    //   }
    // }
    // );
    this.data = this.detailDataService.getEbayData();
  }

  activeTab: string = 'product'; // Default active tab

  // Function to switch between tabs
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // @ViewChild(PhotosTabComponent) photosTabComponent!: PhotosTabComponent;

  // openPhotosTab(){
  //   this.activeTab = 'photos';
  //   console.log('openPhotosTab()');
  //   this.photosTabComponent.loadThumbnailLinks();

  // }


  // @ViewChild(PhotosTabComponent) shippingTabComponent!: ShippingTabComponent;
  // openShippingTab(){
  //   this.activeTab = 'shipping';
  //   this.shippingTabComponent.loadShippingInfo();
  // }
  shareOnFacebook() {
    const item = this.detailDataService.getItemDetailsData();
    console.log('shareOnFacebook() item:', item);
    const productName = item.Title; // Replace with the actual property name
    const price = item.Price; // Replace with the actual property name
    const link = item.itemURL; // Replace with the actual property name

    // Construct the custom message
    const message = `Buy ${productName} at ${price} from ${link} below.`;
    console.log('shareOnFacebook() message:', message);
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Construct the Facebook sharing URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=${encodedMessage}`;

    // Open the Facebook sharing dialog in a new window
    window.open(facebookShareUrl, '_blank');

    // You can also use a library like ngx-clipboard to copy the link to the clipboard if needed.
  }


  addToWishList(item: any) {
    const shipping = this.homeService.getitemShippingDetail();
    console.log('addToWishList() shipping:', shipping);
    console.log('addToWishList() item:', item);
    item.isInWishList = true;
    const data = {
      Title: item.Title,
      Price: item.Price,
      Shipping: shipping ,
      Image: item.productImages[0],
    };

    this.homeService.addToWishList(data).subscribe(
      (response) => {
        console.log('Data inserted successfully:', response);
        item._id = response._id;
      },
      (error) => {
        console.error('Error inserting data:', error);
      }
    );
  }


  removeToWishList(item:any){
    console.log('removeToWishList() item:', item);
    item.isInWishList = false;
    this.homeService.deleteWishListItem(item._id).subscribe(
      (data: any) => {
        console.log('Wish List:', data);
        //this.wishList = data;
      },
      (error) => { console.error('Error fetching Wish List:', error); }
    );
  }


}


