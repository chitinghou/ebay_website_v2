import { Component } from '@angular/core';
import { HomeService } from '../home.service';
import { WishListItem } from '../wish-list-item.model';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})


export class WishListComponent {
  wishList: any[] = [];
  constructor (
    private homeService: HomeService,
    private detailDataService: DetailDataService) {
    this.loadWishList();
  }

  loadWishList(){
    this.homeService.getWishList().subscribe(
      (data: any) => {
        console.log('Wish List:', data);
        this.wishList = data;
      },
      (error) => { console.error('Error fetching Wish List:', error); }
    );
  }

  removeFromWishList(index:any,item: any){
    //item.isInWishList = false;
    //const item_id = this.wishList.findIndex((wishlistItem) => wishlistItem._id === item._id);
    //console.log('removeFromWishList() item_id:', item_id);
    console.log('removeFromWishList() index:', index);
    console.log('removeFromWishList() item:', item);


    var ebayData = this.detailDataService.getEbayData();
    console.log('ebayData:', ebayData);
    ebayData[item.itemIndex].isInWishList = false;
    console.log('ebayData:', ebayData);
    this.detailDataService.setEbayData(ebayData);

    if (index !== -1) {
      // If the item is already in the wish list, remove it
      this.wishList.splice(index, 1);
      this.homeService.deleteWishListItem(item._id).subscribe(
        (data: any) => {
          console.log('Wish List:', data);
          //this.wishList = data;
        },
        (error) => { console.error('Error fetching Wish List:', error); }
      );
    }
  }

  calculateTotal(): any {
    let total = 0;
    for (const item of this.wishList) {
      const priceAsNumber = parseFloat(item.Price); // Convert the string to a number
      if (!isNaN(priceAsNumber)) { // Check if the conversion is successful
        total += priceAsNumber;
      }
    }
    return total.toFixed(2); // Ensure the total is formatted as a decimal number with two decimal places
  }


  isDataLoaded = false;
  selectedItem: any | null = null;
  showItemDetails: boolean = false;
  itemId:string = '';
  Index: number = 0;
  activeComponent: string = 'wishlist'; // Default active tab

  selectItem(item: any) {
    this.isDataLoaded = false;
    this.selectedItem = item;
    this.showItemDetails = true;
    this.activeComponent = 'detail';

    console.log('Selected Item:', item);
    if('Shipping' in item){
      console.log('Selected Item Shipping:', item.Shipping);
      this.homeService.setitemShippingDetail(item.Shipping);
    }

    if ('itemId' in item) {
      //console.log('Selected Item id:', item.itemId);
      this.itemId = item.itemId;
      this.detailDataService.setItemIndex(item.Index-1);
      console.log('Selected Item index:', this.Index);
      //this.itemDetailsComponent.loadItemDetails();
      this.loadItemDetails(item.itemId);
    }
  }

  loadItemDetails(itemId:any){
    console.log('Item id:', this.itemId);
    this.homeService.getSingleEbayItem(itemId).subscribe({
      next: (data) => {
        console.log('Single Item Details:', data);
        this.detailDataService.setItemDetailsData(data);
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    }
    );
  }

  hideItemDetails() {
    this.showItemDetails = false;
  }

}



