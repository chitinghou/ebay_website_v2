import { Component } from '@angular/core';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-detail-record',
  templateUrl: './detail-record.component.html',
  styleUrls: ['./detail-record.component.css']
})
export class DetailRecordComponent {
  itemDetails: any;
  showModal?:boolean;
  currentImage: string = '';
  currentIndex: number = 0;

  constructor(
    private detailDataService: DetailDataService
  ){
    this.loadItemDetails();
  }

  loadItemDetails(){
    this.itemDetails = this.detailDataService.getItemDetailsData();
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
}
