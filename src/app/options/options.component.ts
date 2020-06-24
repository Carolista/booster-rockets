import { Component, OnInit } from '@angular/core';
import questionBank from '../../assets/question-bank.json';
import { Filters } from '../filters';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  dataReady: boolean = false; // TODO: prevent page from being visible until this is true
  categories: string[] = [];
  types: string[] = [];
  filters: Filters;

  constructor() { }

  ngOnInit() {
    this.getFilterOptions();
  }

  getFilterOptions() {
    questionBank.forEach(obj => {
      if (! this.categories.includes(obj.category)) {
        this.categories.push(obj.category);
      } 
      if (! this.types.includes(obj.type)) {
        this.types.push(obj.type);
      } 
    });
    this.categories.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Categories are: " + this.categories);
    this.types.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Types are: " + this.types);
    this.filters = new Filters(null, this.categories, this.types); // TODO: later this will come from user
    this.dataReady = true;
  }
}
