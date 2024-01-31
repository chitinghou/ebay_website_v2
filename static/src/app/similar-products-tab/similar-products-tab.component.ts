import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-similar-products-tab',
  templateUrl: './similar-products-tab.component.html',
  styleUrls: ['./similar-products-tab.component.css']
})
export class SimilarProductsTabComponent{
  itemDetails: any;
  similarProducts: any;
  showNoResult: boolean = false;
  constructor(
    private homeService: HomeService,
    private detailDataService: DetailDataService
    ) {
    this.loadSimilarProducts();
  }

  // Function to load thumbnailLinks when the tab is clicked
  loadSimilarProducts() {
    this.itemDetails = this.detailDataService.getItemDetailsData();
    if(this.itemDetails){
      console.log('loadSimilarProducts() itemDetails:', this.itemDetails);
      const itemId = this.itemDetails.ItemID;
      console.log('loadSimilarProducts() id:', itemId);
      const numResults = 8; // Replace with the number of results you want
      this.homeService.getSimilarItems(itemId).subscribe(
        (data: any) => {
          // Assuming that the response contains a "thumbnailLinks" field
          console.log('Similar Porducts:', data);
          this.similarProducts = data;
          if(this.similarProducts.length === 0){
            this.showNoResult = true;
          }
        },
        (error) => { console.error('Error fetching Google photos:', error); }
      );
    }

    //console.log('loadThumbnailLinks() itemDetails:', this.itemDetails);
    //console.log('this.itemDetails:', this.itemDetails);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemDetails'] && !changes['itemDetails'].firstChange) {
      console.log('ngOnChanges!');
      this.loadSimilarProducts() ;
    }
  }
}



