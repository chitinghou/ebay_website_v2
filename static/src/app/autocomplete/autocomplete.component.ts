import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {
  @Input() control: FormControl = new FormControl();
  @Input() suggestions: string[] = [];
  @Output() suggestionSelected = new EventEmitter<string>();

  onSelectSuggestion(suggestion: string) {
    this.suggestionSelected.emit(suggestion);
  }
}
