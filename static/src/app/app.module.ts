import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeService } from './home.service';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './form/form.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ProductTabComponent } from './product-tab/product-tab.component';
import { PhotosTabComponent } from './photos-tab/photos-tab.component';
import { ShippingTabComponent } from './shipping-tab/shipping-tab.component';
import { SellerTabComponent } from './seller-tab/seller-tab.component';
import { SimilarProductsTabComponent } from './similar-products-tab/similar-products-tab.component';
import { ImageModelComponent } from './image-model/image-model.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { WishListComponent } from './wish-list/wish-list.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailRecordComponent } from './detail-record/detail-record.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    SearchResultComponent,
    ItemDetailsComponent,
    ProductTabComponent,
    PhotosTabComponent,
    ShippingTabComponent,
    SellerTabComponent,
    SimilarProductsTabComponent,
    ImageModelComponent,
    WishListComponent,
    AutocompleteComponent,
    DetailRecordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoundProgressModule,
    BrowserAnimationsModule,
  ],
  providers: [HomeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
