import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HomeService } from '../home.service';
import { DetailDataService } from '../detail-data.service';
import { ItemDetailsComponent } from '../item-details/item-details.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @ViewChild(ItemDetailsComponent) itemDetailsComponent!: ItemDetailsComponent; // Reference to ItemDetailsComponent
  ebayData: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedItem: any | null = null;
  showItemDetails: boolean = false;
  itemId:string = '';
  Index: number = 0;
  isDataLoaded = false;
  showResult = false;
  showNoResult = false;
  activeComponent: string = 'result'; // Default active tab
  formData: any;
  showResultTable=false;
  isLoading: boolean = false;

  constructor(
    private homeService: HomeService,
    private detailDataService: DetailDataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    if(this.homeService.getStartLoadingData()){
      this.showResult = true;
      this.showResultTable = true;
      this.formData =this.homeService.getForm();
      if(this.detailDataService.getEbayData() !== null){
        this.ebayData = this.detailDataService.getEbayData();
        console.log('Ebay Data:', this.ebayData);
      }else{
        this.loadEbayData(this.formData);
      }
    }
  }

  loadEbayData(item:any) {
    this.isLoading = true;
    this.homeService.searchEbay(item).subscribe({
      next: (data) => {
        this.ebayData = data;
        this.detailDataService.setEbayData(this.ebayData);
        //console.log('Ebay Data:', this.ebayData);
        if(this.ebayData !== null){
          this.showResult = true;
          this.showNoResult = false;
          this.showResultTable = true;
        }else{
          this.showResult = true;
          this.showResultTable = false;
          this.showNoResult = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    }
    );
  }

  clearResult(){
    this.showResult = false;
  }

  loadResult(item:any){
    this.loadEbayData(item);
    this.activeComponent = 'result';
  }

  hideItemDetails() {
    this.showItemDetails = false;
  }

  selectItem(item: any) {
    this.isDataLoaded = false;
    this.selectedItem = item;
    this.showItemDetails = true;
    this.activeComponent = 'detail';

    if('Shipping' in item){
      console.log('Selected Item Shipping:', item.Shipping);
      this.homeService.setitemShippingDetail(item.Shipping);
    }

    if ('itemId' in item) {
      //console.log('Selected Item id:', item.itemId);
      this.itemId = item.itemId;
      this.detailDataService.setItemIndex(item.Index-1);
      //console.log('Selected Item index:', this.Index);
      //this.itemDetailsComponent.loadItemDetails();
      this.loadItemDetails(item.itemId);
    }
  }

  loadItemDetails(itemId:any){
    //console.log('Item id:', this.itemId);
    this.homeService.getSingleEbayItem(itemId).subscribe({
      next: (data) => {
        //console.log('Single Item Details:', data);
        this.detailDataService.setItemDetailsData(data);
        this.isDataLoaded = true;
        //this.cdr.detectChanges();
        //console.log('Single Item data.Title:', this.data.Title);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    }
    );
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  onPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNextPage() {
    const totalPages = Math.ceil(this.ebayData.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  getPaginationArray(): number[] {
    const totalPages = Math.ceil(this.ebayData.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getCurrentPageData(): any[] {
    if(this.ebayData !== null){
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.ebayData.slice(startIndex, endIndex);
    }
    return [];
  }

  addToWishList(item: any) {
    console.log('addToWishList() item:', item);
    item.isInWishList = true;
    const data = {
      Title: item.Title,
      Price: item.Price,
      Shipping: item.Shipping,
      Image: item.Image,
      itemId: item.itemId,
      itemIndex: item.Index-1
    };

    console.log('addToWishList() data:', data);

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

  detailRecord:boolean = false;
  showDetailRecord(){
    this.showResultTable = false;
    this.detailRecord = true;
  }

  backToResult(){
    this.activeComponent = 'result';
    this.detailDataService.setItemDetailsData(null);
  }

}

