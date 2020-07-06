import { Component, OnInit } from '@angular/core';
// import allFlashcards from '../../../assets/question-bank.json';
import { Flashcard } from 'src/app/flashcard';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  allFlashcards: Flashcard[];
  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = [];
  
  // flashcard: Flashcard = new Flashcard("","","","",[],"");

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
    this.allFlashcards.forEach(obj => {
      index = this.findCategory(obj.category);
      if (index === -1) {
        this.allCategories.push(obj.category);
        console.log("added category " + obj.category);
      }
      index = this.findTopic(obj.topic);
      if (index === -1) {
        this.allTopics.push(obj.topic);
        console.log("added topic " + obj.topic);
      } 
      index = this.findType(obj.type);
      if (index === -1) {
        this.allTypes.push(obj.type);
        console.log("added type " + obj.type);
      } 
    });
    this.allCategories.sort((a, b) => (a > b) ? 1 : -1);
    this.allTopics.sort((a, b) => (a > b) ? 1 : -1);
    this.allTypes.sort((a, b) => (a > b) ? 1 : -1);
  }

  // saveChoiceA() {
  //   this.flashcard.choices[0] = this.flashcard.answer;
  // }

  saveFlashcard() {
    // TODO: write once back end is in place
  }


}
