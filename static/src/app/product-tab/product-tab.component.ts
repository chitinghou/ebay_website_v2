import { Component, Input, ViewChild, EventEmitter } from '@angular/core';
import { ImageModelComponent } from '../image-model/image-model.component';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.css']
})

export class ProductTabComponent{
  itemDetails: any;
  showModal?:boolean;
  currentImage: string = '';
  currentIndex: number = 0;

  constructor(
    private detailDataService: DetailDataService
    ) {
      this.loadItemDetails();
    }

  openModal(imageUrl: string) {
    console.log('Image URL:', imageUrl);
    this.currentImage = imageUrl;
    this.showModal = true;
    console.log('showModal:', this.showModal);
  }

  close(){
    this.showModal = false;
  }

  loadItemDetails(){
    this.itemDetails = this.detailDataService.getItemDetailsData();
  }

}



