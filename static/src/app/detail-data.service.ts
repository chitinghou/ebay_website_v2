import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailDataService {

  constructor() { }

  private itemDetailsData: any;
  private itemIndex: number = 0;
  private ebayData: any;

  setItemDetailsData(data: any) {
    this.itemDetailsData = data;
  }

  getItemDetailsData(): any {
    return this.itemDetailsData;
  }

  setItemIndex(index: number) {
    this.itemIndex = index;
  }

  getItemIndex(): number {
    return this.itemIndex;
  }

  getEbayData(): any {
    return this.ebayData;
  }

  setEbayData(data: any) {
    this.ebayData = data;
  }
}
