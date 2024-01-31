import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { get } from 'jquery';


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  //private serverUrl = 'http://localhost:3000';
  private serverUrl = 'http://testnode-env.eba-zwpzdqvd.us-east-1.elasticbeanstalk.com';


  constructor(private http: HttpClient) {}

  private formObject: any;

  setForm(data:any): any {
    this.formObject = data;
  }

  getForm(): any {
    return this.formObject;
  }

  searchEbay(item:any): Observable<any> {
    console.log('searchEbay() item:', item);
    const url = `${this.serverUrl}/search-ebay`;
    return this.http.get(url, { params: item });
  }

  // searchSimilar(): Observable<any> {]]]]]]
  //   const url = `${this.serverUrl}/search-similar`;
  //   return this.http.get(url, { params: { itemId } });
  // }

  getSingleEbayItem(itemId: string): Observable<any> {
    const url = `${this.serverUrl}/get-single-item/${itemId}`;
    return this.http.get(url);
  }

  getSimilarItems(itemId: string): Observable<any> {
    console.log('getSimilarItems() id:', itemId);
    const url = `${this.serverUrl}/search-similar`;
    return this.http.get(url, { params: { itemId } });
  }

  getGooglePhotos(keyword: string): Observable<any> {
    const url = `${this.serverUrl}/search-google`;
    //const url = `${this.serverUrl}/get-google-photos/${keyword}`;
    return this.http.get(url, { params: { keyword } });
  }

  addToWishList(data: any): Observable<any> {
    console.log('addToWishList() data:', data);
    const url = `${this.serverUrl}/post-wish-list`;

    // Set the Content-Type header to application/json
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, JSON.stringify(data), httpOptions);
  }

  getWishList():Observable<any> {
    const url = `${this.serverUrl}/get-wish-list`;
    return this.http.get(url);
  }

  deleteWishListItem(itemId: string): Observable<any> {
    console.log('deleteWishListItem() itemId:', itemId);
    const url = `${this.serverUrl}/delete-wish-list-item/${itemId}`;
    return this.http.delete(url);
  }

  getUserIp(): Observable<any> {
    return this.http.get('https://ipinfo.io/json?token=543916f91709cc');
  }

  getZipCode(zipCode:string): Observable<any> {
    console.log('getZipCode() zipCode:', zipCode);
    return this.http.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${zipCode}&maxRows=5&username=heidi04111&country=US`);
  }

  start:boolean = false;
  setStartLoadingData(){
    this.start = true;
  }

  getStartLoadingData(){
    return this.start;
  }

  sipping:any;
  setitemShippingDetail(data:any){
    this.sipping =data;
  }

  getitemShippingDetail(){
    return this.sipping;
  }

}


/*

“How to create a service in Angular” prompt (6 line). ChatGPT, 4 Sep. version, OpenAI, 11/1/2023, chat.openai.com/chat.

*/
