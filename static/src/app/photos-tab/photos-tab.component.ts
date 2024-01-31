import { Component, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { DetailDataService } from '../detail-data.service';

@Component({
  selector: 'app-photos-tab',
  templateUrl: './photos-tab.component.html',
  styleUrls: ['./photos-tab.component.css']
})
export class PhotosTabComponent {
  itemDetails: any;
  thumbnailLinks: string[] = []; // Array of thumbnail links
  chunks :any; // Array of arrays of thumbnail links

  constructor(
    private homeService: HomeService,
    private detailDataService: DetailDataService
    ) {
    this.loadThumbnailLinks();
  }

  // Function to load thumbnailLinks when the tab is clicked
  loadThumbnailLinks() {
    this.itemDetails = this.detailDataService.getItemDetailsData();
    if(this.itemDetails){
      console.log('loadThumbnailLinks() title:', this.itemDetails.Title);

      const keyword = this.itemDetails.Title;
      //console.log('loadThumbnailLinks() keyword:', keyword);
      const numResults = 8; // Replace with the number of results you want
      this.homeService.getGooglePhotos(keyword).subscribe(
        (data: any) => {
          // Assuming that the response contains a "thumbnailLinks" field
          console.log('Google Photos:', data);
          this.thumbnailLinks = data.thumbnailLinks;
          this.chunks = this.chunkArray(this.thumbnailLinks, 3);
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
      this.loadThumbnailLinks() ;
    }
  }


chunkArray(array:any, size:any) {
  let results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}


}
