import { Component, OnInit } from '@angular/core';
import questionBank from '../../../assets/question-bank.json';
import { Flashcard } from 'src/app/flashcard';
import { User } from 'src/app/user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchType: string = "flashcard";
  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = [];
  selectedCategory: string = "";
  selectedTopic: string = "";
  selectedType: string = "";
  
  flashcardResults: Flashcard[] = [];
  userResults: User[] = [];


  constructor() { }

  ngOnInit() {
    this.buildSelectionArrays();
  }

  findCategory(category: string): number {
    for (let i=0; i < this.allCategories.length; i++) {
      if (this.allCategories[i] === category) {
        return i;
      }
    }
    return -1;
  }

  findTopic(topic: string): number {
    for (let i=0; i < this.allTopics.length; i++) {
      if (this.allTopics[i] === topic) {
        return i;
      }
    }
    return -1;
  }

  findType(type: string): number {
    for (let i=0; i < this.allTypes.length; i++) {
      if (this.allTypes[i] === type) {
        return i;
      }
    }
    return -1;
  }

  buildSelectionArrays() {
    let index: number;
    questionBank.forEach(obj => {
      index = this.findCategory(obj.category);
      if (index === -1) {
        this.allCategories.push(obj.category);
      }
      index = this.findTopic(obj.topic);
      if (index === -1) {
        this.allTopics.push(obj.topic);
      } 
      index = this.findType(obj.type);
      if (index === -1) {
        this.allTypes.push(obj.type);
      } 
    });
    this.allCategories.sort((a, b) => (a > b) ? 1 : -1);
    this.allTopics.sort((a, b) => (a > b) ? 1 : -1);
    this.allTypes.sort((a, b) => (a > b) ? 1 : -1);
  }

  buildFlashcardResults() {

    // reset results array
    this.flashcardResults = [];

    // build flashcard results from question bank
    questionBank.forEach(obj => {
      let card = new Flashcard(obj.category, obj.topic, obj.type, obj.query, obj.choices, obj.answer);
      // add card only if it fits user's criteria
      if (this.selectedCategory === "" || this.selectedCategory === card.category) {
        this.flashcardResults.push(card);
      }      
    });

    console.log("Flashcard results ready.")
  }

}
