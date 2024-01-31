import { Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HomeService } from '../home.service';
import { DetailDataService } from '../detail-data.service';
import { SearchResultComponent } from '../search-result/search-result.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @ViewChild(SearchResultComponent) searchResultComponent!: SearchResultComponent;
  searchParams: FormGroup;
  selectedConditions: string[] = []; // Array to store selected conditions
  zipCode:any;
  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private detailDataService: DetailDataService
    ) {
      this.loadingZipCode();
    this.searchParams = this.formBuilder.group({
      keyword: ['', [Validators.required, this.keywordValidator]],
      category: ['All Categories'],
      distance: ['10'],
      locationOption: ['current'],
      otherLocation: [{value:'', disabled:true}, [Validators.required, this.keywordValidator]],
      New: [],
      Used: [],
      Unspecified: [],
      localPickup: [],
      freeShipping: [],
      zipCode: [],
      conditions: []
    });


  }

  isLocationObtained: boolean = true;
  isSubmitted: boolean = false;

  keywordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if(value != null){
      if (value.trim() === '' && value.length !=0) {
        return { 'invalidKeyword': true }; // Return a validation error if it's empty or contains only spaces
      }
    }

    return null; // Validation passed
  }

  onSubmit() {
    this.isSubmitted = true;
    this.searchParams.get('zipCode')?.setValue(this.zipCode);

    const conditions = [];
    conditions.push("default");
    const conditionsArray = this.searchParams.get('conditions') as FormControl;
    if (this.searchParams.get('New')?.value == true) {
      conditions.push("New");
    }
    if (this.searchParams.get('Used')?.value == true) {
      conditions.push("Used");
    }
    if (this.searchParams.get('Unspecified')?.value == true) {
      conditions.push("Unspecified");
    }
    conditionsArray.setValue( conditions);
    console.log(this.searchParams.value);
    this.homeService.setForm(this.searchParams.value);
    this.homeService.setStartLoadingData();

    this.searchResultComponent.loadResult(this.searchParams.value);
  }

  onClear() {
    this.isSubmitted = false;
    // Clear form fields and reset validation errors
    this.searchParams = this.formBuilder.group({
      keyword: ['', [Validators.required, this.keywordValidator]],
      category: ['All Categories'],
      distance: ['10'],
      locationOption: ['current'],
      otherLocation: [{value:'', disabled:true}, [Validators.required, this.keywordValidator]],
      New: [],
      Used: [],
      Unspecified: [],
      localPickup: [],
      freeShipping: [],
      zipCode: [],
      conditions: []
    });
    this.selectedConditions = []; // Clear the selected conditions
    this.suggestions = [];
    this.searchResultComponent.clearResult();
    this.detailDataService.setEbayData(null);
  }


  // get isOtherLocationDisabled(){
  //   return this.searchParams.get('locationOption')?.value != 'other';
  // }

  onLocationOptionChange(){
    console.log('onLocationOptionChange():', this.searchParams.get('locationOption')?.value);
    if(this.searchParams.get('locationOption')?.value == 'other'){
      this.searchParams.get('otherLocation')?.enable();
    }else{
      this.loadingZipCode();
      this.searchParams.get('otherLocation')?.disable();
      this.searchParams.get('otherLocation')?.reset();
    }
  }

  loadingZipCode(){
    this.homeService.getUserIp().subscribe((data: any) => {
      console.log('User postal:', data.postal);
      this.zipCode = data.postal;
    });
  }

  suggestions: string[] = [];
  otherLocationControl: FormControl = new FormControl('');
  zipCodeSuggestion(){
    console.log('zipCodeSuggestion()');
    const zipCode = this.searchParams.get('otherLocation')?.value;
    console.log('zipCode:', zipCode);
    if(zipCode){
      this.homeService.getZipCode(zipCode).subscribe((data: any) => {
        console.log('User postal:', data);
        this.suggestions = data.postalCodes.map((item: any) => item.postalCode);
      });
    }else{
      this.suggestions = [];
    }
  }
  getOtherLocationControl(): FormControl | null {
    return this.searchParams.get('otherLocation') as FormControl;
  }


  onSuggestionsClick(zipCode: string){
    this.searchParams.get('zipCode')?.setValue(zipCode);
    this.suggestions = [];
  }


  activeComponent: 'search' | 'wish' = 'search';
  showResults(){
    this.activeComponent = 'search';
  }
  showWishList(){
    this.activeComponent = 'wish';
  }


}
