import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.component.html',
  styleUrls: ['./image-model.component.css']
})
export class ImageModelComponent{
  @Input() itemDetails: any;
  @Input() showModal : boolean = false;
  @Input() currentImage: string = '';
  private currentIndex: number = 0;

  @Output() closeModalEvent = new EventEmitter<boolean>();

  closeModal() {
    this.closeModalEvent.emit();
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentImage = this.itemDetails.productImages[this.currentIndex];
    }
  }

  nextImage() {
    if (this.currentIndex < this.itemDetails.productImages.length - 1) {
      this.currentIndex++;
      this.currentImage = this.itemDetails.productImages[this.currentIndex];
    }
  }

}
