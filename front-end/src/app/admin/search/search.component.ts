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

  letters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  flashcardResults: Flashcard[] = [];
  userResults: User[] = [];


  constructor() { }

  ngOnInit() {
    this.buildSelectionArrays();
    this.getFlashcardResults();
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

  getFlashcardResults() {

    // start with all possible questions in a new array
    this.flashcardResults = questionBank.slice(0);
    
    // build flashcard results from question bank
    let i: number = 0;
    while (i < this.flashcardResults.length) {
      let card = this.flashcardResults[i];
      if (this.selectedCategory !== "") {
        if (this.selectedCategory !== card.category) {
          this.flashcardResults.splice(i,1);
          continue; // end loop and do not advance i due to splice
        }        
      }
      if (this.selectedTopic !== "") {
        if (this.selectedTopic !== card.topic) {
          this.flashcardResults.splice(i,1);
          continue;
        }        
      }
      if (this.selectedType !== "") {
        if (this.selectedType !== card.type) {
          this.flashcardResults.splice(i,1);
          continue;
        }        
      }
      // otherwise it is kept in the array and i increases
      i++
    }

    console.log("Flashcard results ready.")
  }

}
