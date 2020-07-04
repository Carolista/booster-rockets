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
  numberOfCards: number = questionBank.length;
  keyword: string = "";
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

  // search(searchTerm: string): void {
  //   let matchingSatellites: Satellite[] = [];
  //   searchTerm = searchTerm.toLowerCase();
  //   for(let i=0; i < this.sourceList.length; i++) {
  //       let name = this.sourceList[i].name.toLowerCase();
  //       let type = this.sourceList[i].type.toLowerCase();
  //       let orbitType = this.sourceList[i].orbitType.toLowerCase();
  //       if (name.indexOf(searchTerm) >= 0 || type.indexOf(searchTerm) >= 0 || orbitType.indexOf(searchTerm) >= 0) {
  //           matchingSatellites.push(this.sourceList[i]);
  //       }
  //   }
  //   this.displayList = matchingSatellites;
  // }

  searchTermFound(term: string, card: Flashcard): boolean {
    term = term.toLowerCase();
    let category = card.category.toLowerCase();
    let topic = card.topic.toLowerCase();
    let query = card.query.toLowerCase();
    let choices = card.choices.toString().toLowerCase();
    if (category.indexOf(term) >=0
        || topic.indexOf(term) >= 0
        || query.indexOf(term) >= 0
        || choices.indexOf(term) >= 0) {
          return true;
        }
    return false;
  }

  getFlashcardResults() {

    // start with all possible questions in a new array
    this.flashcardResults = questionBank.slice(0);

    // filter results
    let i: number = 0;
    while (i < this.flashcardResults.length) {
      let card = this.flashcardResults[i];

      // narrow based on keyword
      if (this.keyword.length > 0 && !this.searchTermFound(this.keyword,card)) {
        this.flashcardResults.splice(i,1);
        continue; // end loop and do not advance i due to splice
      }

      // narrow based on dropdown options
      if (this.selectedCategory !== "") {
        if (this.selectedCategory !== card.category) {
          this.flashcardResults.splice(i,1);
          continue; 
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
